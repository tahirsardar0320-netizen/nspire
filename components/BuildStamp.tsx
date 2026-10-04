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

    useEffect(() => {
        const cap = (window as any).Capacitor
        if (cap?.isNativePlatform?.()) setPlatform(cap.getPlatform?.() || "app")
    }, [])

    const build = process.env.NEXT_PUBLIC_BUILD_ID || "dev"

    return (
        <p className="text-center text-[10px] text-slate-400 select-all mt-4">
            {platform} · build {build}
        </p>
    )
}
