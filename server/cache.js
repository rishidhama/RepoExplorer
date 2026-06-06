const TTL_MS = 60_000;
const store = new Map();

export function get(key) {
  const entry = store.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > TTL_MS) {
    store.delete(key);
    return null;
  }

  return entry.data;
}

export function set(key, data) {
  store.set(key, { data, timestamp: Date.now() });
}
