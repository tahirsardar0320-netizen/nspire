"use client"

import { useEffect, useState } from "react"

/**
 * Small, unobtrusive marker identifying exactly what is running.
 *
 * Bug reports from the field could never be pinned to a build: the Android
 * version name was the same string for every release, so a stale install and a
 * genuinely broken one looked identical. Showing the web build and the platform
 * means a screenshot is enough to tell them apart.
 */
export default function BuildStamp() {
    const [platform, setPlatform] = useState("web")
    // Whether offline support actually exists where this is running. iOS only
    // allows service workers inside an app when the binary declares app-bound
    // domains, so "does the app work offline" can only be diagnosed from the
    // device itself — this puts the answer in every screenshot:
    //   off:none  = the engine refuses service workers (old binary)
    //   off:ready = a worker controls this page; offline will work
    //   off:wait  = registered but not controlling yet (needs one reload)
    const [sw, setSw] = useState("…")

    useEffect(() => {
        const cap = (window as any).Capacitor
        if (cap?.isNativePlatform?.()) setPlatform(cap.getPlatform?.() || "app")

        if (!("serviceWorker" in navigator)) { setSw("off:none"); return }
        if (navigator.serviceWorker.controller) { setSw("off:ready"); return }
        navigator.serviceWorker.getRegistration().then((reg) => {
            setSw(reg ? "off:wait" : "off:reg…")
            // Registration usually lands moments after first load; keep watching
            // briefly so the stamp settles on the truth without a manual reload.
            let tries = 0
            const timer = setInterval(() => {
                tries++
                if (navigator.serviceWorker.controller) { setSw("off:ready"); clearInterval(timer) }
                else if (tries > 15) clearInterval(timer)
            }, 1000)
        }).catch(() => setSw("off:err"))
    }, [])

    const build = process.env.NEXT_PUBLIC_BUILD_ID || "dev"

    return (
        <p className="text-center text-[10px] text-slate-400 select-all mt-4">
            {platform} · build {build} · {sw}
        </p>
    )
}
