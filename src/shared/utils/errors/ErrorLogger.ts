/**
 * Error Logger
 *
 * @module shared/utils/errors/ErrorLogger
 */

import { AppError } from './ErrorService';
import { logger } from '../logger';

/**
 * Log error with context
 */
export function logError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  if (error instanceof AppError) {
    const logContext = {
      ...error.context,
      ...context,
      code: error.code,
      severity: error.severity,
      timestamp: error.timestamp.toISOString(),
    };

    if (error.severity === 'critical') {
      logger.error('Critical error:', error.message, logContext);
    } else if (error.severity === 'high') {
      logger.error('High severity error:', error.message, logContext);
    } else if (error.severity === 'medium') {
      logger.warn('Medium severity error:', error.message, logContext);
    } else {
      logger.info('Low severity error:', error.message, logContext);
    }
  } else if (error instanceof Error) {
    logger.error('Unhandled error:', error.message, {
      ...context,
      stack: error.stack,
    });
  } else {
    logger.error('Unknown error:', error, context);
  }
}

/**
 * Log error with stack trace
 */
export function logErrorWithStack(
  error: unknown,
  context?: Record<string, unknown>
): void {
  if (error instanceof Error) {
    logger.error('Error with stack:', error.message, {
      ...context,
      stack: error.stack,
    });
  } else {
    logError(error, context);
  }
}

/**
 * Log API error
 */
export function logAPIError(
  endpoint: string,
  method: string,
  status: number,
  error: unknown
): void {
  logError(error, {
    type: 'API_ERROR',
    endpoint,
    method,
    status,
  });
}

/**
 * Log network error
 */
export function logNetworkError(url: string, error: unknown): void {
  logError(error, {
    type: 'NETWORK_ERROR',
    url,
  });
}

/**
 * Log validation error
 */
export function logValidationError(
  field: string,
  value: unknown,
  error: unknown
): void {
  logError(error, {
    type: 'VALIDATION_ERROR',
    field,
    value,
  });
}

/**
 * Log authentication error
 */
export function logAuthError(action: string, error: unknown): void {
  logError(error, {
    type: 'AUTH_ERROR',
    action,
  });
}

/**
 * Log component error (for ErrorBoundary)
 */
export function logComponentError(
  componentName: string,
  error: unknown,
  errorInfo?: { componentStack?: string }
): void {
  logError(error, {
    type: 'COMPONENT_ERROR',
    component: componentName,
    componentStack: errorInfo?.componentStack,
  });
}

/**
 * Log async operation error
 */
export function logAsyncError(
  operation: string,
  error: unknown,
  context?: Record<string, unknown>
): void {
  logError(error, {
    type: 'ASYNC_ERROR',
    operation,
    ...context,
  });
}

/**
 * Create error logger with prefix
 */
export function createErrorLogger(prefix: string) {
  return {
    logError: (error: unknown, context?: Record<string, unknown>) =>
      logError(error, { ...context, prefix }),
    logAPIError: (endpoint: string, method: string, status: number, error: unknown) =>
      logAPIError(endpoint, method, status, error),
    logNetworkError: (url: string, error: unknown) =>
      logNetworkError(url, error),
    logValidationError: (field: string, value: unknown, error: unknown) =>
      logValidationError(field, value, error),
  };
}

