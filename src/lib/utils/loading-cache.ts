// Simple cache for loading states to prevent duplicate requests

class LoadingCache {
  private cache = new Map<string, Promise<any>>();

  /**
   * Get or set a loading promise with caching
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 60000
  ): Promise<T> {
    // Return cached promise if exists
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Create new promise and cache it
    const promise = fetchFn().then((result) => {
      // Clear cache after TTL
      setTimeout(() => {
        this.cache.delete(key);
      }, ttl);
      return result;
    }).catch((error) => {
      // Remove from cache on error
      this.cache.delete(key);
      throw error;
    });

    this.cache.set(key, promise);
    return promise;
  }

  /**
   * Clear specific cache entry
   */
  clear(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
  }
}

export const loadingCache = new LoadingCache();

