/**
 * Global Error Handlers
 *
 * @module shared/utils/errors/ErrorHandlers
 */

import { handleError } from './ErrorService';
import { errorMonitor } from './ErrorMonitor';
import { errorReporter } from './ErrorReporting';
import { logError } from './ErrorLogger';

/**
 * Global unhandled error handler
 */
export function setupGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') {
    return; // Skip on server-side
  }

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    const error = event.error || new Error(event.message);
    
    handleGlobalError(error, {
      type: 'uncaught_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });

    // Prevent default browser error handling if needed
    // event.preventDefault();
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    handleGlobalError(error, {
      type: 'unhandled_rejection',
      promise: 'Promise rejection',
    });

    // Prevent default browser error handling if needed
    // event.preventDefault();
  });
}

/**
 * Handle global error
 */
function handleGlobalError(error: unknown, context: Record<string, unknown>): void {
  // Track error
  errorMonitor.track(error);

  // Log error
  logError(error, context);

  // Report error
  errorReporter.report(error, context, 'high');

  // Handle error (user notification, recovery, etc.)
  handleError(error);
}

/**
 * Create error handler for async functions
 */
export function createAsyncErrorHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Record<string, unknown>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleGlobalError(error, {
        ...context,
        functionName: fn.name,
        arguments: args,
      });
      throw error;
    }
  }) as T;
}

/**
 * Create error handler for sync functions
 */
export function createSyncErrorHandler<T extends (...args: any[]) => any>(
  fn: T,
  context?: Record<string, unknown>
): T {
  return ((...args: Parameters<T>) => {
    try {
      return fn(...args);
    } catch (error) {
      handleGlobalError(error, {
        ...context,
        functionName: fn.name,
        arguments: args,
      });
      throw error;
    }
  }) as T;
}

/**
 * Wrap function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  context?: Record<string, unknown>
): T {
  const isAsync = fn.constructor.name === 'AsyncFunction';
  return isAsync
    ? createAsyncErrorHandler(fn, context)
    : createSyncErrorHandler(fn, context);
}

/**
 * Create API error handler
 */
export function createAPIErrorHandler(endpoint: string, method: string) {
  return (error: unknown, status?: number) => {
    errorMonitor.track(error);
    logError(error, {
      type: 'API_ERROR',
      endpoint,
      method,
      status,
    });
    errorReporter.reportAPIError(error, endpoint, method, status);
  };
}

/**
 * Create component error handler
 */
export function createComponentErrorHandler(componentName: string) {
  return (error: unknown, errorInfo?: { componentStack?: string }) => {
    errorMonitor.track(error);
    logError(error, {
      type: 'COMPONENT_ERROR',
      component: componentName,
      componentStack: errorInfo?.componentStack,
    });
    errorReporter.report(error, { component: componentName }, 'high');
  };
}

/**
 * Cleanup error handlers
 */
export function cleanupGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Note: This removes ALL error handlers, not just ours
  // In production, you might want a more specific cleanup strategy
  window.removeEventListener('error', () => {});
  window.removeEventListener('unhandledrejection', () => {});
}

