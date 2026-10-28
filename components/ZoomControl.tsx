"use client"

import { useEffect, useState } from "react"
import { safeSetItem } from "@/lib/safeStorage"

/**
 * The in-app display zoom (− / % / +). Pinch is unreliable inside the iOS
 * webview, so every portal header carries its own control that scales the
 * whole page via CSS zoom — supported by every WebKit/Blink webview the app
 * ships in. One shared level across portals, persisted.
 */
export default function ZoomControl() {
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    const saved = parseFloat(localStorage.getItem('app_zoom_level') || '1')
    if (saved >= 0.8 && saved <= 1.6) setZoomLevel(saved)
  }, [])

  useEffect(() => {
    ;(document.body.style as any).zoom = zoomLevel === 1 ? '' : String(zoomLevel)
    safeSetItem('app_zoom_level', String(zoomLevel))
    return () => { (document.body.style as any).zoom = '' }
  }, [zoomLevel])

  const stepZoom = (delta: number) =>
    setZoomLevel(prev => Math.min(1.6, Math.max(0.8, Math.round((prev + delta) * 10) / 10)))

  return (
    <div className="zoom-ctl flex items-stretch rounded-md border border-slate-200 h-7 self-center shrink-0 bg-white">
      <button
        onClick={() => stepZoom(-0.1)}
        aria-label="Zoom out"
        className="h-full min-h-0 flex items-center justify-center px-2 text-slate-600 hover:bg-slate-50 font-bold text-xs leading-none rounded-l-md"
      >
        −
      </button>
      <button
        onClick={() => setZoomLevel(1)}
        aria-label="Reset zoom"
        className="h-full min-h-0 flex items-center justify-center px-1 text-[9px] font-bold text-slate-400 hover:bg-slate-50 leading-none min-w-[30px]"
      >
        {Math.round(zoomLevel * 100)}%
      </button>
      <button
        onClick={() => stepZoom(0.1)}
        aria-label="Zoom in"
        className="h-full min-h-0 flex items-center justify-center px-2 text-slate-600 hover:bg-slate-50 font-bold text-xs leading-none rounded-r-md"
      >
        +
      </button>
    </div>
  )
}
