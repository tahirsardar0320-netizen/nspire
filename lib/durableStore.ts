/**
 * Storage that survives iOS.
 *
 * Everything an inspector records offline — the queue of properties waiting to
 * sync, and the local copy of the list — lived in localStorage. On Android that
 * is fine. On iPhone it is not: WebKit treats all script-writable storage as
 * evictable and clears it on its own schedule, so a day's work could simply
 * vanish, which is exactly what happened. The code was identical on both
 * platforms; only the engine's rules differed.
 *
 * So writes go somewhere the engine does not get to clear:
 *
 *   - In the app, the Capacitor Filesystem plugin — a real file in the app's
 *     own container, which iOS never purges. The plugin already ships in the
 *     current binary, so this needs no new app build.
 *   - In a browser, IndexedDB, which is far more durable than localStorage.
 *
 * Reads stay synchronous so the existing screens did not all have to become
 * async: the whole store is pulled into memory once at startup by
 * hydrateDurableStore(), and every write updates memory first. localStorage is
 * still written as a third mirror, purely so an in-flight session that has not
 * hydrated yet keeps working.
 */

import { safeSetItem } from './safeStorage';

/** Keys whose loss costs an inspector real work. */
export const DURABLE_KEYS = [
  // The session itself. It lived only in localStorage — the storage iOS
  // clears — so losing it sent the next request up unauthenticated, the
  // server answered 401, and the app logged the inspector out in the middle
  // of a job. That is the "it suddenly threw me out" report.
  'token',
  'user',
  'inspire_offline_property_queue',
  'inspire_local_properties',
  'cached_properties',
];

/**
 * Families of keys that are equally costly but whose names are not known in
 * advance: cached_progress_<propertyId>_<buildingId> is where a deficiency
 * recorded with no signal actually lands, one key per building, and
 * pending_sync_<propertyId> queues saves waiting to go up.
 */
const DURABLE_PREFIXES = ['pending_sync_', 'cached_progress_'];

const isDurableKey = (key: string) =>
  DURABLE_KEYS.includes(key) || DURABLE_PREFIXES.some((p) => key.startsWith(p));

/**
 * Whether a key's value also gets mirrored into localStorage.
 *
 * Small keys (token, user, property list) stay mirrored — plenty of call
 * sites still read them straight from localStorage. The photo-bearing
 * families do NOT: localStorage writes are synchronous on the main thread,
 * and mirroring a multi-megabyte cached_progress blob there on every
 * 2-second autosave is exactly the stall the client feels as "the app
 * hangs". Durability does not suffer — those keys live in memory, in
 * IndexedDB or the native file, and localStorage was the one layer iOS
 * clears at will anyway.
 */
const mirrorsToLocalStorage = (key: string, value: string) =>
  !DURABLE_PREFIXES.some((p) => key.startsWith(p)) && value.length <= 64_000;

/** Every durable key currently known, from either side of the mirror. */
function knownKeys(fromDurable: Record<string, string>): string[] {
  const keys = new Set<string>([...DURABLE_KEYS, ...Object.keys(fromDurable)]);
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && isDurableKey(k)) keys.add(k);
    }
  } catch {
    // localStorage unavailable; the durable side alone decides.
  }
  return Array.from(keys);
}

const FILE_PATH = 'inspire-offline-store.json';
const DB_NAME = 'inspire-durable';
const DB_STORE = 'kv';

const memory = new Map<string, string>();
let hydrated = false;

const isNative = () =>
  typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.();

const hasPlugin = (name: string) => {
  const cap = (window as any).Capacitor;
  if (typeof cap?.nativePromise !== 'function') return false;
  return Array.isArray(cap.PluginHeaders) && cap.PluginHeaders.some((h: any) => h?.name === name);
};

const callPlugin = (plugin: string, method: string, options?: unknown): Promise<any> =>
  (window as any).Capacitor.nativePromise(plugin, method, options);

// ── native file ────────────────────────────────────────────────────────────

const useNativeFile = () => isNative() && hasPlugin('Filesystem');

async function readNativeFile(): Promise<Record<string, string> | null> {
  try {
    const res = await callPlugin('Filesystem', 'readFile', {
      path: FILE_PATH,
      directory: 'DATA',
      encoding: 'utf8',
    });
    const parsed = JSON.parse(res?.data ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    // No file yet, or the plugin refused — the caller falls back.
    return null;
  }
}

async function writeNativeFile(all: Record<string, string>): Promise<boolean> {
  try {
    await callPlugin('Filesystem', 'writeFile', {
      path: FILE_PATH,
      directory: 'DATA',
      encoding: 'utf8',
      recursive: true,
      data: JSON.stringify(all),
    });
    return true;
  } catch {
    return false;
  }
}

// One file per key. The single-file store meant every 2-second save re-read,
// re-parsed, re-stringified and re-wrote EVERYTHING the app had ever cached —
// hundreds of ms of main-thread JSON work per save once real photos piled up.
// A changed key now costs exactly its own bytes. The legacy single file is
// still read (it holds existing installs' data) but per-key copies win, and
// only removals rewrite it.
const KEY_DIR = 'inspire-store';

const keyToFileName = (key: string) => `${encodeURIComponent(key)}.json`;
const fileNameToKey = (name: string) => {
  try {
    return decodeURIComponent(name.replace(/\.json$/, ''));
  } catch {
    return null;
  }
};

async function readNativeKeyFiles(): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  let names: string[] = [];
  try {
    const res = await callPlugin('Filesystem', 'readdir', { path: KEY_DIR, directory: 'DATA' });
    const files = res?.files ?? [];
    names = files.map((f: any) => (typeof f === 'string' ? f : f?.name)).filter(Boolean);
  } catch {
    return out; // No directory yet — fresh install or pre-migration.
  }
  await Promise.all(
    names.map(async (name) => {
      const key = fileNameToKey(name);
      if (!key) return;
      try {
        const res = await callPlugin('Filesystem', 'readFile', {
          path: `${KEY_DIR}/${name}`,
          directory: 'DATA',
          encoding: 'utf8',
        });
        if (typeof res?.data === 'string') out[key] = res.data;
      } catch {
        // Unreadable entry; the legacy file or localStorage may still cover it.
      }
    })
  );
  return out;
}

async function writeNativeKeyFile(key: string, value: string): Promise<void> {
  try {
    await callPlugin('Filesystem', 'writeFile', {
      path: `${KEY_DIR}/${keyToFileName(key)}`,
      directory: 'DATA',
      encoding: 'utf8',
      recursive: true,
      data: value,
    });
  } catch {
    // The IDB/localStorage layers and the next flush still stand.
  }
}

async function deleteNativeKeyFile(key: string): Promise<void> {
  try {
    await callPlugin('Filesystem', 'deleteFile', {
      path: `${KEY_DIR}/${keyToFileName(key)}`,
      directory: 'DATA',
    });
  } catch {
    // Already gone, or never written.
  }
}

// ── IndexedDB ──────────────────────────────────────────────────────────────

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') return resolve(null);
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(DB_STORE)) req.result.createObjectStore(DB_STORE);
      };
      let settled = false;
      req.onsuccess = () => { settled = true; resolve(req.result); };
      req.onerror = () => { settled = true; resolve(null); };
      // Safari can leave an open() hanging forever in a backgrounded tab.
      // Generous, and only as a last resort — resolving null here makes the
      // whole session read an empty store.
      setTimeout(() => { if (!settled) resolve(null); }, 8000);
    } catch {
      resolve(null);
    }
  });
}

async function readIdb(): Promise<Record<string, string>> {
  const db = await openDb();
  if (!db) return {};
  return new Promise((resolve) => {
    const out: Record<string, string> = {};
    try {
      // Everything present, rather than a fixed list: pending_sync_<id> keys
      // are named after the property and cannot be enumerated ahead of time.
      const tx = db.transaction(DB_STORE, 'readonly');
      const cursor = tx.objectStore(DB_STORE).openCursor();
      cursor.onsuccess = () => {
        const c = cursor.result;
        if (!c) return resolve(out);
        if (typeof c.key === 'string' && typeof c.value === 'string') out[c.key] = c.value;
        c.continue();
      };
      cursor.onerror = () => resolve(out);
      tx.onerror = () => resolve(out);
    } catch {
      resolve(out);
    }
  });
}

async function writeIdb(key: string, value: string): Promise<void> {
  const db = await openDb();
  if (!db) return;
  try {
    db.transaction(DB_STORE, 'readwrite').objectStore(DB_STORE).put(value, key);
  } catch {
    // Nothing more to try; the native file and localStorage mirrors remain.
  }
}

// ── public API ─────────────────────────────────────────────────────────────

/**
 * Loads the durable copy into memory. Call once, as early as possible.
 *
 * Existing installs have their data in localStorage and nowhere else, so
 * whatever is found there seeds the durable copy the first time through —
 * nobody loses what they already recorded by upgrading.
 */
let hydrating: Promise<void> | null = null;

/**
 * Hydration is async, but the screens read synchronously. Anything that depends
 * on the saved copy awaits this first, so a read cannot land before the store
 * is populated and mistake "not loaded yet" for "nothing saved".
 */
export function ensureHydrated(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!hydrating) hydrating = hydrateDurableStore();
  return hydrating;
}

export async function hydrateDurableStore(): Promise<void> {
  if (hydrated || typeof window === 'undefined') return;

  let durable: Record<string, string> | null;
  if (useNativeFile()) {
    // Legacy single file first (existing installs), then the per-key files on
    // top — a per-key copy is always at least as fresh as the legacy snapshot.
    durable = (await readNativeFile()) || {};
    Object.assign(durable, await readNativeKeyFiles());
  } else {
    durable = await readIdb();
  }

  for (const key of knownKeys(durable || {})) {
    const fromDurable = durable?.[key];
    const fromLocal = (() => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    })();

    // Prefer whichever actually holds something. A durable copy that exists but
    // is empty must not erase a localStorage copy that still has the user's
    // work in it.
    const chosen = pickRicher(fromDurable, fromLocal);
    if (chosen != null) {
      memory.set(key, chosen);
      if (mirrorsToLocalStorage(key, chosen)) {
        // Restore it to localStorage as well. Dozens of call sites read the
        // token straight from there, and rewriting them all would be a far
        // bigger change than simply putting back what was evicted. Through
        // the quota-aware writer: on a full device a plain setItem throws.
        if (fromLocal == null) safeSetItem(key, chosen);
      } else if (fromLocal != null) {
        // Bulky key still sitting in localStorage from an older build: the
        // durable copy now holds it, so free the quota and stop the
        // synchronous main-thread writes that mirror would keep costing.
        try { localStorage.removeItem(key); } catch {}
      }
    }
  }

  hydrated = true;

  // Push the chosen state back out, so the durable copy is seeded on first run.
  await flushAll();
}

/** Of two stored JSON arrays, the one with more entries; falls back to whichever exists. */
function pickRicher(a: string | null | undefined, b: string | null | undefined): string | null {
  if (a == null) return b ?? null;
  if (b == null) return a;
  const count = (raw: string) => {
    try {
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v.length : 1;
    } catch {
      return 0;
    }
  };
  return count(a) >= count(b) ? a : b;
}

async function flushAll(): Promise<void> {
  if (!useNativeFile()) {
    await Promise.all(Array.from(memory.entries()).map(([k, v]) => writeIdb(k, v)));
    return;
  }
  // Every key to its own file — a changed key costs its own bytes, not a
  // rewrite of everything ever cached.
  await Promise.all(Array.from(memory.entries()).map(([k, v]) => writeNativeKeyFile(k, v)));
  await Promise.all(Array.from(removedKeys).map((k) => deleteNativeKeyFile(k)));
  if (removedKeys.size > 0) {
    // The legacy single file would resurrect a removed key at the next
    // hydration; prune it with the same read-merge-write it always used.
    // (Merging, never blind: a key we never managed to load must survive.)
    const existing = (await readNativeFile()) || {};
    memory.forEach((v, k) => {
      existing[k] = v;
    });
    removedKeys.forEach((k) => {
      delete existing[k];
    });
    await writeNativeFile(existing);
  }
}

/**
 * Writing one key used to rewrite the entire store — every property, every
 * cached photo, all of it — and that happens on every save during an
 * inspection. The first deficiency was cheap; by the second the store was
 * large enough for the rewrite to be slow, and a save that should take no
 * time at all started getting in its own way.
 *
 * IndexedDB can store a single key on its own, so do that. The native file
 * has to be written whole, so coalesce rapid saves into one write shortly
 * after the last of them rather than one per keystroke.
 */
const nativeKeyTimers = new Map<string, ReturnType<typeof setTimeout>>();

function flushKey(key: string, value: string): void {
  if (!useNativeFile()) {
    void writeIdb(key, value);
    return;
  }
  // Coalesce a burst of writes to the same key into one file write; other
  // keys are untouched either way.
  const pending = nativeKeyTimers.get(key);
  if (pending) clearTimeout(pending);
  nativeKeyTimers.set(key, setTimeout(() => {
    nativeKeyTimers.delete(key);
    const current = memory.get(key);
    if (current != null) void writeNativeKeyFile(key, current);
  }, 300));
}

/** Every known key in a family, e.g. all cached_progress_ records. */
export function durableKeysWithPrefix(prefix: string): string[] {
  const keys = new Set<string>();
  memory.forEach((_v, k) => {
    if (k.startsWith(prefix)) keys.add(k);
  });
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) keys.add(k);
    }
  } catch {
    // localStorage unavailable; memory alone answers.
  }
  return Array.from(keys);
}

export function durableGet(key: string): string | null {
  if (memory.has(key)) return memory.get(key)!;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function durableSet(key: string, value: string): boolean {
  memory.set(key, value);
  removedKeys.delete(key);
  if (mirrorsToLocalStorage(key, value)) {
    // Mirrored to localStorage as well: harmless where it survives, and it
    // keeps any code still reading localStorage directly in step.
    safeSetItem(key, value);
  } else {
    // Never leave a stale smaller copy behind for durableGet's fallback or
    // the hydration merge to trip over.
    try { localStorage.removeItem(key); } catch {}
  }
  flushKey(key, value);
  return true;
}

/** Keys deliberately removed — so the merge-write above honors deletions. */
const removedKeys = new Set<string>();

async function deleteIdb(key: string): Promise<void> {
  const db = await openDb();
  if (!db) return;
  try {
    db.transaction(DB_STORE, 'readwrite').objectStore(DB_STORE).delete(key);
  } catch {
    // The stale row survives until the next successful delete.
  }
}

export function durableRemove(key: string): void {
  memory.delete(key);
  removedKeys.add(key);
  try {
    localStorage.removeItem(key);
  } catch {}
  // IndexedDB was never told about removals: a drained offline queue rose
  // from its IDB row at the next launch and re-synced week-old payloads over
  // newer server data.
  void deleteIdb(key);
  if (useNativeFile()) void deleteNativeKeyFile(key);
  void flushAll();
}
