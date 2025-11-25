import {

  cacheStrategies,
  getCacheStrategy,
  generateCacheKey,
  isCacheStale,
  shouldServeStale,
  CacheStrategy,
} from '@/lib/cache/cache-strategies';

describe('Cache Strategies', () => {
  describe('cacheStrategies', () => {
    it('should have realtime strategy', () => {
      expect(cacheStrategies.realtime).toBeDefined();
      expect(cacheStrategies.realtime.ttl).toBe(60);
      expect(cacheStrategies.realtime.staleWhileRevalidate).toBe(30);
    });

    it('should have standard strategy', () => {
      expect(cacheStrategies.standard).toBeDefined();
      expect(cacheStrategies.standard.ttl).toBe(300);
    });

    it('should have static strategy', () => {
      expect(cacheStrategies.static).toBeDefined();
      expect(cacheStrategies.static.ttl).toBe(3600);
    });

    it('should have permanent strategy', () => {
      expect(cacheStrategies.permanent).toBeDefined();
      expect(cacheStrategies.permanent.ttl).toBe(86400);
    });

    it('should have profile-specific strategy', () => {
      expect(cacheStrategies.profile).toBeDefined();
      expect(cacheStrategies.profile.ttl).toBe(600);
      expect(cacheStrategies.profile.tags).toContain('profile');
    });

    it('should have github stats strategy', () => {
      expect(cacheStrategies.githubStats).toBeDefined();
      expect(cacheStrategies.githubStats.ttl).toBe(1800);
      expect(cacheStrategies.githubStats.tags).toContain('github');
    });

    it('should have search results strategy', () => {
      expect(cacheStrategies.searchResults).toBeDefined();
      expect(cacheStrategies.searchResults.ttl).toBe(180);
      expect(cacheStrategies.searchResults.tags).toContain('search');
    });

    it('should have session strategy', () => {
      expect(cacheStrategies.session).toBeDefined();
      expect(cacheStrategies.session.ttl).toBe(3600);
      expect(cacheStrategies.session.tags).toContain('session');
    });
  });

  describe('getCacheStrategy', () => {
    it('should return strategy by name', () => {
      const strategy = getCacheStrategy('realtime');
      expect(strategy).toEqual(cacheStrategies.realtime);
    });

    it('should return profile strategy', () => {
      const strategy = getCacheStrategy('profile');
      expect(strategy.ttl).toBe(600);
      expect(strategy.tags).toContain('profile');
    });
  });

  describe('generateCacheKey', () => {
    it('should generate key from namespace and parts', () => {
      const key = generateCacheKey('user', '123', 'profile');
      expect(key).toBe('user:123:profile');
    });

    it('should handle numeric parts', () => {
      const key = generateCacheKey('page', 1, 20);
      expect(key).toBe('page:1:20');
    });

    it('should work with single part', () => {
      const key = generateCacheKey('global', 'stats');
      expect(key).toBe('global:stats');
    });

    it('should work with many parts', () => {
      const key = generateCacheKey('search', 'developer', 'senior', 'remote', 1);
      expect(key).toBe('search:developer:senior:remote:1');
    });
  });

  describe('isCacheStale', () => {
    it('should return false for fresh cache', () => {
      const now = Date.now();
      const timestamp = now - 30000; // 30 seconds ago
      const ttl = 60; // 1 minute

      expect(isCacheStale(timestamp, ttl)).toBe(false);
    });

    it('should return true for stale cache', () => {
      const now = Date.now();
      const timestamp = now - 120000; // 2 minutes ago
      const ttl = 60; // 1 minute

      expect(isCacheStale(timestamp, ttl)).toBe(true);
    });

    it('should handle edge case at exact TTL', () => {
      const now = Date.now();
      const timestamp = now - 60000; // Exactly 60 seconds ago
      const ttl = 60;

      expect(isCacheStale(timestamp, ttl)).toBe(false);
    });

    it('should work with very short TTL', () => {
      const now = Date.now();
      const timestamp = now - 2000; // 2 seconds ago
      const ttl = 1; // 1 second

      expect(isCacheStale(timestamp, ttl)).toBe(true);
    });
  });

  describe('shouldServeStale', () => {
    it('should return false if no staleWhileRevalidate', () => {
      const strategy: CacheStrategy = {
        ttl: 60,
      };
      const timestamp = Date.now() - 90000; // 90 seconds ago

      expect(shouldServeStale(timestamp, strategy)).toBe(false);
    });

    it('should return false for fresh cache', () => {
      const strategy: CacheStrategy = {
        ttl: 60,
        staleWhileRevalidate: 30,
      };
      const timestamp = Date.now() - 30000; // 30 seconds ago

      expect(shouldServeStale(timestamp, strategy)).toBe(false);
    });

    it('should return true during stale-while-revalidate window', () => {
      const strategy: CacheStrategy = {
        ttl: 60,
        staleWhileRevalidate: 30,
      };
      const timestamp = Date.now() - 75000; // 75 seconds ago (within stale window)

      expect(shouldServeStale(timestamp, strategy)).toBe(true);
    });

    it('should return false after stale window expires', () => {
      const strategy: CacheStrategy = {
        ttl: 60,
        staleWhileRevalidate: 30,
      };
      const timestamp = Date.now() - 120000; // 2 minutes ago (beyond stale window)

      expect(shouldServeStale(timestamp, strategy)).toBe(false);
    });

    it('should work with profile strategy', () => {
      const strategy = cacheStrategies.profile;
      const withinStaleWindow = Date.now() - 660000; // 11 minutes (600 + 60)

      expect(shouldServeStale(withinStaleWindow, strategy)).toBe(true);
    });
  });
});

