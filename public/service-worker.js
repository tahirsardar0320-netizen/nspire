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

const VERSION = 'v3';
const SHELL_CACHE = `inspire-shell-${VERSION}`;
const PAGE_CACHE = `inspire-pages-${VERSION}`;
const ASSET_CACHE = `inspire-assets-${VERSION}`;
const IMAGE_CACHE = `inspire-images-${VERSION}`;

const CURRENT = [SHELL_CACHE, PAGE_CACHE, ASSET_CACHE, IMAGE_CACHE];

/** Pages an inspector can land on with no connection. */
const SHELL_PAGES = [
  '/app-launch',
  '/profile-selection',
  '/login',
  '/dashboard',
  '/logo.png',
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
  );
});

const isBuildAsset = (url) => url.pathname.startsWith('/_next/static/');
const isStoredImage = (url) => url.pathname.startsWith('/api/images/');
const isApi = (url) => url.pathname.startsWith('/api/');

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
    const hit = (await cache.match(request)) || (await caches.match(request, { ignoreSearch: true }));
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

  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(networkFirstPage(request));
    return;
  }

  event.respondWith(cacheFirst(request, ASSET_CACHE));
});
