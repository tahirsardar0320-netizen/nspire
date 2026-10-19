"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ensureHydrated, durableGet } from "@/lib/durableStore";
import { dashboardForRole } from "@/lib/completeSocialSignIn";

const STALL_TIMEOUT_MS = 2500;
const MAX_PLAYBACK_MS = 9000;

export default function AppLaunch() {
  const router = useRouter();
  const [videoFailed, setVideoFailed] = useState(false);
  const stallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wentRef = useRef(false);
  // The video's own ended/error handlers leave through here too — they used to
  // call router.replace directly, racing past the session check below and
  // landing a signed-in inspector on the portal screen anyway.
  const goRef = useRef<() => void>(() => {});

  useEffect(() => {
    const go = async () => {
      if (wentRef.current) return;
      wentRef.current = true;
      // The app relaunches here every time it is opened, and this always went
      // to the portal/login screens — so an inspector who killed the app and
      // reopened it was handed the login form despite holding a perfectly
      // valid session, which reads as "it logged me out". Resume the session
      // instead. ensureHydrated first: on iOS the token's durable copy lives
      // in a file that is only pulled into memory asynchronously.
      try {
        await ensureHydrated();
        const token = durableGet("token");
        const user = JSON.parse(durableGet("user") || "null");
        if (token && user) {
          router.replace(dashboardForRole(user.role));
          return;
        }
      } catch {
        // No readable session — the normal flow below takes over.
      }
      router.replace("/profile-selection");
    };
    goRef.current = go;

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
          onEnded={() => goRef.current()}
          onError={() => {
            setVideoFailed(true);
            goRef.current();
          }}
          className="relative w-full h-full object-contain mix-blend-multiply"
        />
      )}
    </main>
  );
}
