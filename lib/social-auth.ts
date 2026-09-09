import { Clerk } from '@clerk/clerk-js'

const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_bGlnaHQtbXV0dC03Mi5jbGVyay5hY2NvdW50cy5kZXYk'

// Use env var if set (allows per-environment config), fallback to dynamic origin
const getRedirectUri = () => {
    if (typeof window === 'undefined') return ''
    return process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL || `${window.location.origin}/oauth-callback`
}

let clerkInstance: Clerk | null = null

const getClerk = async () => {
    if (clerkInstance) return clerkInstance
    clerkInstance = new Clerk(CLERK_PUBLISHABLE_KEY)
    await clerkInstance.load()
    return clerkInstance
}

export interface OAuthResult {
    email: string
    fullName: string
    provider: 'google' | 'facebook' | 'apple'
}

type Provider = 'google' | 'facebook' | 'apple'

/** One-time code linking the tab that starts a sign-in to the one that finishes it. */
const createSessionId = () => {
    const bytes = new Uint8Array(24)
    crypto.getRandomValues(bytes)
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

const encodeState = (data: Record<string, string>) =>
    btoa(JSON.stringify(data)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

export const decodeState = (raw: string): Record<string, string> | null => {
    if (!raw) return null
    try {
        return JSON.parse(atob(raw.replace(/-/g, '+').replace(/_/g, '/')))
    } catch {
        // Legacy "provider_portal_origin" states, still in flight across a deploy.
        const first = raw.indexOf('_')
        const second = raw.indexOf('_', first + 1)
        if (first === -1) return null
        return {
            provider: raw.substring(0, first),
            portal: raw.substring(first + 1, second === -1 ? undefined : second),
            origin: second === -1 ? '' : raw.substring(second + 1),
        }
    }
}

/**
 * In the mobile app Capacitor routes external URLs to the system browser, so
 * the popup we open here is a stub that closes immediately while the real
 * sign-in continues somewhere we can't see.
 */
const isNativeApp = () =>
    typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.()

const HANDOFF_TIMEOUT_MS = 5 * 60 * 1000
/** Below this, a closed popup means the URL was handed off, not that the user bailed. */
const HANDOFF_DETECT_MS = 3000
/** After a real cancel, give a result already in flight a moment to land. */
const CANCEL_GRACE_MS = 5000

const openAuthWindow = (authUrl: string, title: string): Window | null => {
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    const popup = window.open(authUrl, title, `width=${width},height=${height},left=${left},top=${top}`)
    if (popup || !isNativeApp()) return popup

    // Some WebViews refuse window.open outright. Assigning location instead
    // still reaches the system browser, because Capacitor intercepts the
    // navigation and fires an intent without unloading this page.
    window.location.href = authUrl
    return null
}

/**
 * Resolves when the sign-in finishes, whichever route it comes back by: a
 * postMessage from the popup (desktop web) or a result parked on the server by
 * a callback page running in another browser (the mobile app).
 */
const waitForOAuth = (provider: Provider, sessionId: string, popup: Window | null): Promise<OAuthResult> =>
    new Promise((resolve, reject) => {
        const openedAt = Date.now()
        const deadline = openedAt + HANDOFF_TIMEOUT_MS
        let settled = false
        let closedAt: number | null = null

        const cleanup = () => {
            window.removeEventListener('message', handleMessage)
            clearInterval(poll)
        }
        const succeed = (result: OAuthResult) => {
            if (settled) return
            settled = true
            cleanup()
            resolve(result)
        }
        const fail = (message: string) => {
            if (settled) return
            settled = true
            cleanup()
            reject(new Error(message))
        }

        function handleMessage(event: MessageEvent) {
            if (event.origin !== window.location.origin) return
            if (event.data?.type === 'oauth-success' && event.data.provider === provider) {
                succeed({ email: event.data.email, fullName: event.data.fullName, provider })
            } else if (event.data?.type === 'oauth-error') {
                fail(event.data.error || 'OAuth authentication failed')
            }
        }
        window.addEventListener('message', handleMessage)

        const poll = setInterval(async () => {
            try {
                const res = await fetch(`/api/auth/oauth-handoff?sessionId=${encodeURIComponent(sessionId)}`)
                const data = await res.json()
                if (data?.pending === false && data.result) {
                    if (data.result.error) fail(data.result.error)
                    else succeed({ email: data.result.email, fullName: data.result.fullName, provider })
                    return
                }
            } catch {
                // Offline or a blip — the next tick retries.
            }

            const now = Date.now()
            if (now > deadline) {
                fail('Authentication timed out. Please try again.')
                return
            }

            let closed = false
            try {
                closed = !!popup?.closed
            } catch {
                // COOP blocks the read; assume still open and let polling decide.
            }
            if (!closed) return
            if (closedAt === null) closedAt = now

            // A popup that dies almost immediately was never really a popup: the
            // URL went to the system browser and the answer will arrive by
            // handoff, so keep polling rather than calling it a cancellation.
            if (isNativeApp() || !popup || closedAt - openedAt < HANDOFF_DETECT_MS) return

            if (now - closedAt > CANCEL_GRACE_MS) fail('Authentication cancelled')
        }, 1500)
    })

/**
 * Initialize Google OAuth login
 * Opens a popup window for Google authentication
 */
export const initGoogleLogin = (portal: string): Promise<OAuthResult> => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '710442251981-li0tlcqed9b61jrn8k6744a0ta8br1r7.apps.googleusercontent.com'
    const redirectUri = getRedirectUri()
    const sessionId = createSessionId()
    // The callback needs the opener's origin to postMessage back, and the
    // sessionId to park the result when there's no opener to talk to.
    const state = encodeState({ provider: 'google', portal, origin: window.location.origin, sessionId })

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=token&` +
        `scope=openid email profile&` +
        `state=${encodeURIComponent(state)}`

    const popup = openAuthWindow(authUrl, 'Google Sign In')
    if (!popup && !isNativeApp()) {
        return Promise.reject(new Error('Popup blocked. Please allow popups for this site.'))
    }
    return waitForOAuth('google', sessionId, popup)
}

/**
 * Initialize Facebook OAuth login
 * Opens a popup window for Facebook authentication
 */
export const initFacebookLogin = (portal: string): Promise<OAuthResult> => {
    return new Promise(async (resolve, reject) => {
        try {
            const clerk = await getClerk()
            if (!clerk.client) throw new Error('Clerk client failed to load')

            if (clerk.user) {
                resolve({
                    email: clerk.user.primaryEmailAddress?.emailAddress || '',
                    fullName: clerk.user.fullName || clerk.user.firstName || '',
                    provider: 'facebook'
                })
                return
            }

            const redirectUri = getRedirectUri()
            const sessionId = createSessionId()
            const state = encodeState({ provider: 'facebook', portal, origin: window.location.origin, sessionId })
            const signIn = await clerk.client.signIn.create({
                strategy: 'oauth_facebook',
                redirectUrl: `${redirectUri}?state=${encodeURIComponent(state)}`,
            })

            const authUrl = signIn.firstFactorVerification.externalVerificationRedirectURL
            if (!authUrl) throw new Error('Failed to get OAuth redirection URL')

            const popup = openAuthWindow(String(authUrl), 'Facebook Sign In')
            if (!popup && !isNativeApp()) {
                reject(new Error('Popup blocked. Please allow popups for this site.'))
                return
            }

            waitForOAuth('facebook', sessionId, popup).then(resolve, reject)
        } catch (error: any) {
            if (error.message?.toLowerCase().includes('already signed in')) {
                const clerk = await getClerk()
                if (clerk.user) {
                    resolve({ email: clerk.user.primaryEmailAddress?.emailAddress || '', fullName: clerk.user.fullName || clerk.user.firstName || '', provider: 'facebook' })
                    return
                }
            }
            reject(new Error('Failed to initialize Facebook login: ' + error.message))
        }
    })
}

/**
 * Initialize Apple OAuth login
 * Opens a popup window for Apple authentication
 */
export const initAppleLogin = (portal: string): Promise<OAuthResult> => {
    const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID

    if (!clientId) {
        return Promise.reject(new Error('Apple Sign In is not available yet. Please use email/password or Google login.'))
    }

    const redirectUri = getRedirectUri()
    const sessionId = createSessionId()
    const state = encodeState({ provider: 'apple', portal, origin: window.location.origin, sessionId })

    const authUrl = `https://appleid.apple.com/auth/authorize?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code id_token&` +
        `scope=name email&` +
        `response_mode=form_post&` +
        `state=${encodeURIComponent(state)}`

    const popup = openAuthWindow(authUrl, 'Apple Sign In')
    if (!popup && !isNativeApp()) {
        return Promise.reject(new Error('Popup blocked. Please allow popups for this site.'))
    }
    return waitForOAuth('apple', sessionId, popup)
}

/** What the callback page should show once it has done its job. */
export type CallbackOutcome =
    | { status: 'handed-off'; provider: string }
    | { status: 'closing' }
    | { status: 'error'; message: string }

/** Park the result for an app that is polling from a different browser. */
const parkResult = async (sessionId: string, payload: Record<string, unknown>) => {
    if (!sessionId) return false
    try {
        const res = await fetch('/api/auth/oauth-handoff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, ...payload }),
        })
        return res.ok
    } catch {
        return false
    }
}

/**
 * Handle OAuth callback and hand the result back to whoever started the sign-in.
 * This should be called from the OAuth callback page.
 */
export const handleOAuthCallback = async (): Promise<CallbackOutcome> => {
    if (typeof window === 'undefined') return { status: 'closing' }

    const params = new URLSearchParams(window.location.hash.substring(1))
    const searchParams = new URLSearchParams(window.location.search)

    const stateRaw = searchParams.get('state') || params.get('state') || ''
    const accessToken = params.get('access_token')
    const code = searchParams.get('code')

    const parsed = decodeState(decodeURIComponent(stateRaw))
    if (!parsed?.provider) {
        window.opener?.postMessage({ type: 'oauth-error', error: 'Invalid state parameter' }, '*')
        window.close()
        return { status: 'error', message: 'This sign-in link is invalid or has expired.' }
    }

    const { provider, portal = '', sessionId = '' } = parsed
    const targetOrigin = parsed.origin || window.location.origin

    // When the sign-in ran in the system browser there is no opener to talk to,
    // so the result goes to the server and the app collects it from there.
    const hasOpener = (() => {
        try {
            return !!window.opener && !window.opener.closed
        } catch {
            return !!window.opener
        }
    })()

    try {
        let email = ''
        let fullName = ''

        if (provider === 'google' && accessToken) {
            // Fetch user info from Google
            const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            const data = await response.json()
            email = data.email || ''
            fullName = data.name || (email.includes('@') ? email.split('@')[0] : email)
        } else if (provider === 'facebook') {
            console.log('Processing Facebook callback...')
            // For Clerk-bridged Facebook, user data is available in the Clerk session
            const clerk = await getClerk()

            try {
                console.log('Calling handleRedirectCallback...')
                // Swallowing the navigation keeps Clerk from redirecting us off
                // this page; the shared exit below reports the result instead.
                await clerk.handleRedirectCallback({}, async () => {
                    console.log('Clerk redirect handled successfully')
                })
            } catch (e) {
                console.error('Clerk handleRedirectCallback failed:', e)
            }

            // Wait for Clerk to synchronize session
            let user = clerk.user
            let attempts = 0
            while (!user && attempts < 20) {
                await new Promise(resolve => setTimeout(resolve, 500))
                user = clerk.user
                attempts++
            }

            if (user) {
                email = user.primaryEmailAddress?.emailAddress || ''
                fullName = user.fullName || user.firstName || ''
            } else {
                console.log('User still null, checking signIn status...')
                // One last try: Check if the signIn is complete but session isn't synced
                const signIn = clerk.client?.signIn
                if (signIn && signIn.status === 'complete' && signIn.createdSessionId) {
                    console.log('SignIn complete, attempting to set session active manually...')
                    await clerk.setActive({ session: signIn.createdSessionId })
                    const finalUser = clerk.user
                    if (finalUser) {
                        email = finalUser.primaryEmailAddress?.emailAddress || ''
                        fullName = finalUser.fullName || finalUser.firstName || ''
                    }
                }

                if (!email) {
                    console.error('Final attempt failed. Clerk State:', {
                        loaded: clerk.loaded,
                        session: clerk.session?.id,
                        signInStatus: signIn?.status
                    })
                    throw new Error('Could not retrieve user info from Clerk session after multiple attempts')
                }
            }
        } else if (provider === 'apple' && code) {
            // Apple's code still has to be exchanged on the backend, so pass it
            // straight through rather than resolving an email here.
            window.opener?.postMessage({
                type: 'oauth-success',
                provider: 'apple',
                code,
                portal
            }, window.location.origin)
            window.close()
            return { status: 'closing' }
        }

        if (!email) {
            throw new Error('Could not retrieve email from provider')
        }

        const resolvedName = fullName || (email.includes('@') ? email.split('@')[0] : email)

        if (!hasOpener) {
            const parked = await parkResult(sessionId, { provider, portal, email, fullName: resolvedName })
            if (parked) return { status: 'handed-off', provider }
            return { status: 'error', message: 'Signed in, but the result could not be sent back to the app. Please try again.' }
        }

        window.opener?.postMessage({
            type: 'oauth-success',
            provider,
            email,
            fullName: resolvedName,
            portal
        }, targetOrigin)

        window.close()
        return { status: 'closing' }
    } catch (error: any) {
        const message = error?.message || 'Failed to complete authentication'

        if (!hasOpener) {
            await parkResult(sessionId, { provider, portal, error: message })
            return { status: 'error', message }
        }

        window.opener?.postMessage({ type: 'oauth-error', error: message }, targetOrigin)
        window.close()
        return { status: 'error', message }
    }
}
