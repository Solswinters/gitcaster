/**
 * PWA configuration
 */

export const pwaConfig = {
  enabled: process.env.ENABLE_PWA !== 'false',
  serviceWorkerPath: process.env.SW_PATH || '/sw.js',
  offlinePagePath: process.env.OFFLINE_PAGE_PATH || '/offline',
  cacheName: process.env.CACHE_NAME || 'gitcaster-v1',
  cacheStrategy: (process.env.CACHE_STRATEGY as 'cache-first' | 'network-first' | 'stale-while-revalidate') || 'network-first',
} as const;

