/**
 * Analytics cache management
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export class AnalyticsCacheManager {
  private static cache = new Map<string, CacheEntry<any>>()
  private static DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  static set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
    })
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  static invalidate(pattern: string): void {
    Array.from(this.cache.keys())
      .filter((key) => key.includes(pattern))
      .forEach((key) => this.cache.delete(key))
  }

  static clear(): void {
    this.cache.clear()
  }

  static getCacheKey(type: string, params: Record<string, any>): string {
    return `${type}:${JSON.stringify(params)}`
  }
}

