"use client"

import { useEffect, useState } from 'react'
import { handleOAuthCallback, type CallbackOutcome } from '@/lib/social-auth'

export default function OAuthCallback() {
    const [outcome, setOutcome] = useState<CallbackOutcome | null>(null)

    useEffect(() => {
        let active = true
        handleOAuthCallback()
            .then((result) => { if (active) setOutcome(result) })
            .catch((error) => {
                if (active) setOutcome({ status: 'error', message: error?.message || 'Failed to complete authentication' })
            })
        return () => { active = false }
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#E8F4F8] px-6">
            <div className="text-center max-w-sm">
                {!outcome || outcome.status === 'closing' ? (
                    <>
                        <div className="animate-spin h-12 w-12 border-4 border-[#006795] border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-700 font-semibold">Completing authentication...</p>
                        <p className="text-gray-500 text-sm mt-2">This window will close automatically.</p>
                    </>
                ) : outcome.status === 'handed-off' ? (
                    <>
                        <div className="h-14 w-14 rounded-full bg-[#006795] text-white text-3xl flex items-center justify-center mx-auto mb-4">✓</div>
                        <p className="text-gray-800 font-semibold text-lg">You&apos;re signed in</p>
                        {/* iOS will not follow a custom scheme from the in-app
                            browser unless the user taps something, so the
                            automatic hand-back silently does nothing there and
                            this screen just sits open. A button satisfies that
                            requirement and works on both platforms. */}
                        <a
                            href="com.nspireapp://auth-done"
                            className="inline-block mt-5 px-6 py-3 rounded-xl bg-[#006795] text-white font-semibold text-sm"
                        >
                            Return to the app
                        </a>
                        <p className="text-gray-600 text-sm mt-3">
                            Or close this tab — the app will carry on from here.
                        </p>
                    </>
                ) : (
                    <>
                        <div className="h-14 w-14 rounded-full bg-red-500 text-white text-3xl flex items-center justify-center mx-auto mb-4">!</div>
                        <p className="text-gray-800 font-semibold text-lg">Sign-in failed</p>
                        <p className="text-gray-600 text-sm mt-2">{outcome.message}</p>
                    </>
                )}
            </div>
        </div>
    )
}
