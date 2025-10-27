const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const cacheManager = {
  set(key, data) {
    const item = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(`cache_${key}`, JSON.stringify(item))
  },

  get(key) {
    const item = localStorage.getItem(`cache_${key}`)
    if (!item) return null

    const parsed = JSON.parse(item)
    const age = Date.now() - parsed.timestamp

    if (age > CACHE_DURATION) {
      localStorage.removeItem(`cache_${key}`)
      return null
    }

    return parsed.data
  },

  clear(key) {
    if (key) {
      localStorage.removeItem(`cache_${key}`)
    } else {
      // Clear all cache
      Object.keys(localStorage)
        .filter(k => k.startsWith('cache_'))
        .forEach(k => localStorage.removeItem(k))
    }
  }
}
