/**
 * Offline support for the inspection app.
 *
 * The previous version made the app look broken offline rather than working
 * offline, in two specific ways:
 *
 *  - It skipped every /_next/ request. That is where all of Next.js's
 *    JavaScript and CSS lives, so an offline page loaded its HTML and then had
 *    nothing to run: the app sat on "Loading..." forever.
 *
 *  - Any page that happened not to be in the cache fell back to /login. An
 *    inspector who backgrounded the app offline and came back was handed the
 *    login screen — which looks exactly like being logged out, and offline
 *    there is no way to log back in.
 *
 * Build assets are content-hashed, so they are safe to serve cache-first and
 * never need revalidating. Pages are network-first so an online user always
 * gets the current build, with the last good copy kept for when they are not.
 */

const VERSION = 'v6';
const SHELL_CACHE = `inspire-shell-${VERSION}`;
const PAGE_CACHE = `inspire-pages-${VERSION}`;
const ASSET_CACHE = `inspire-assets-${VERSION}`;
const IMAGE_CACHE = `inspire-images-${VERSION}`;
// Route payloads are kept apart from HTML: a navigation that fell back to a
// cached payload rendered the raw serialized tree as text on screen.
const RSC_CACHE = `inspire-routes-${VERSION}`;

const CURRENT = [SHELL_CACHE, PAGE_CACHE, ASSET_CACHE, IMAGE_CACHE, RSC_CACHE];

/** Pages an inspector can land on with no connection. */
const SHELL_PAGES = [
  '/app-launch',
  '/profile-selection',
  '/login',
  '/dashboard',
  '/logo.png',
  // One rendered copy of each client-rendered family, so a property created in
  // the field can be opened — and reloaded — with no connection at all.
  '/dashboard/property-details/template',
  '/dashboard/inspection-category/template',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      // Individually, so one 404 cannot abort the whole install.
      .then((cache) => Promise.all(SHELL_PAGES.map((p) => cache.add(p).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((n) => !CURRENT.includes(n)).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
      .then(async () => {
        // Taking control is not enough: the open page carries on running the
        // JavaScript it already loaded, so a fix stays invisible until the app
        // happens to be restarted. Tell the page a new version is live and let
        // it reload itself once.
        const clients = await self.clients.matchAll({ type: 'window' });
        clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED', version: VERSION }));
      })
  );
});

const isBuildAsset = (url) => url.pathname.startsWith('/_next/static/');
const isStoredImage = (url) => url.pathname.startsWith('/api/images/');
const isApi = (url) => url.pathname.startsWith('/api/');

/**
 * Moving between screens in the App Router does not fetch HTML — it fetches a
 * React Server Component payload for the target route. Those were falling
 * through to a cache-first handler that simply threw when the network was
 * gone, so offline the app stayed exactly where it was: tapping Initiate did
 * nothing at all until a connection came back.
 */
const isRscRequest = (request, url) =>
  url.searchParams.has('_rsc') ||
  request.headers.get('RSC') === '1' ||
  (request.headers.get('accept') || '').includes('text/x-component');

/**
 * Screens whose page component is "use client" and reads its id from
 * useParams() — that is, from the URL rather than from the server payload.
 * One cached copy therefore stands in for any id in the same family.
 *
 * This is what lets a property created in the field be inspected straight
 * away: it exists only in the offline queue, so the server has never rendered
 * its page and there is nothing specific to cache, yet the screen itself is
 * identical for every property.
 */
const CLIENT_ROUTE_FAMILIES = ['/dashboard/property-details/', '/dashboard/inspection-category/'];

const familyOf = (pathname) => CLIENT_ROUTE_FAMILIES.find((f) => pathname.startsWith(f));

/** Any cached entry from the same route family, whatever its id. */
async function matchSibling(cache, url) {
  const family = familyOf(url.pathname);
  if (!family) return null;
  for (const key of await cache.keys()) {
    const keyUrl = new URL(key.url);
    if (keyUrl.pathname.startsWith(family)) return cache.match(key);
  }
  return null;
}

/** Hashed build assets and stored photos never change — serve them from cache. */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response && response.status === 200) cache.put(request, response.clone());
  return response;
}

/** Pages: prefer the network, keep the last good copy for offline. */
async function networkFirstPage(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const url = new URL(request.url);
    const shellCache = await caches.open(SHELL_CACHE);
    const hit =
      (await cache.match(request)) ||
      (await caches.match(request, { ignoreSearch: true })) ||
      (await matchSibling(cache, url)) ||
      (await matchSibling(shellCache, url));
    if (hit) return hit;

    // Fall back to a shell page the user can actually act from. Never /login:
    // being shown the sign-in screen offline reads as having been logged out,
    // and there is no way to sign in without a connection.
    const shell = await caches.open(SHELL_CACHE);
    const fallback =
      (await shell.match('/dashboard')) ||
      (await shell.match('/profile-selection')) ||
      (await shell.match('/app-launch'));
    if (fallback) return fallback;

    return new Response(
      '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<title>Offline</title>' +
        '<body style="font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;' +
        'min-height:100vh;margin:0;text-align:center;color:#1f2937;background:#E8F4F8">' +
        '<div style="max-width:320px;padding:24px">' +
        '<p style="font-weight:600;font-size:18px">You\'re offline</p>' +
        '<p style="color:#6b7280;font-size:14px;margin-top:8px">This screen hasn\'t been opened before, so there\'s no saved copy. ' +
        'Anything you\'ve already recorded is safe and will sync once you\'re back online.</p>' +
        '</div></body>',
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isBuildAsset(url)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  if (isStoredImage(url)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // Everything else under /api is live data; let it fail honestly offline so
  // the app's own offline queue takes over rather than serving stale results.
  if (isApi(url)) return;

  // Route payloads: keep the last good copy so a screen visited while online
  // can still be opened in the field.
  if (isRscRequest(request, url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RSC_CACHE);
        try {
          const response = await fetch(request);
          if (response && response.status === 200) cache.put(request, response.clone());
          return response;
        } catch (err) {
          const hit =
            (await cache.match(request)) ||
            (await cache.match(request, { ignoreSearch: true })) ||
            (await matchSibling(cache, url));
          if (hit) return hit;
          // Nothing cached for this route. Returning an error response rather
          // than throwing lets the router surface a normal navigation failure
          // instead of leaving the tap looking like it did nothing.
          return new Response('', { status: 504, statusText: 'Offline' });
        }
      })()
    );
    return;
  }

  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(networkFirstPage(request));
    return;
  }

  event.respondWith(cacheFirst(request, ASSET_CACHE));
});
