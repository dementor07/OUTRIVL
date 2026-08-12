/**
 * Persisted product imagery.
 *
 * A tiny external store over localStorage so slots can be read with
 * `useSyncExternalStore` — that keeps the server render (always empty) and the
 * client render consistent, and means every slot sharing a key updates together
 * when one of them changes.
 *
 * This is a placeholder for the real asset pipeline: production uploads to
 * storage and persists a reference rather than a data URL.
 */

const listeners = new Set<() => void>();
const cache = new Map<string, string | null>();

function emit() {
  for (const l of listeners) l();
}

export function subscribeSlot(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getSlot(key: string): string | null {
  if (!cache.has(key)) {
    try {
      cache.set(key, window.localStorage.getItem(key));
    } catch {
      // Storage disabled: behave as an empty slot rather than throwing.
      cache.set(key, null);
    }
  }
  return cache.get(key) ?? null;
}

/** Server and hydration snapshot: nothing is stored yet. */
export function getSlotServer(): null {
  return null;
}

export function setSlot(key: string, value: string | null): void {
  cache.set(key, value);
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Over quota or unavailable: the value still lives in the cache for this
    // session, so the image shows until reload.
  }
  emit();
}
