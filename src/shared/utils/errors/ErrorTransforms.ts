/**
 * Error Transform Utilities
 *
 * @module shared/utils/errors/ErrorTransforms
 */

import { AppError, ErrorCode } from './ErrorService';

/**
 * Transform common error types to AppError
 */
export function transformError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.name === 'AbortError') {
      return new AppError(
        'Request was cancelled',
        ErrorCode.CANCELLED,
        'medium',
        { originalError: error }
      );
    }

    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      return new AppError(
        'Request timed out',
        ErrorCode.TIMEOUT,
        'medium',
        { originalError: error }
      );
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      return new AppError(
        'Network error occurred',
        ErrorCode.NETWORK,
        'high',
        { originalError: error }
      );
    }

    // Generic error
    return new AppError(
      error.message,
      ErrorCode.UNKNOWN,
      'medium',
      { originalError: error }
    );
  }

  // Unknown error type
  return new AppError(
    'An unexpected error occurred',
    ErrorCode.UNKNOWN,
    'medium',
    { originalError: error }
  );
}

/**
 * Transform HTTP response to AppError
 */
export function transformHTTPError(
  status: number,
  statusText: string,
  data?: unknown
): AppError {
  const context = { status, statusText, data };

  if (status === 400) {
    return new AppError(
      'Invalid request',
      ErrorCode.VALIDATION,
      'low',
      context
    );
  }

  if (status === 401) {
    return new AppError(
      'Authentication required',
      ErrorCode.UNAUTHORIZED,
      'high',
      context
    );
  }

  if (status === 403) {
    return new AppError(
      'Access forbidden',
      ErrorCode.FORBIDDEN,
      'high',
      context
    );
  }

  if (status === 404) {
    return new AppError(
      'Resource not found',
      ErrorCode.NOT_FOUND,
      'low',
      context
    );
  }

  if (status === 409) {
    return new AppError(
      'Resource conflict',
      ErrorCode.CONFLICT,
      'medium',
      context
    );
  }

  if (status === 429) {
    return new AppError(
      'Too many requests',
      ErrorCode.RATE_LIMIT,
      'medium',
      context
    );
  }

  if (status >= 500) {
    return new AppError(
      'Server error',
      ErrorCode.SERVER,
      'critical',
      context
    );
  }

  return new AppError(
    statusText || 'HTTP error',
    ErrorCode.NETWORK,
    'medium',
    context
  );
}

/**
 * Transform validation errors to AppError
 */
export function transformValidationError(
  field: string,
  message: string,
  value?: unknown
): AppError {
  return new AppError(
    `Validation failed: ${message}`,
    ErrorCode.VALIDATION,
    'low',
    { field, value }
  );
}

/**
 * Transform API error response to AppError
 */
export function transformAPIError(response: {
  status?: number;
  statusText?: string;
  data?: {
    error?: string;
    message?: string;
    code?: string;
  };
}): AppError {
  const status = response.status || 500;
  const message =
    response.data?.message ||
    response.data?.error ||
    response.statusText ||
    'API error';

  const code = mapAPIErrorCode(response.data?.code);

  return new AppError(message, code, 'high', {
    status,
    apiCode: response.data?.code,
  });
}

/**
 * Map API error codes to ErrorCode
 */
function mapAPIErrorCode(apiCode?: string): ErrorCode {
  if (!apiCode) return ErrorCode.SERVER;

  const mapping: Record<string, ErrorCode> = {
    VALIDATION_ERROR: ErrorCode.VALIDATION,
    UNAUTHORIZED: ErrorCode.UNAUTHORIZED,
    FORBIDDEN: ErrorCode.FORBIDDEN,
    NOT_FOUND: ErrorCode.NOT_FOUND,
    CONFLICT: ErrorCode.CONFLICT,
    RATE_LIMIT: ErrorCode.RATE_LIMIT,
    SERVER_ERROR: ErrorCode.SERVER,
    NETWORK_ERROR: ErrorCode.NETWORK,
    TIMEOUT: ErrorCode.TIMEOUT,
  };

  return mapping[apiCode] || ErrorCode.SERVER;
}

/**
 * Extract user-friendly message from error
 */
export function getUserMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Don't expose technical error messages to users
    if (error.message.includes('fetch')) {
      return 'Network connection error. Please try again.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    return 'An error occurred. Please try again.';
  }

  return 'An unexpected error occurred.';
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof AppError) {
    return [
      ErrorCode.NETWORK,
      ErrorCode.TIMEOUT,
      ErrorCode.RATE_LIMIT,
      ErrorCode.SERVER,
    ].includes(error.code as ErrorCode);
  }

  if (error instanceof Error) {
    return (
      error.name === 'TimeoutError' ||
      error.message.includes('network') ||
      error.message.includes('timeout')
    );
  }

  return false;
}

/**
 * Get error severity from status code
 */
export function getErrorSeverity(
  status: number
): 'low' | 'medium' | 'high' | 'critical' {
  if (status >= 500) return 'critical';
  if (status === 401 || status === 403) return 'high';
  if (status === 429 || status === 409) return 'medium';
  return 'low';
}

