/**
 * Lazy gateway to country-state-city.
 *
 * Imported statically, that package drops a 7.8 MB chunk — every city on
 * Earth as one JSON.parse — into the page bundle of every screen that touches
 * it, which made the dashboard ship ~10 MB of JavaScript and choke phones on
 * first load. Nothing needs that data before the user opens a location
 * dropdown, so it loads here on demand and never rides in a page chunk.
 *
 * Usage: call loadGeo() in a mount effect (or before first use) and keep the
 * module in state; sync call sites read from that state and render empty
 * lists for the instant before it lands.
 */
export type GeoModule = typeof import('country-state-city')

let cached: GeoModule | null = null
let pending: Promise<GeoModule> | null = null

export function loadGeo(): Promise<GeoModule> {
  if (cached) return Promise.resolve(cached)
  if (!pending) {
    pending = import('country-state-city').then((m) => {
      cached = m
      return m
    })
  }
  return pending
}

/** The module if it has already loaded, else null — for sync call sites. */
export function geo(): GeoModule | null {
  return cached
}
