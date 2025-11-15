/**
 * Core application constants
 */

export const APP_NAME = 'GitCaster';
export const APP_DESCRIPTION = 'Developer Portfolio & Talent Discovery Platform';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000; // 1 second

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Cache TTL (seconds)
export const CACHE_TTL_SHORT = 60; // 1 minute
export const CACHE_TTL_MEDIUM = 300; // 5 minutes
export const CACHE_TTL_LONG = 3600; // 1 hour
export const CACHE_TTL_DAY = 86400; // 24 hours

// Rate Limiting
export const RATE_LIMIT_REQUESTS = 100;
export const RATE_LIMIT_WINDOW = 60000; // 1 minute

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// URLs
export const GITHUB_API_URL = 'https://api.github.com';
export const TALENT_PROTOCOL_API_URL = 'https://api.talentprotocol.com';

