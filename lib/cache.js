// Simple in-memory cache with TTL
const cacheStore = new Map();

export function getCache(key, ttlMs = 5 * 60 * 1000) {
  const item = cacheStore.get(key);
  if (!item) return null;
  
  // Check if item is expired
  if (Date.now() - item.timestamp > ttlMs) {
    cacheStore.delete(key);
    return null;
  }
  
  return item.data;
}

export function setCache(key, data) {
  cacheStore.set(key, {
    data,
    timestamp: Date.now(),
  });
  return data;
}