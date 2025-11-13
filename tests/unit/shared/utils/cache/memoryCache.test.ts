import { MemoryCache } from '@/shared/utils/cache/memoryCache';

describe('MemoryCache', () => {
  let cache: MemoryCache<any>;

  beforeEach(() => {
    cache = new MemoryCache(1000); // 1 second TTL
  });

  afterEach(() => {
    cache.clear();
  });

  describe('set and get', () => {
    it('sets and gets a value', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('returns null for non-existent key', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    it('stores different data types', () => {
      cache.set('string', 'text');
      cache.set('number', 42);
      cache.set('object', { name: 'John' });
      cache.set('array', [1, 2, 3]);

      expect(cache.get('string')).toBe('text');
      expect(cache.get('number')).toBe(42);
      expect(cache.get('object')).toEqual({ name: 'John' });
      expect(cache.get('array')).toEqual([1, 2, 3]);
    });
  });

  describe('TTL expiration', () => {
    it('expires entries after TTL', async () => {
      cache.set('expiring', 'value', 100);
      expect(cache.get('expiring')).toBe('value');

      await new Promise((resolve) => setTimeout(resolve, 150));
      
      expect(cache.get('expiring')).toBeNull();
    });

    it('uses default TTL when not specified', async () => {
      const shortCache = new MemoryCache(100);
      shortCache.set('key', 'value');
      
      await new Promise((resolve) => setTimeout(resolve, 150));
      
      expect(shortCache.get('key')).toBeNull();
    });

    it('respects custom TTL over default', async () => {
      cache.set('custom', 'value', 2000);
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Should still exist after default TTL but before custom TTL
      expect(cache.get('custom')).toBe('value');
    });
  });

  describe('has', () => {
    it('returns true for existing key', () => {
      cache.set('key', 'value');
      expect(cache.has('key')).toBe(true);
    });

    it('returns false for non-existent key', () => {
      expect(cache.has('nonexistent')).toBe(false);
    });

    it('returns false for expired key', async () => {
      cache.set('expiring', 'value', 100);
      
      await new Promise((resolve) => setTimeout(resolve, 150));
      
      expect(cache.has('expiring')).toBe(false);
    });
  });

  describe('delete', () => {
    it('deletes a key', () => {
      cache.set('key', 'value');
      expect(cache.has('key')).toBe(true);
      
      cache.delete('key');
      expect(cache.has('key')).toBe(false);
    });

    it('returns true when deleting existing key', () => {
      cache.set('key', 'value');
      expect(cache.delete('key')).toBe(true);
    });

    it('returns false when deleting non-existent key', () => {
      expect(cache.delete('nonexistent')).toBe(false);
    });
  });

  describe('clear', () => {
    it('clears all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      expect(cache.size()).toBe(3);
      
      cache.clear();
      expect(cache.size()).toBe(0);
    });
  });

  describe('size', () => {
    it('returns the number of entries', () => {
      expect(cache.size()).toBe(0);
      
      cache.set('key1', 'value1');
      expect(cache.size()).toBe(1);
      
      cache.set('key2', 'value2');
      expect(cache.size()).toBe(2);
      
      cache.delete('key1');
      expect(cache.size()).toBe(1);
    });
  });

  describe('getOrSet', () => {
    it('returns cached value if present', async () => {
      cache.set('key', 'cached');
      
      const fetcher = jest.fn().mockResolvedValue('fresh');
      const result = await cache.getOrSet('key', fetcher);
      
      expect(result).toBe('cached');
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('fetches and caches value if not present', async () => {
      const fetcher = jest.fn().mockResolvedValue('fresh');
      const result = await cache.getOrSet('key', fetcher);
      
      expect(result).toBe('fresh');
      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(cache.get('key')).toBe('fresh');
    });

    it('uses custom TTL', async () => {
      const fetcher = jest.fn().mockResolvedValue('value');
      await cache.getOrSet('key', fetcher, 100);
      
      await new Promise((resolve) => setTimeout(resolve, 150));
      
      expect(cache.get('key')).toBeNull();
    });
  });

  describe('cleanup', () => {
    it('removes expired entries', async () => {
      cache.set('key1', 'value1', 100);
      cache.set('key2', 'value2', 1000);
      cache.set('key3', 'value3', 100);
      
      await new Promise((resolve) => setTimeout(resolve, 150));
      
      const removed = cache.cleanup();
      
      expect(removed).toBe(2);
      expect(cache.size()).toBe(1);
      expect(cache.has('key2')).toBe(true);
    });

    it('returns 0 when no entries expired', () => {
      cache.set('key1', 'value1', 1000);
      cache.set('key2', 'value2', 1000);
      
      const removed = cache.cleanup();
      
      expect(removed).toBe(0);
      expect(cache.size()).toBe(2);
    });
  });

  describe('keys', () => {
    it('returns all keys', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      const keys = cache.keys();
      
      expect(keys).toHaveLength(3);
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
    });

    it('returns empty array when cache is empty', () => {
      expect(cache.keys()).toEqual([]);
    });
  });

  describe('stats', () => {
    it('returns cache statistics', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      const stats = cache.stats();
      
      expect(stats.size).toBe(2);
      expect(stats.keys).toHaveLength(2);
    });
  });
});

