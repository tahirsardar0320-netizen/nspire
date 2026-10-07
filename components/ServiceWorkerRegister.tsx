"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // A newly activated worker takes control, but the page keeps running the
      // JavaScript it already loaded — so a deployed fix stayed invisible until
      // the app happened to be restarted, and "nothing changed" was impossible
      // to tell apart from "the fix does not work". Reload once when a new
      // version announces itself.
      let reloaded = false
      const onMessage = (event: MessageEvent) => {
        if (event.data?.type !== "SW_UPDATED" || reloaded) return
        reloaded = true
        window.location.reload()
      }
      navigator.serviceWorker.addEventListener("message", onMessage)

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
        return () => {
          window.removeEventListener("load", handleLoad);
          navigator.serviceWorker.removeEventListener("message", onMessage);
        };
      }
    }
  }, []);

  return null;
}
