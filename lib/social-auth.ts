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

/**
 * Initialize Google OAuth login
 * Opens a popup window for Google authentication
 */
export const initGoogleLogin = (portal: string): Promise<OAuthResult> => {
    return new Promise((resolve, reject) => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '710442251981-li0tlcqed9b61jrn8k6744a0ta8br1r7.apps.googleusercontent.com'
        const redirectUri = getRedirectUri()
        // Encode opener origin in state so callback knows where to postMessage
        const openerOrigin = window.location.origin
        const state = encodeURIComponent(`google_${portal}_${openerOrigin}`)

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=token&` +
            `scope=openid email profile&` +
            `state=${state}`

        const width = 500
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2

        const popup = window.open(
            authUrl,
            'Google Sign In',
            `width=${width},height=${height},left=${left},top=${top}`
        )

        if (!popup) {
            reject(new Error('Popup blocked. Please allow popups for this site.'))
            return
        }

        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return
            if (event.data.type === 'oauth-success' && event.data.provider === 'google') {
                window.removeEventListener('message', handleMessage)
                resolve({ email: event.data.email, fullName: event.data.fullName, provider: 'google' })
            } else if (event.data.type === 'oauth-error') {
                window.removeEventListener('message', handleMessage)
                reject(new Error(event.data.error || 'OAuth authentication failed'))
            }
        }

        window.addEventListener('message', handleMessage)

        const checkClosed = setInterval(() => {
            try {
                if (popup.closed) {
                    clearInterval(checkClosed)
                    window.removeEventListener('message', handleMessage)
                    reject(new Error('Authentication cancelled'))
                }
            } catch (e) { /* COOP policy */ }
        }, 1000)
    })
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
            const openerOrigin = window.location.origin
            const signIn = await clerk.client.signIn.create({
                strategy: 'oauth_facebook',
                redirectUrl: `${redirectUri}?state=${encodeURIComponent(`facebook_${portal}_${openerOrigin}`)}`,
            })

            const authUrl = signIn.firstFactorVerification.externalVerificationRedirectURL
            if (!authUrl) throw new Error('Failed to get OAuth redirection URL')

            const width = 500, height = 600
            const left = window.screenX + (window.outerWidth - width) / 2
            const top = window.screenY + (window.outerHeight - height) / 2

            const popup = window.open(authUrl, 'Facebook Sign In', `width=${width},height=${height},left=${left},top=${top}`)
            if (!popup) { reject(new Error('Popup blocked. Please allow popups for this site.')); return }

            const handleMessage = (event: MessageEvent) => {
                if (event.origin !== window.location.origin) return
                if (event.data.type === 'oauth-success' && event.data.provider === 'facebook') {
                    window.removeEventListener('message', handleMessage)
                    resolve({ email: event.data.email, fullName: event.data.fullName, provider: 'facebook' })
                } else if (event.data.type === 'oauth-error') {
                    window.removeEventListener('message', handleMessage)
                    reject(new Error(event.data.error || 'OAuth authentication failed'))
                }
            }
            window.addEventListener('message', handleMessage)

            const checkClosed = setInterval(() => {
                try {
                    if (popup.closed) {
                        clearInterval(checkClosed)
                        window.removeEventListener('message', handleMessage)
                        reject(new Error('Authentication cancelled'))
                    }
                } catch (e) { /* COOP policy */ }
            }, 1000)
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
    return new Promise((resolve, reject) => {
        const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID

        if (!clientId) {
            reject(new Error('Apple Sign In is not available yet. Please use email/password or Google login.'))
            return
        }

        const redirectUri = getRedirectUri()
        const openerOrigin = window.location.origin
        const state = encodeURIComponent(`apple_${portal}_${openerOrigin}`)

        const authUrl = `https://appleid.apple.com/auth/authorize?` +
            `client_id=${clientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code id_token&` +
            `scope=name email&` +
            `response_mode=form_post&` +
            `state=${state}`

        const width = 500, height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2

        const popup = window.open(authUrl, 'Apple Sign In', `width=${width},height=${height},left=${left},top=${top}`)
        if (!popup) { reject(new Error('Popup blocked. Please allow popups for this site.')); return }

        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return
            if (event.data.type === 'oauth-success' && event.data.provider === 'apple') {
                window.removeEventListener('message', handleMessage)
                resolve({ email: event.data.email, fullName: event.data.fullName, provider: 'apple' })
            } else if (event.data.type === 'oauth-error') {
                window.removeEventListener('message', handleMessage)
                reject(new Error(event.data.error || 'OAuth authentication failed'))
            }
        }
        window.addEventListener('message', handleMessage)

        const checkClosed = setInterval(() => {
            try {
                if (popup.closed) {
                    clearInterval(checkClosed)
                    window.removeEventListener('message', handleMessage)
                    reject(new Error('Authentication cancelled'))
                }
            } catch (e) { /* COOP policy */ }
        }, 1000)
    })
}

/**
 * Handle OAuth callback and send result back to parent window
 * This should be called from the OAuth callback page
 */
export const handleOAuthCallback = async () => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.hash.substring(1))
    const searchParams = new URLSearchParams(window.location.search)

    const stateRaw = searchParams.get('state') || params.get('state') || ''
    const state = decodeURIComponent(stateRaw)
    const accessToken = params.get('access_token')
    const code = searchParams.get('code')

    if (!state) {
        window.opener?.postMessage({ type: 'oauth-error', error: 'Invalid state parameter' }, '*')
        window.close()
        return
    }

    // state format: "provider_portal_openerOrigin" (e.g. "google_Inspector_http://localhost:3004")
    const firstUnderscore = state.indexOf('_')
    const secondUnderscore = state.indexOf('_', firstUnderscore + 1)
    const provider = state.substring(0, firstUnderscore)
    const portal = state.substring(firstUnderscore + 1, secondUnderscore)
    // openerOrigin is everything after the second underscore (handles URLs with underscores)
    const openerOrigin = secondUnderscore !== -1 ? state.substring(secondUnderscore + 1) : window.location.origin
    const targetOrigin = openerOrigin || window.location.origin

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
                await clerk.handleRedirectCallback({}, async () => {
                    console.log('Clerk redirect handled successfully')
                    // Notify parent and close window from INSIDE the handler to prevent redirect
                    const currentUser = clerk.user
                    if (currentUser) {
                        const emailValue = currentUser.primaryEmailAddress?.emailAddress || ''
                        const fullNameValue = currentUser.fullName || currentUser.firstName || ''

                        window.opener?.postMessage({
                            type: 'oauth-success',
                            provider: 'facebook',
                            email: emailValue,
                            fullName: fullNameValue || (emailValue.includes('@') ? emailValue.split('@')[0] : emailValue),
                            portal
                        }, window.location.origin)
                        window.close()
                    }
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
            // For Apple, we need to exchange code on backend
            // Send code to parent window for backend processing
            window.opener?.postMessage({
                type: 'oauth-success',
                provider: 'apple',
                code,
                portal
            }, window.location.origin)
            window.close()
            return
        }

        if (!email) {
            throw new Error('Could not retrieve email from provider')
        }

        window.opener?.postMessage({
            type: 'oauth-success',
            provider,
            email,
            fullName: fullName || (email.includes('@') ? email.split('@')[0] : email),
            portal
        }, targetOrigin)

        window.close()
    } catch (error: any) {
        window.opener?.postMessage({
            type: 'oauth-error',
            error: error.message || 'Failed to complete authentication'
        }, targetOrigin)
        window.close()
    }
}
