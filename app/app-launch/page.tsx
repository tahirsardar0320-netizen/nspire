"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AppLaunch() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const go = () => router.replace("/profile-selection");
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
      <video
        ref={videoRef}
        src="/app-launch.mp4"
        autoPlay
        muted
        playsInline
        onEnded={() => router.replace("/profile-selection")}
        className="relative w-full h-full object-contain mix-blend-multiply"
      />
    </main>
  );
}
