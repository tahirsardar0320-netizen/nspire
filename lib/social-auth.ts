import { Clerk } from '@clerk/clerk-js'
import { fetchWithTimeout } from './httpFetch';

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

/**
 * Builds a query string with every value percent-encoded. Hand-concatenating
 * these left raw spaces in `scope` (and Apple's `response_type`); a browser
 * silently cleaned those up when we navigated to the URL, but the in-app
 * browser hands the string straight to the platform, which passes the spaces
 * through and makes the provider reject the whole request as invalid_request.
 * URLSearchParams encodes a space as "+", which is only correct for form
 * bodies, so normalise it to %20 for use in a URL.
 */
const buildQuery = (params: Record<string, string>) =>
    new URLSearchParams(params).toString().replace(/\+/g, '%20')

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

/**
 * While the in-app browser is in front, the host WebView is backgrounded and
 * its timers stop, so the polling below never notices that sign-in finished —
 * the user has to back out of the browser themselves before anything happens.
 * Opening this scheme from the callback page hands control straight back to the
 * app, which dismisses the browser. Registered in AndroidManifest.xml and
 * Info.plist; a build without it simply falls back to the old manual return.
 */
const APP_RETURN_URL = 'com.nspireapp://auth-done'

const returnToNativeApp = () => {
    try {
        window.location.href = APP_RETURN_URL
    } catch {
        // Scheme not registered on this build — the user comes back manually.
    }
}

const HANDOFF_TIMEOUT_MS = 5 * 60 * 1000
/** Below this, a closed popup means the URL was handed off, not that the user bailed. */
const HANDOFF_DETECT_MS = 3000
/** After a real cancel, give a result already in flight a moment to land. */
const CANCEL_GRACE_MS = 5000
/** Once the in-app browser is dismissed and the app is on screen again, how
 * long to keep polling before treating the sign-in as abandoned. Without this
 * the caller stays "loading" — and every social button stays disabled — for the
 * full handoff timeout, which reads as the buttons being dead. */
const NATIVE_RETURN_GRACE_MS = 8000

/**
 * Capacitor.Plugins is only ever populated by a plugin's own JS package calling
 * registerPlugin(). This web app is loaded remotely into the WebView and never
 * bundles those packages, so `Capacitor.Plugins.Browser` is always undefined
 * here no matter what is installed natively — which is why the in-app browser
 * silently never opened. The native bridge does expose every registered native
 * plugin through Capacitor.PluginHeaders + Capacitor.nativePromise, which is
 * exactly what the JS proxies call under the hood, so go through that instead.
 */
const hasNativePlugin = (name: string): boolean => {
    const cap = (window as any).Capacitor
    if (typeof cap?.nativePromise !== 'function') return false
    return Array.isArray(cap.PluginHeaders) && cap.PluginHeaders.some((h: any) => h?.name === name)
}

const callNativePlugin = (plugin: string, method: string, options?: unknown): Promise<any> =>
    (window as any).Capacitor.nativePromise(plugin, method, options)

/** Apple's Guideline 4 (and the equivalent Play Store expectation) requires
 * sign-in to stay inside the app — handing off to the system browser reads as
 * leaving the app entirely, even though it comes back via the same handoff
 * mechanism. The Browser plugin presents an in-app SFSafariViewController /
 * Chrome Custom Tab instead, which both platforms accept. */
const closeNativeAuthBrowser = () => {
    if (!isNativeApp() || !hasNativePlugin('Browser')) return
    callNativePlugin('Browser', 'close').catch(() => {})
}

/**
 * Every provider opens the same way: the Browser plugin, which presents an
 * SFSafariViewController on iOS and a Chrome Custom Tab on Android.
 *
 * Google used to be special-cased here to `window.location.href = authUrl`, on
 * the belief that Google rejects in-app browsers outright. That was half right
 * and caused the black screen on iPhone. What Google blocks is a raw embedded
 * WebView — and assigning location.href navigates the app's *own* WebView,
 * which is exactly that. Worse, the flow ends by redirecting to
 * com.nspireapp://auth-done, a scheme a WebView cannot load, so it was left
 * sitting on a dead page with nothing on it.
 *
 * SFSafariViewController and Chrome Custom Tabs are a real browser with the
 * user's own session, and are what Google's own mobile OAuth guidance asks for.
 * The earlier "400 invalid_request" that prompted the workaround came from
 * prompt=select_account, which has since been removed.
 */
const openAuthWindow = (authUrl: string, title: string): Window | null => {
    if (isNativeApp()) {
        if (hasNativePlugin('Browser')) {
            callNativePlugin('Browser', 'open', { url: authUrl }).catch(() => {
                // The in-app browser refused to present. Falling back to a
                // plain navigation is worse UX, but it beats leaving the user
                // tapping a button that appears to do nothing at all.
                window.location.href = authUrl
            })
            return null
        }
        // Build without the Browser plugin available — fall back to the
        // system-browser handoff rather than failing silently.
        window.location.href = authUrl
        return null
    }

    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    return window.open(authUrl, title, `width=${width},height=${height},left=${left},top=${top}`)
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
        // Native only: set once the app has been backgrounded (the in-app
        // browser took over) and then brought back to the foreground.
        let returnedAt: number | null = null
        let wasHidden = false

        const cleanup = () => {
            window.removeEventListener('message', handleMessage)
            document.removeEventListener('visibilitychange', handleVisibility)
            clearInterval(poll)
            closeNativeAuthBrowser()
        }

        function handleVisibility() {
            if (document.visibilityState === 'hidden') {
                wasHidden = true
                returnedAt = null
            } else if (wasHidden && returnedAt === null) {
                returnedAt = Date.now()
            }
        }
        document.addEventListener('visibilitychange', handleVisibility)
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
                // Short: this runs on an interval, so a stalled poll must not
                // outlive the sign-in attempt it belongs to.
                const res = await fetchWithTimeout(`/api/auth/oauth-handoff?sessionId=${encodeURIComponent(sessionId)}`, {}, 15000)
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

            // In the app there is no popup handle to watch. Instead, the user
            // coming back to a foregrounded app means they dismissed the in-app
            // browser; if nothing lands shortly after that, stop waiting so the
            // caller can re-enable its buttons instead of appearing frozen.
            if (isNativeApp()) {
                if (returnedAt !== null && now - returnedAt > NATIVE_RETURN_GRACE_MS) {
                    fail('Authentication cancelled')
                }
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
            if (!popup || closedAt - openedAt < HANDOFF_DETECT_MS) return

            if (now - closedAt > CANCEL_GRACE_MS) fail('Authentication cancelled')
        }, 1500)
    })


/**
 * A sign-in in progress, remembered across a reload.
 *
 * waitForOAuth only lives in memory. On a phone the in-app browser routinely
 * causes the host WebView to be reloaded or discarded, which destroys the
 * promise — the provider then parks a perfectly good result on the server and
 * nobody is left listening for it, so returning to the app did nothing at all
 * and the user had to start again. Recording the session lets the app pick the
 * result up whenever it next runs.
 */
const PENDING_KEY = 'inspire_pending_oauth'
const PENDING_MAX_AGE_MS = 10 * 60 * 1000

type PendingOAuth = { sessionId: string; provider: Provider; portal: string; startedAt: number }

const rememberPendingOAuth = (sessionId: string, provider: Provider, portal: string) => {
    try {
        localStorage.setItem(PENDING_KEY, JSON.stringify({ sessionId, provider, portal, startedAt: Date.now() }))
    } catch {
        // Storage full or unavailable — the in-memory path still works.
    }
}

export const clearPendingOAuth = () => {
    try {
        localStorage.removeItem(PENDING_KEY)
    } catch {}
}

const readPendingOAuth = (): PendingOAuth | null => {
    try {
        const raw = localStorage.getItem(PENDING_KEY)
        if (!raw) return null
        const p = JSON.parse(raw) as PendingOAuth
        if (!p?.sessionId || Date.now() - p.startedAt > PENDING_MAX_AGE_MS) {
            clearPendingOAuth()
            return null
        }
        return p
    } catch {
        return null
    }
}

/**
 * Collects a result left behind by a sign-in that was interrupted. Returns null
 * when there is nothing waiting. Safe to call on every page load.
 */
export const resumePendingOAuth = async (): Promise<(OAuthResult & { portal: string }) | null> => {
    const pending = readPendingOAuth()
    if (!pending) return null

    try {
        const res = await fetchWithTimeout(`/api/auth/oauth-handoff?sessionId=${encodeURIComponent(pending.sessionId)}`, {}, 15000)
        const data = await res.json()
        if (data?.pending !== false || !data.result) return null

        clearPendingOAuth()
        if (data.result.error) return null
        return {
            email: data.result.email,
            fullName: data.result.fullName,
            provider: pending.provider,
            portal: data.result.portal || pending.portal,
        }
    } catch {
        // Offline or a blip — leave it recorded and try again next time.
        return null
    }
}

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
    // OpenID Connect requires a nonce whenever an id_token is requested; it also
    // ties the token Google returns to this device's attempt.
    const nonce = createSessionId()
    const state = encodeState({ provider: 'google', portal, origin: window.location.origin, sessionId, nonce, native: isNativeApp() ? '1' : '' })

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + buildQuery({
        client_id: clientId,
        redirect_uri: redirectUri,
        // Identity only. Google has closed off the access-token implicit flow
        // for this kind of client: it was blocked outright in the in-app
        // browser, and in the device browser it failed right after the password
        // step. An id_token carries the user's identity directly and needs no
        // client secret, so there is nothing to exchange.
        response_type: 'id_token',
        nonce,
        scope: 'openid email profile',
        // Deliberately no `prompt`. Asking for the account chooser makes Google
        // render its full sign-in UI, which it refuses to serve inside an app's
        // in-app browser — the request came back as
        // "Access blocked: Authorization Error / 400 invalid_request" on iOS.
        // Without it Google completes silently against the session already on
        // the device, which is the only thing that works there today.
        state,
    })

    const popup = openAuthWindow(authUrl, 'Google Sign In')
    if (!popup && !isNativeApp()) {
        return Promise.reject(new Error('Popup blocked. Please allow popups for this site.'))
    }
    rememberPendingOAuth(sessionId, 'google', portal)
    return waitForOAuth('google', sessionId, popup).finally(clearPendingOAuth)
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
            const state = encodeState({ provider: 'facebook', portal, origin: window.location.origin, sessionId, native: isNativeApp() ? '1' : '' })
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

            rememberPendingOAuth(sessionId, 'facebook', portal)
            waitForOAuth('facebook', sessionId, popup).finally(clearPendingOAuth).then(resolve, reject)
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

    // Apple posts the result straight to this server route (response_mode=form_post),
    // not to the shared client-rendered /oauth-callback page Google/Facebook use.
    const redirectUri = `${window.location.origin}/api/auth/apple-callback`
    const sessionId = createSessionId()
    // OpenID Connect requires `nonce` whenever response_type includes id_token —
    // Apple's authorize endpoint refuses the request without one, which is what
    // made the sign-in page itself unreachable.
    const nonce = createSessionId()
    const state = encodeState({ provider: 'apple', portal, origin: window.location.origin, sessionId, nonce, native: isNativeApp() ? '1' : '' })

    const authUrl = `https://appleid.apple.com/auth/authorize?` + buildQuery({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code id_token',
        scope: 'name email',
        response_mode: 'form_post',
        nonce,
        state,
    })

    const popup = openAuthWindow(authUrl, 'Apple Sign In')
    if (!popup && !isNativeApp()) {
        return Promise.reject(new Error('Popup blocked. Please allow popups for this site.'))
    }
    rememberPendingOAuth(sessionId, 'apple', portal)
    return waitForOAuth('apple', sessionId, popup).finally(clearPendingOAuth)
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
        const res = await fetchWithTimeout('/api/auth/oauth-handoff', {
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
    const googleIdToken = params.get('id_token')
    const code = searchParams.get('code')

    const parsed = decodeState(decodeURIComponent(stateRaw))
    if (!parsed?.provider) {
        window.opener?.postMessage({ type: 'oauth-error', error: 'Invalid state parameter' }, '*')
        window.close()
        return { status: 'error', message: 'This sign-in link is invalid or has expired.' }
    }

    const { provider, portal = '', sessionId = '' } = parsed
    const targetOrigin = parsed.origin || window.location.origin
    // Set by the app when it started this sign-in, so the callback knows to
    // hand control back rather than leaving the browser sitting in front.
    const startedInApp = parsed.native === '1'

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

        if (provider === 'google' && googleIdToken) {
            // The identity comes back in the token itself, but it is only proof
            // of anything once its signature has been checked against Google's
            // keys — which has to happen on the server.
            const response = await fetchWithTimeout('/api/auth/google-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: googleIdToken, nonce: parsed.nonce }),
            })
            const data = await response.json()
            if (!data?.success) throw new Error(data?.message || 'Could not verify the Google sign-in')
            email = data.email || ''
            fullName = data.fullName || (email.includes('@') ? email.split('@')[0] : email)
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
            if (parked) {
                if (startedInApp) returnToNativeApp()
                return { status: 'handed-off', provider }
            }
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
