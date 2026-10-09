"use client"

import { useEffect, useState } from 'react'
import { handleOAuthCallback, type CallbackOutcome } from '@/lib/social-auth'

export default function OAuthCallback() {
    const [outcome, setOutcome] = useState<CallbackOutcome | null>(null)
    // Decided after mount: the server has no idea which device this is, and
    // guessing during render would make the markup disagree with itself.
    const [isIOS, setIsIOS] = useState(false)

    useEffect(() => {
        const ua = navigator.userAgent || ''
        // iPadOS reports itself as a Mac, so the touch check catches it too.
        setIsIOS(/iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1))
    }, [])

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
                        {/* The link opens the app directly, which is what Chrome
                            Custom Tabs on Android do. iPhone is told to close
                            instead: Safari's in-app browser refuses to open the
                            app's own scheme even when the user taps it, so the
                            button did nothing there and people hunted for the
                            close control anyway. Closing works on both, and
                            the app finishes signing in the moment it is back. */}
                        {isIOS ? (
                            <p className="text-gray-700 text-base mt-4 leading-relaxed">
                                Tap <span className="font-bold">✕</span> at the top of this screen to go back.
                                <br />
                                <span className="text-gray-500 text-sm">You&apos;ll be taken straight to your dashboard.</span>
                            </p>
                        ) : (
                            <>
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
                        )}
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
