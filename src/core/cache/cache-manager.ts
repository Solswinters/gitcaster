/**
 * Cache Manager - Advanced caching system with TTL and invalidation
 * HIGH PRIORITY: Performance improvements through intelligent caching
 */

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache size
  strategy: 'LRU' | 'LFU' | 'FIFO';
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  size: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

export class CacheManager<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private config: CacheConfig;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    hitRate: 0,
  };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: config.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: config.maxSize || 100,
      strategy: config.strategy || 'LRU',
    };
  }

  /**
   * Get value from cache
   */
  public get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Update access count for LFU strategy
    entry.accessCount++;
    entry.timestamp = Date.now();

    this.stats.hits++;
    this.updateHitRate();

    return entry.value;
  }

  /**
   * Set value in cache
   */
  public set(key: string, value: T, ttl?: number): void {
    const effectiveTtl = ttl || this.config.ttl;
    const now = Date.now();

    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: now,
      expiresAt: now + effectiveTtl,
      accessCount: 0,
      size: this.estimateSize(value),
    };

    // Evict if necessary
    if (this.cache.size >= this.config.maxSize) {
      this.evict();
    }

    this.cache.set(key, entry);
    this.stats.size = this.cache.size;
  }

  /**
   * Delete value from cache
   */
  public delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.stats.size = this.cache.size;
    return deleted;
  }

  /**
   * Check if key exists in cache
   */
  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear all cache entries
   */
  public clear(): void {
    this.cache.clear();
    this.stats.size = 0;
  }

  /**
   * Get cache statistics
   */
  public getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  public resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      size: this.cache.size,
      hitRate: 0,
    };
  }

  /**
   * Evict entries based on strategy
   */
  private evict(): void {
    switch (this.config.strategy) {
      case 'LRU':
        this.evictLRU();
        break;
      case 'LFU':
        this.evictLFU();
        break;
      case 'FIFO':
        this.evictFIFO();
        break;
    }
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Evict least frequently used entry
   */
  private evictLFU(): void {
    let leastUsedKey: string | null = null;
    let leastCount = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessCount < leastCount) {
        leastCount = entry.accessCount;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  /**
   * Evict first in, first out
   */
  private evictFIFO(): void {
    const firstKey = this.cache.keys().next().value;
    if (firstKey) {
      this.cache.delete(firstKey);
    }
  }

  /**
   * Update hit rate statistics
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  /**
   * Estimate size of cached value
   */
  private estimateSize(value: T): number {
    try {
      return JSON.stringify(value).length;
    } catch {
      return 1; // Default size if serialization fails
    }
  }

  /**
   * Clean up expired entries
   */
  public cleanupExpired(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    this.stats.size = this.cache.size;
    return cleaned;
  }

  /**
   * Get all keys in cache
   */
  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size
   */
  public size(): number {
    return this.cache.size;
  }

  /**
   * Get or set with factory function
   */
  public async getOrSet(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    this.set(key, value, ttl);
    return value;
  }
}

export default CacheManager;

