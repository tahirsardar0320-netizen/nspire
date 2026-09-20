"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function AppLaunch() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const go = () => router.replace("/profile-selection");

    // No point trying to fetch the video at all if we're already known offline —
    // avoids the browser's broken-video icon flashing over the splash screen.
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setVideoFailed(true);
      const fallback = setTimeout(go, 1200);
      return () => clearTimeout(fallback);
    }

    // Fallback in case the video's `ended` event doesn't fire in some WebViews.
    const fallback = setTimeout(go, 7000);
    return () => clearTimeout(fallback);
  }, [router]);

  return (
    <main className="fixed inset-0 flex items-center justify-center bg-[#7FBFE9] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center animate-splash-zoom"
        style={{ backgroundImage: "url('/family_housing_complex.png')" }}
      />
      <div className="absolute inset-0 bg-[#7FBFE9]/80" />
      {!videoFailed && (
        <video
          ref={videoRef}
          src="/app-launch.mp4"
          autoPlay
          muted
          playsInline
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
