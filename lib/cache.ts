/**
 * Simple in-memory cache with TTL support
 * Stores API responses to reduce redundant external API calls
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    this.cache = new Map()
    // Start cleanup interval (every 5 minutes)
    this.startCleanup()
  }

  /**
   * Set a value in cache with TTL (time to live in milliseconds)
   */
  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache] SET: ${key} (TTL: ${ttl}ms)`)
    }
  }

  /**
   * Get a value from cache if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Cache] MISS: ${key}`)
      }
      return null
    }

    const now = Date.now()
    const age = now - entry.timestamp

    if (age > entry.ttl) {
      // Expired, remove it
      this.cache.delete(key)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Cache] EXPIRED: ${key} (age: ${age}ms)`)
      }
      return null
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache] HIT: ${key} (age: ${age}ms, remaining: ${entry.ttl - age}ms)`)
    }

    return entry.data as T
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Clear a specific key or all keys
   */
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Cache] CLEARED: ${key}`)
      }
    } else {
      this.cache.clear()
      if (process.env.NODE_ENV === 'development') {
        console.log('[Cache] CLEARED ALL')
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const entries = Array.from(this.cache.entries())
    const now = Date.now()
    
    return {
      totalEntries: entries.length,
      activeEntries: entries.filter(([_, entry]) => now - entry.timestamp < entry.ttl).length,
      expiredEntries: entries.filter(([_, entry]) => now - entry.timestamp >= entry.ttl).length,
      totalSize: JSON.stringify(Array.from(this.cache.entries())).length
    }
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup() {
    if (this.cleanupInterval) return
    
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      let cleaned = 0
      
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key)
          cleaned++
        }
      }
      
      if (cleaned > 0 && process.env.NODE_ENV === 'development') {
        console.log(`[Cache] Cleanup: removed ${cleaned} expired entries`)
      }
    }, 5 * 60 * 1000) // 5 minutes
  }

  /**
   * Stop cleanup interval (for cleanup/testing)
   */
  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }
}

// Singleton instance
const cache = new MemoryCache()

// TTL constants (in milliseconds)
export const TTL = {
  GEOCODE: 24 * 60 * 60 * 1000,      // 24 hours
  AMENITIES: 6 * 60 * 60 * 1000,     // 6 hours
  ISOCHRONE: 12 * 60 * 60 * 1000,    // 12 hours
  AI_ANALYSIS: 60 * 60 * 1000,        // 1 hour
  SHORT: 5 * 60 * 1000                // 5 minutes
}

// Helper function to generate cache keys
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  return `${prefix}:${sortedParams}`
}

export default cache

