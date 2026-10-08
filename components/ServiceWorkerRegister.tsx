"use client";

import { useEffect } from "react";
import { ensureHydrated } from "@/lib/durableStore"

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Offline work is kept in durable storage because iOS clears the ordinary
    // kind. Open it as early as possible so the first screen has it.
    ensureHydrated()
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // A new worker deliberately does NOT reload the page. Reloading on its
      // own schedule can land in the middle of something — a sign-in that has
      // just stored its session, a form part-filled — and throw it away, which
      // looks exactly like being bounced back to the login screen. The next
      // natural page load picks the new version up soon enough.

      const handleLoad = () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((reg) => {
            console.log("Service Worker registered successfully with scope: ", reg.scope);
          })
          .catch((err) => {
            console.error("Service Worker registration failed: ", err);
          });
      };

      // Register when the page is fully loaded
      if (document.readyState === "complete") {
        handleLoad();
      } else {
        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
      }
    }
  }, []);

  return null;
}
