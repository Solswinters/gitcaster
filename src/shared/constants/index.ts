/**
 * Shared Constants
 * 
 * Application-wide constants consolidated from various sources.
 */

// Re-export all constant modules
export * from './colors';
export * from './endpoints';
export * from './messages';
export * from './timing';

// Application constants
export const APP_NAME = 'GitCaster';
export const APP_DESCRIPTION = 'Showcase your GitHub presence on the blockchain';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SEARCH: '/search',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  DISCOVER: '/discover',
  COLLABORATION: '/collaboration',
  ONBOARDING: '/onboarding',
  THEMES: '/themes',
} as const;

export const API_ROUTES = {
  AUTH: {
    GITHUB: '/api/auth/github',
    LOGOUT: '/api/auth/logout',
    SESSION: '/api/auth/session',
    NONCE: '/api/auth/nonce',
    VERIFY: '/api/auth/verify',
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE: '/api/user/update',
  },
  GITHUB: {
    REPOS: '/api/github/repos',
    SYNC: '/api/github/sync',
    STATS: '/api/github/stats',
  },
  ANALYTICS: {
    TRACK: '/api/analytics/track',
    DATA: '/api/analytics/data',
  },
  SEARCH: {
    USERS: '/api/search/users',
    REPOSITORIES: '/api/search/repositories',
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
} as const;

export const CACHE_DURATION = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

export const GITHUB_CONFIG = {
  MAX_REPOS_PER_PAGE: 100,
  RATE_LIMIT_THRESHOLD: 100,
  API_VERSION: '2022-11-28',
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_BIO_LENGTH: 500,
  MAX_USERNAME_LENGTH: 39, // GitHub's max
  MIN_USERNAME_LENGTH: 1,
  MAX_SLUG_LENGTH: 100,
} as const;

export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;
