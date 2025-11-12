/**
 * Error-related constants
 */

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  TIMEOUT_ERROR: 'The request took too long to complete. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment before trying again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

export const ERROR_CODES = {
  NETWORK_ERROR: 'ERR_NETWORK',
  TIMEOUT: 'ERR_TIMEOUT',
  UNAUTHORIZED: 'ERR_UNAUTHORIZED',
  NOT_FOUND: 'ERR_NOT_FOUND',
  SERVER_ERROR: 'ERR_SERVER',
  VALIDATION: 'ERR_VALIDATION',
  RATE_LIMIT: 'ERR_RATE_LIMIT',
} as const;

export const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: 'Bad Request - The request was invalid.',
  401: 'Unauthorized - Please sign in to continue.',
  403: 'Forbidden - You do not have permission to access this resource.',
  404: 'Not Found - The requested resource does not exist.',
  408: 'Request Timeout - The request took too long to complete.',
  429: 'Too Many Requests - Please wait before trying again.',
  500: 'Internal Server Error - Something went wrong on our end.',
  502: 'Bad Gateway - Unable to reach the server.',
  503: 'Service Unavailable - The service is temporarily unavailable.',
  504: 'Gateway Timeout - The server did not respond in time.',
};

export const ERROR_RETRY_DELAYS = {
  DEFAULT: 1000,
  NETWORK: 3000,
  RATE_LIMIT: 5000,
  SERVER: 2000,
} as const;

export const MAX_ERROR_RETRIES = 3;

export const ERROR_LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
} as const;

