"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const STALL_TIMEOUT_MS = 2500;
const MAX_PLAYBACK_MS = 9000;

export default function AppLaunch() {
  const router = useRouter();
  const [videoFailed, setVideoFailed] = useState(false);
  const stallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wentRef = useRef(false);

  useEffect(() => {
    const go = () => {
      if (wentRef.current) return;
      wentRef.current = true;
      router.replace("/profile-selection");
    };

    // No point even attempting the video if we're already known offline —
    // avoids the browser's broken-video icon flashing over the splash screen.
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setVideoFailed(true);
      const t = setTimeout(go, 300);
      return () => clearTimeout(t);
    }

    // If the video hasn't actually started playing within this window —
    // a stalled/hung load never fires a formal `error` event, just sits
    // there frozen — bail out instead of leaving a broken splash on screen.
    stallTimerRef.current = setTimeout(() => {
      setVideoFailed(true);
      go();
    }, STALL_TIMEOUT_MS);

    // Absolute fallback in case `ended` never fires once playback starts.
    const maxTimer = setTimeout(go, MAX_PLAYBACK_MS);

    return () => {
      if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
      clearTimeout(maxTimer);
    };
  }, [router]);

  const clearStallTimer = () => {
    if (stallTimerRef.current) {
      clearTimeout(stallTimerRef.current);
      stallTimerRef.current = null;
    }
  };

  return (
    <main className="fixed inset-0 flex items-center justify-center bg-[#7FBFE9] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center animate-splash-zoom"
        style={{ backgroundImage: "url('/family_housing_complex.png')" }}
      />
      <div className="absolute inset-0 bg-[#7FBFE9]/80" />
      {!videoFailed && (
        <video
          src="/app-launch.mp4"
          autoPlay
          muted
          playsInline
          onPlaying={clearStallTimer}
          onEnded={() => router.replace("/profile-selection")}
          onError={() => {
            setVideoFailed(true);
            router.replace("/profile-selection");
          }}
          className="relative w-full h-full object-contain mix-blend-multiply"
        />
      )}
    </main>
  );
}
