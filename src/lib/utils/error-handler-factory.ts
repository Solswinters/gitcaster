/**
 * Factory for creating consistent error handlers
 */

import { ErrorLogger } from './error-logger';
import { formatErrorMessage } from './error-formatter';

export interface ErrorHandlerConfig {
  onError?: (error: Error) => void;
  logErrors?: boolean;
  showToast?: boolean;
  fallbackMessage?: string;
}

/**
 * Create a standardized error handler function
 */
export function createErrorHandler(config: ErrorHandlerConfig = {}) {
  return function handleError(error: unknown, context?: string) {
    const {
      onError,
      logErrors = true,
      fallbackMessage = 'An error occurred',
    } = config;

    // Convert to Error object
    const errorObj = error instanceof Error ? error : new Error(String(error));

    // Log if enabled
    if (logErrors) {
      ErrorLogger.log(errorObj, context);
    }

    // Get user-friendly message
    const message = formatErrorMessage(error) || fallbackMessage;

    // Call custom handler
    if (onError) {
      onError(errorObj);
    }

    return {
      error: errorObj,
      message,
    };
  };
}

