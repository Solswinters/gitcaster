/**
 * Application Constants
 *
 * Central location for all application constants
 */

export const APP_NAME = 'GitCaster';
export const APP_DESCRIPTION = 'Showcase your GitHub presence on the blockchain';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SEARCH: '/search',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;

export const API_ROUTES = {
  AUTH: {
    GITHUB: '/api/auth/github',
    LOGOUT: '/api/auth/logout',
    SESSION: '/api/auth/session',
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
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
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
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_BIO_LENGTH: 500,
  MAX_USERNAME_LENGTH: 39, // GitHub's max
} as const;

