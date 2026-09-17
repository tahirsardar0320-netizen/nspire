/**
 * Offline property queue. Properties created while genuinely unreachable (not
 * validation errors — those still surface immediately) are stored here with a
 * temp id and synced to MongoDB the next time the app can reach the server.
 * Unlike the old removed fallback, a queued item is never reported as a real
 * save — it's marked pendingSync so the UI can show it as such, and it's only
 * removed from the queue once the real server write actually succeeds.
 */

const QUEUE_KEY = 'inspire_offline_property_queue';

export interface QueuedProperty {
  tempId: string;
  data: {
    propertyId: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    buildings: number;
    units: number;
  };
  queuedAt: string;
}

function readQueue(): QueuedProperty[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(queue: QueuedProperty[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // Storage full or unavailable — the item just won't be queued.
  }
}

export function enqueueProperty(data: QueuedProperty['data']): QueuedProperty {
  const item: QueuedProperty = {
    tempId: `offline_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    data,
    queuedAt: new Date().toISOString(),
  };
  const queue = readQueue();
  queue.push(item);
  writeQueue(queue);
  return item;
}

export function getQueuedProperties(): QueuedProperty[] {
  return readQueue();
}

/** Shaped like a real property row so it can drop straight into the dashboard table. */
export function queuedAsDisplayProperty(item: QueuedProperty) {
  return {
    _id: item.tempId,
    ...item.data,
    status: 'active',
    pendingSync: true,
    createdAt: item.queuedAt,
    updatedAt: item.queuedAt,
  };
}

function removeFromQueue(tempId: string) {
  writeQueue(readQueue().filter((q) => q.tempId !== tempId));
}

let syncing = false;

/**
 * Tries to push every queued property to the real API. Safe to call often —
 * re-entrant calls no-op while a sync is already in flight, and each item is
 * only removed from the queue once its own POST actually succeeds.
 */
export async function syncOfflineQueue(
  postProperty: (data: QueuedProperty['data']) => Promise<{ success: boolean; property?: any }>
): Promise<{ synced: number; remaining: number }> {
  if (syncing) return { synced: 0, remaining: readQueue().length };
  syncing = true;
  try {
    const queue = readQueue();
    let synced = 0;
    for (const item of queue) {
      try {
        const result = await postProperty(item.data);
        if (result.success) {
          removeFromQueue(item.tempId);
          synced++;
        }
      } catch {
        // Still unreachable — leave it queued and stop; the rest will retry next time.
        break;
      }
    }
    return { synced, remaining: readQueue().length };
  } finally {
    syncing = false;
  }
}
