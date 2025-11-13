/**
 * Search result caching utility
 * Caches search results in memory with TTL
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class SearchCache {
  private cache: Map<string, CacheEntry<any>>
  private readonly defaultTTL: number = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.cache = new Map()
    // Clean up expired entries every minute
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanup(), 60 * 1000)
    }
  }

  /**
   * Generate cache key from search parameters
   */
  private generateKey(params: Record<string, any>): string {
    const sorted = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key]
        return acc
      }, {} as Record<string, any>)
    
    return JSON.stringify(sorted)
  }

  /**
   * Get cached data if available and not expired
   */
  get<T>(params: Record<string, any>): T | null {
    const key = this.generateKey(params)
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Set cache data with optional custom TTL
   */
  set<T>(params: Record<string, any>, data: T, ttl?: number): void {
    const key = this.generateKey(params)
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    })
  }

  /**
   * Clear specific cache entry
   */
  delete(params: Record<string, any>): void {
    const key = this.generateKey(params)
    this.cache.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl,
      })),
    }
  }
}

// Export singleton instance
export const searchCache = new SearchCache()

/**
 * Hook for using search cache in components
 */
export function useSearchCache<T>(
  params: Record<string, any>,
  fetcher: () => Promise<T>
): {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
} {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetch = async () => {
    // Check cache first
    const cached = searchCache.get<T>(params)
    if (cached) {
      setData(cached)
      return
    }

    // Fetch from API
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      searchCache.set(params, result)
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [JSON.stringify(params)])

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
  }
}

// React import for useSearchCache hook
import { useState, useEffect } from 'react'

