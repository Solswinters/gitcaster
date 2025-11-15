/**
 * Auth feature constants
 */

export const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
export const REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export const AUTH_PROVIDERS = {
  EMAIL: 'email',
  WALLET: 'wallet',
  GITHUB: 'github',
} as const;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  SESSION_EXPIRED: 'Session has expired',
  INVALID_TOKEN: 'Invalid authentication token',
  MISSING_CREDENTIALS: 'Missing required credentials',
} as const;

export const LOCAL_STORAGE_KEYS = {
  SESSION_ID: 'sessionId',
  REFRESH_TOKEN: 'refreshToken',
  USER_PREFERENCES: 'userPreferences',
} as const;

