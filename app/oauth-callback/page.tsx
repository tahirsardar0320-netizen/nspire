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
                        {/* The app is polling for this result — it can't be handed
                            over in this tab, so point the user back to it. */}
                        <p className="text-gray-600 text-sm mt-2">
                            Return to the NSPIRE app to continue. You can close this tab.
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
