/**
 * Stamps the current build id into the service worker's cache version.
 *
 * The version was a hand-edited constant, and nobody remembered to bump it. A
 * worker only reinstalls when its own bytes change, so the caches it had
 * written — including a copy of /app-launch — survived every deploy, while
 * Next.js renamed its chunks and deleted the old ones underneath them. Serving
 * that stale copy meant a page whose every script 404'd: a black screen with no
 * JavaScript left running to recover itself.
 *
 * Deriving the version from the build makes the worker's bytes change whenever
 * the assets it caches do, so a deploy always retires what it invalidated.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const swPath = join(here, '..', 'public', 'service-worker.js');

const buildId =
  process.env.SOURCE_COMMIT?.slice(0, 7) ||
  process.env.GITHUB_SHA?.slice(0, 7) ||
  new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');

const source = readFileSync(swPath, 'utf8');
const stamped = source.replace(
  /^const VERSION = '[^']*';$/m,
  `const VERSION = 'v7-${buildId}';`
);

if (stamped === source) {
  // Fail loudly: silently shipping an unstamped worker is how this broke before.
  console.error('stamp-sw-version: could not find the VERSION line in public/service-worker.js');
  process.exit(1);
}

writeFileSync(swPath, stamped);
console.log(`stamp-sw-version: service worker cache version -> v7-${buildId}`);
