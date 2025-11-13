/**
 * Application Constants
 * 
 * Centralized constants for the application
 */

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    NONCE: '/api/auth/nonce',
    VERIFY: '/api/auth/verify',
    SESSION: '/api/auth/session',
    LOGOUT: '/api/auth/logout',
  },
  GITHUB: {
    CALLBACK: '/api/github/callback',
    SYNC: '/api/sync',
  },
  PROFILE: {
    BASE: '/api/profile',
    ME: '/api/profile/me',
  },
  SEARCH: {
    BASE: '/api/search',
    SUGGESTIONS: '/api/search/suggestions',
    SAVED: '/api/search/saved',
  },
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'GitCaster',
  DESCRIPTION: 'Build your developer reputation profile',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  REOWN_PROJECT_ID: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
} as const;

// Feature Flags
export const FEATURES = {
  SEARCH_ENABLED: true,
  ANALYTICS_ENABLED: true,
  COLLABORATION_ENABLED: false, // Feature in development
  TALENT_PROTOCOL_ENABLED: true,
  THEMES_ENABLED: true,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  SEARCH_PAGE_SIZE: 20,
} as const;

// Cache TTL (in seconds)
export const CACHE_TTL = {
  PROFILE: 300, // 5 minutes
  SEARCH: 180, // 3 minutes
  GITHUB_DATA: 600, // 10 minutes
  SESSION: 3600, // 1 hour
} as const;

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  GITHUB_SYNC: 120000, // 2 minutes
  SEARCH_DEBOUNCE: 300, // 300ms
} as const;

// Limits
export const LIMITS = {
  MAX_REPOS_DISPLAYED: 10,
  MAX_COMMITS_DISPLAYED: 50,
  MAX_RECENT_SEARCHES: 10,
  MAX_SAVED_SEARCHES: 20,
  MAX_BIO_LENGTH: 500,
  MAX_DISPLAY_NAME_LENGTH: 50,
} as const;

// Status Messages
export const MESSAGES = {
  SUCCESS: {
    PROFILE_UPDATED: 'Profile updated successfully',
    GITHUB_SYNCED: 'GitHub data synced successfully',
    SEARCH_SAVED: 'Search saved successfully',
    LOGOUT: 'Logged out successfully',
  },
  ERROR: {
    GENERIC: 'An error occurred. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    AUTH_REQUIRED: 'Please sign in to continue.',
    GITHUB_SYNC_FAILED: 'Failed to sync GitHub data.',
    PROFILE_NOT_FOUND: 'Profile not found.',
    SEARCH_FAILED: 'Search failed. Please try again.',
  },
  INFO: {
    LOADING: 'Loading...',
    SYNCING: 'Syncing GitHub data...',
    SEARCHING: 'Searching...',
  },
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SEARCH: '/search',
  DISCOVER: '/discover',
  ONBOARDING: '/onboarding',
  SETTINGS: '/settings',
  ANALYTICS: '/analytics',
  COLLABORATION: '/collaboration',
  THEMES: '/themes',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  RECENT_SEARCHES: 'recentSearches',
  THEME: 'theme',
  LANGUAGE: 'language',
  ONBOARDING_COMPLETE: 'onboardingComplete',
} as const;

// GitHub Languages Colors
export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  React: '#61dafb',
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 39,
  MIN_QUERY_LENGTH: 2,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  GITHUB_USERNAME_REGEX: /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/,
  ETH_ADDRESS_REGEX: /^0x[a-fA-F0-9]{40}$/,
} as const;

