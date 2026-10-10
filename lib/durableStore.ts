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
  'inspire_offline_property_queue',
  'inspire_local_properties',
  'cached_properties',
];

/**
 * Families of keys that are equally costly but whose names are not known in
 * advance — pending_sync_<propertyId> holds every deficiency recorded with no
 * signal, one key per property.
 */
const DURABLE_PREFIXES = ['pending_sync_'];

const isDurableKey = (key: string) =>
  DURABLE_KEYS.includes(key) || DURABLE_PREFIXES.some((p) => key.startsWith(p));

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

// ── IndexedDB ──────────────────────────────────────────────────────────────

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') return resolve(null);
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(DB_STORE)) req.result.createObjectStore(DB_STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      // Safari can leave an open() hanging forever in a backgrounded tab.
      setTimeout(() => resolve(null), 3000);
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

  const durable = useNativeFile() ? await readNativeFile() : await readIdb();

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
    if (chosen != null) memory.set(key, chosen);
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
  const all: Record<string, string> = {};
  memory.forEach((v, k) => {
    all[k] = v;
  });
  await writeNativeFile(all);
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
  // Mirrored to localStorage as well: harmless where it survives, and it keeps
  // any code still reading localStorage directly in step.
  safeSetItem(key, value);
  void flushAll();
  return true;
}

export function durableRemove(key: string): void {
  memory.delete(key);
  try {
    localStorage.removeItem(key);
  } catch {}
  void flushAll();
}
