import { authAPI } from './api'
import { safeSetItem } from './safeStorage'

/**
 * Finishes a social sign-in once the provider's result is in hand: exchanges it
 * for a session and stores it. Shared so a sign-in that was interrupted by the
 * in-app browser can be completed on the way back in, by exactly the same path
 * as one that ran straight through.
 */
export async function completeSocialSignIn(
    provider: 'google' | 'facebook' | 'apple',
    email: string,
    fullName: string,
    portal: string,
    inspectorType?: string | null
): Promise<{ ok: boolean; role?: string; message?: string }> {
    const response = await authAPI.socialLogin(
        email,
        fullName || email.split('@')[0],
        portal,
        provider,
        inspectorType ?? undefined
    )

    if (!response?.success) return { ok: false, message: response?.message || 'Sign-in failed' }

    if (!safeSetItem('token', response.token)) {
        return { ok: false, message: "Couldn't save your session — free up some space on your device and try again." }
    }
    safeSetItem('user', JSON.stringify(response.user))

    return { ok: true, role: response.user?.role }
}

/** Where a given role belongs after signing in. */
export function dashboardForRole(role?: string): string {
    if (role === 'admin') return '/admin/dashboard'
    if (role === 'management' || role === 'property-manager' || role === 'supervisor') return '/management/dashboard'
    if (role === 'inspector') return '/dashboard'
    return '/other/dashboard'
}
