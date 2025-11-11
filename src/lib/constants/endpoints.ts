// API endpoint constants for consistent URL management

export const API_ENDPOINTS = {
  AUTH: {
    NONCE: '/api/auth/nonce',
    VERIFY: '/api/auth/verify',
    SESSION: '/api/auth/session',
    LOGOUT: '/api/auth/logout',
  },
  GITHUB: {
    CALLBACK: '/api/github/callback',
  },
  SYNC: {
    GITHUB: '/api/sync',
    TALENT: '/api/sync/talent',
  },
  PROFILE: {
    BASE: '/api/profile',
  },
} as const;

