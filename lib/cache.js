// simple in-memory cache with TTL
const cache = new Map()

export function getCache(key, ttlMs = 5 * 60 * 1000) {
  const item = cache.get(key)
  if (!item) return null
  
  // check if expired
  if (Date.now() - item.timestamp > ttlMs) {
    cache.delete(key)
    return null
  }
  
  return item.data
}

export function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}
