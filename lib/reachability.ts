/**
 * Whether the server can actually be reached — not whether the phone thinks
 * it has a connection.
 *
 * navigator.onLine only reports that a network interface exists. On a phone
 * showing full LTE bars in a basement, in a dead spot, or behind a captive
 * portal, it stays true while nothing can get through. The app believed it,
 * tried the server, failed, and showed offline errors to someone who was
 * looking at a connection icon — and the warning then stayed up after the
 * signal genuinely came back, because nothing re-checked.
 *
 * So ask the server directly, and let that answer drive the banner.
 */

/** Cheap to answer and always present; HEAD keeps it to headers only. */
const PING_PATH = '/logo.png';
const PING_TIMEOUT_MS = 6000;
const POLL_INTERVAL_MS = 15000;

export async function isServerReachable(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return false;
  if (typeof fetch === 'undefined') return false;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
  try {
    // cache: 'no-store' so a service-worker copy cannot answer for the server.
    const res = await fetch(`${PING_PATH}?ping=${Date.now()}`, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Calls back whenever reachability changes. Checks on the browser's own
 * online/offline events, when the app returns to the foreground, and on a
 * timer — the timer is what clears a stale warning once the signal returns
 * without any event firing.
 *
 * Returns an unsubscribe function.
 */
export function watchReachability(onChange: (reachable: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  let current: boolean | null = null;
  let stopped = false;

  const check = async () => {
    if (stopped) return;
    const reachable = await isServerReachable();
    if (stopped || reachable === current) return;
    current = reachable;
    onChange(reachable);
  };

  const onVisible = () => {
    if (document.visibilityState === 'visible') check();
  };

  window.addEventListener('online', check);
  window.addEventListener('offline', check);
  document.addEventListener('visibilitychange', onVisible);
  const timer = setInterval(check, POLL_INTERVAL_MS);
  check();

  return () => {
    stopped = true;
    clearInterval(timer);
    window.removeEventListener('online', check);
    window.removeEventListener('offline', check);
    document.removeEventListener('visibilitychange', onVisible);
  };
}
