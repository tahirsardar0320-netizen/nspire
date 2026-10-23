"use client"

import { useEffect } from "react"

/**
 * Android's hardware back button. Without the App plugin the platform default
 * applies, and in this app that meant one press anywhere closed the whole app
 * — only the on-screen arrows navigated. With the plugin present (builds that
 * ship @capacitor/app), registering a listener makes the button ours: go back
 * through the app's own history, and only minimize from the root screen.
 *
 * Guarded on the plugin actually being present, so today's binaries — which
 * don't carry it — are completely unaffected by this code.
 */
export default function HardwareBackHandler() {
    useEffect(() => {
        const cap = (window as any).Capacitor
        if (!cap?.isNativePlatform?.()) return
        const hasApp = Array.isArray(cap.PluginHeaders) && cap.PluginHeaders.some((h: any) => h?.name === 'App')
        if (!hasApp || typeof cap.addListener !== 'function') return

        let handle: any = null
        try {
            handle = cap.addListener('App', 'backButton', () => {
                if (window.history.length > 1) {
                    window.history.back()
                } else if (typeof cap.nativePromise === 'function') {
                    // Root screen: behave like Android's home gesture, never a kill.
                    cap.nativePromise('App', 'minimizeApp').catch(() => {})
                }
            })
        } catch {
            // Listener could not attach — the platform default stays.
        }

        return () => { try { handle?.remove?.() } catch {} }
    }, [])

    return null
}
