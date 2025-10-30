class CacheManager {
  constructor(ttl = 5 * 60 * 1000) { // Default 5 minutes
    this.cache = new Map()
    this.ttl = ttl
  }

  set(key, value) {
    const expiresAt = Date.now() + this.ttl
    this.cache.set(key, { value, expiresAt })
  }

  get(key) {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key)
      return null
    }
    
    return cached.value
  }

  remove(key) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }
  
  has(key) {
    return this.cache.has(key) && Date.now() <= this.cache.get(key).expiresAt
  }
}

export const cacheManager = new CacheManager()
