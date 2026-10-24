/**
 * A fetch that is guaranteed to settle.
 *
 * Plain fetch() has no time limit. Android's WebView gives up on a stalled
 * request fairly quickly, but iOS holds the connection open indefinitely — so
 * on an iPhone an awaited fetch could simply never resolve. Every screen that
 * set a "saving..." or "Logging in..." flag before the call and cleared it
 * afterwards then stayed stuck on that label forever, with no error and no way
 * forward. The login screen was the one users hit most, but the same shape was
 * repeated across sign-up, password reset, report export and progress saving.
 *
 * Anything that drives a loading state should go through this instead of
 * fetch(), so the spinner always has an end.
 */

/** Generous enough for a slow connection, short enough that nobody is stranded. */
export const DEFAULT_TIMEOUT_MS = 45000;

export interface TimedOutError extends Error {
  timedOut?: boolean;
}

/**
 * Resolve to null if the promise hasn't settled within the budget. For reads
 * that have a local fallback: apiRequest retries two hosts at 45s each, so a
 * stalled connection holds a caller for minutes — far longer than anyone
 * watches a spinner. The underlying request keeps running (and may still
 * populate caches); the caller just stops waiting for it and renders from the
 * device instead. Never use this for writes — abandoning a write is data loss.
 */
export function settleWithin<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      () => { clearTimeout(timer); resolve(null); },
    );
  });
}

export async function fetchWithTimeout(
  input: string,
  config: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...config, signal: controller.signal });
  } catch (err: any) {
    // Tagged so callers can tell "this one was slow" apart from "the network
    // is gone" and say something true to the user instead of guessing.
    if (err?.name === 'AbortError') {
      const timeoutError = new Error('Request timed out') as TimedOutError;
      timeoutError.timedOut = true;
      throw timeoutError;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
