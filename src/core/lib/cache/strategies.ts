/**
 * Cache strategies for different types of data
 */

export interface CacheStrategy {
  ttl: number; // Time to live in seconds
  staleWhileRevalidate?: number; // Serve stale data while fetching fresh
  tags?: string[]; // Cache tags for invalidation
}

export const cacheStrategies = {
  // Short-lived cache for frequently changing data
  realtime: {
    ttl: 60, // 1 minute
    staleWhileRevalidate: 30,
  },

  // Medium-lived cache for semi-static data
  standard: {
    ttl: 300, // 5 minutes
    staleWhileRevalidate: 60,
  },

  // Long-lived cache for static data
  static: {
    ttl: 3600, // 1 hour
    staleWhileRevalidate: 300,
  },

  // Very long cache for rarely changing data
  permanent: {
    ttl: 86400, // 24 hours
    staleWhileRevalidate: 3600,
  },

  // Profile data cache
  profile: {
    ttl: 600, // 10 minutes
    staleWhileRevalidate: 120,
    tags: ['profile'],
  },

  // GitHub stats cache
  githubStats: {
    ttl: 1800, // 30 minutes
    staleWhileRevalidate: 300,
    tags: ['github'],
  },

  // Search results cache
  searchResults: {
    ttl: 180, // 3 minutes
    staleWhileRevalidate: 60,
    tags: ['search'],
  },

  // User session cache
  session: {
    ttl: 3600, // 1 hour
    tags: ['session'],
  },
} as const;

export type CacheStrategyName = keyof typeof cacheStrategies;

/**
 * Get cache strategy by name
 */
export function getCacheStrategy(name: CacheStrategyName): CacheStrategy {
  return cacheStrategies[name];
}

/**
 * Generate cache key from parts
 */
export function generateCacheKey(namespace: string, ...parts: (string | number)[]): string {
  return `${namespace}:${parts.join(':')}`;
}

/**
 * Check if cache is stale
 */
export function isCacheStale(timestamp: number, ttl: number): boolean {
  const now = Date.now();
  const age = (now - timestamp) / 1000; // Convert to seconds
  return age > ttl;
}

/**
 * Check if we should serve stale data
 */
export function shouldServeStale(
  timestamp: number,
  strategy: CacheStrategy
): boolean {
  if (!strategy.staleWhileRevalidate) {
    return false;
  }

  const now = Date.now();
  const age = (now - timestamp) / 1000;
  const maxStaleAge = strategy.ttl + strategy.staleWhileRevalidate;

  return age > strategy.ttl && age <= maxStaleAge;
}

