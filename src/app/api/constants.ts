/**
 * API constants
 */

/**
 * API_VERSION utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of API_VERSION.
 */
export const API_VERSION = 'v1';

/**
 * API_RATE_LIMITS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of API_RATE_LIMITS.
 */
export const API_RATE_LIMITS = {
  default: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 5,
  },
  search: {
    windowMs: 60 * 1000, // 1 minute
    max: 30,
  },
  analytics: {
    windowMs: 60 * 1000,
    max: 60,
  },
};

/**
 * API_TIMEOUT utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of API_TIMEOUT.
 */
export const API_TIMEOUT = {
  default: 30000, // 30 seconds
  long: 60000, // 60 seconds
  short: 10000, // 10 seconds
};

/**
 * API_CACHE_TTL utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of API_CACHE_TTL.
 */
export const API_CACHE_TTL = {
  short: 60, // 1 minute
  medium: 300, // 5 minutes
  long: 3600, // 1 hour
  day: 86400, // 24 hours
};

/**
 * API_ERROR_MESSAGES utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of API_ERROR_MESSAGES.
 */
export const API_ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Invalid request',
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  VALIDATION_ERROR: 'Validation failed',
  TIMEOUT: 'Request timeout',
};

/**
 * API_SUCCESS_MESSAGES utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of API_SUCCESS_MESSAGES.
 */
export const API_SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  SUCCESS: 'Operation completed successfully',
};

