/**
 * Standard error codes for the application
 */
export const ErrorCodes = {
  // Authentication errors (1xxx)
  AUTH_FAILED: 1001,
  AUTH_EXPIRED: 1002,
  AUTH_INVALID_TOKEN: 1003,
  AUTH_UNAUTHORIZED: 1004,

  // Network errors (2xxx)
  NETWORK_ERROR: 2001,
  NETWORK_TIMEOUT: 2002,
  NETWORK_OFFLINE: 2003,

  // API errors (3xxx)
  API_ERROR: 3001,
  API_NOT_FOUND: 3002,
  API_RATE_LIMIT: 3003,
  API_SERVER_ERROR: 3004,

  // Validation errors (4xxx)
  VALIDATION_ERROR: 4001,
  VALIDATION_REQUIRED: 4002,
  VALIDATION_INVALID: 4003,

  // GitHub errors (5xxx)
  GITHUB_AUTH_FAILED: 5001,
  GITHUB_SYNC_FAILED: 5002,
  GITHUB_API_ERROR: 5003,
  GITHUB_RATE_LIMIT: 5004,

  // Database errors (6xxx)
  DB_ERROR: 6001,
  DB_NOT_FOUND: 6002,
  DB_DUPLICATE: 6003,

  // Unknown errors
  UNKNOWN_ERROR: 9999,
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * Get user-friendly message for error code
 */
export function getErrorMessage(code: ErrorCode): string {
  const messages: Record<ErrorCode, string> = {
    [ErrorCodes.AUTH_FAILED]: 'Authentication failed. Please try again.',
    [ErrorCodes.AUTH_EXPIRED]: 'Your session has expired. Please sign in again.',
    [ErrorCodes.AUTH_INVALID_TOKEN]: 'Invalid authentication token.',
    [ErrorCodes.AUTH_UNAUTHORIZED]: 'You are not authorized to perform this action.',
    
    [ErrorCodes.NETWORK_ERROR]: 'Network connection error. Please check your internet.',
    [ErrorCodes.NETWORK_TIMEOUT]: 'Request timed out. Please try again.',
    [ErrorCodes.NETWORK_OFFLINE]: 'You appear to be offline. Please check your connection.',
    
    [ErrorCodes.API_ERROR]: 'API request failed. Please try again.',
    [ErrorCodes.API_NOT_FOUND]: 'The requested resource was not found.',
    [ErrorCodes.API_RATE_LIMIT]: 'Too many requests. Please wait and try again.',
    [ErrorCodes.API_SERVER_ERROR]: 'Server error. Please try again later.',
    
    [ErrorCodes.VALIDATION_ERROR]: 'Please correct the errors in the form.',
    [ErrorCodes.VALIDATION_REQUIRED]: 'This field is required.',
    [ErrorCodes.VALIDATION_INVALID]: 'Invalid input. Please check and try again.',
    
    [ErrorCodes.GITHUB_AUTH_FAILED]: 'GitHub authentication failed.',
    [ErrorCodes.GITHUB_SYNC_FAILED]: 'Failed to sync GitHub data.',
    [ErrorCodes.GITHUB_API_ERROR]: 'GitHub API error. Please try again.',
    [ErrorCodes.GITHUB_RATE_LIMIT]: 'GitHub rate limit exceeded. Please wait.',
    
    [ErrorCodes.DB_ERROR]: 'Database error occurred.',
    [ErrorCodes.DB_NOT_FOUND]: 'Record not found in database.',
    [ErrorCodes.DB_DUPLICATE]: 'Duplicate record found.',
    
    [ErrorCodes.UNKNOWN_ERROR]: 'An unexpected error occurred.',
  };

  return messages[code] || messages[ErrorCodes.UNKNOWN_ERROR];
}

