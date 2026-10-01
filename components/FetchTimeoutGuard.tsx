"use client"

import { useEffect } from 'react'

/**
 * Gives every fetch in the app an upper bound.
 *
 * Inspectors work on patchy site connections, where a request does not fail so
 * much as never answer. Most call sites here use a bare fetch with no abort
 * signal, so a stalled request left its caller awaiting forever — the spinner
 * never cleared, the modal never advanced, and the app read as frozen. Rather
 * than thread a timeout through ~30 call sites (and have the next one added
 * miss it), install the ceiling once.
 *
 * A caller that supplies its own signal is managing its own lifetime, so it is
 * left alone.
 */
const DEFAULT_TIMEOUT_MS = 60000

export default function FetchTimeoutGuard() {
  useEffect(() => {
    const w = window as any
    if (w.__fetchTimeoutInstalled) return
    w.__fetchTimeoutInstalled = true

    const original = window.fetch.bind(window)

    window.fetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
      if (init?.signal) return original(input, init)

      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

      return original(input, { ...init, signal: controller.signal })
        .catch((err: any) => {
          if (err?.name === 'AbortError') {
            const timeoutError = new Error(
              'The server took too long to respond. Please check your connection and try again.'
            ) as any
            timeoutError.timedOut = true
            throw timeoutError
          }
          throw err
        })
        .finally(() => clearTimeout(timer))
    }
  }, [])

  return null
}
