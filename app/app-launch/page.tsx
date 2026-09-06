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
    <main className="fixed inset-0 flex items-center justify-center bg-white overflow-hidden">
      <video
        ref={videoRef}
        src="/app-launch.mp4"
        autoPlay
        muted
        playsInline
        onEnded={() => router.replace("/profile-selection")}
        className="w-full h-full object-contain"
      />
    </main>
  );
}
