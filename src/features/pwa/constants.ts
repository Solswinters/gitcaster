/**
 * PWA feature constants
 */

export const PWA_CACHE_NAME = 'gitcaster-v1';

export const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
} as const;

export const SW_EVENTS = {
  INSTALL: 'install',
  ACTIVATE: 'activate',
  FETCH: 'fetch',
  MESSAGE: 'message',
} as const;

