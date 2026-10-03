/**
 * localStorage.setItem throws QuotaExceededError once the origin's storage is
 * full — roughly 5 MB. Inspection progress, cached property lists and queued
 * offline changes are all written there, so on a long day in the field that
 * ceiling is reachable, and an unguarded write took down whatever flow it was
 * in: the save appeared to hang, or the screen simply stopped responding.
 *
 * Every write goes through here instead. If storage is full, expendable caches
 * are dropped and the write is retried; if it still will not fit, the write is
 * reported as failed rather than thrown, so the caller carries on.
 */

/** Never evicted: losing these loses the user's session or unsynced work. */
const PROTECTED_EXACT = new Set(['token', 'user', 'inspire_offline_property_queue']);
const PROTECTED_PREFIXES = ['pending_sync_'];

/** Safe to drop under pressure — all of it can be fetched again. */
const EXPENDABLE_PREFIXES = [
    'cached_progress_',
    'cached_properties',
    'cached_completed_inspections',
    'inspire_local_properties',
    'buildingNames_',
    'buildingUnits_',
    'buildingColHeader_',
    'buildingDisplayName_',
    'property_coverage_',
    'report_emailed_',
];

const isProtected = (key: string) =>
    PROTECTED_EXACT.has(key) || PROTECTED_PREFIXES.some((p) => key.startsWith(p));

const isExpendable = (key: string) =>
    !isProtected(key) && EXPENDABLE_PREFIXES.some((p) => key.startsWith(p));

const isQuotaError = (e: any) =>
    e instanceof DOMException &&
    (e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        e.code === 22 ||
        e.code === 1014);

/** Drops expendable caches, largest first, keeping `keep` untouched. */
const evictExpendable = (keep: string): boolean => {
    const candidates: Array<{ key: string; size: number }> = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || key === keep || !isExpendable(key)) continue;
        candidates.push({ key, size: (localStorage.getItem(key) || '').length });
    }
    if (!candidates.length) return false;

    candidates.sort((a, b) => b.size - a.size);
    for (const c of candidates) {
        try {
            localStorage.removeItem(c.key);
        } catch {
            // Ignore — we are already in the failure path.
        }
    }
    return true;
};

/** Writes a value, making room if needed. Returns false if it could not be stored. */
export const safeSetItem = (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (e) {
        if (!isQuotaError(e)) {
            console.warn(`Could not write "${key}" to storage:`, e);
            return false;
        }
        if (evictExpendable(key)) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch {
                // Still does not fit.
            }
        }
        console.warn(`Storage is full; "${key}" was not saved.`);
        return false;
    }
};

export const safeGetItem = (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

export const safeRemoveItem = (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(key);
    } catch {
        // Nothing useful to do if even removal fails.
    }
};
