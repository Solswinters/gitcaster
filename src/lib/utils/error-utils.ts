/**
 * Utility functions for error handling
 */

/**
 * Check if error is an AbortError
 */
export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('NetworkError')
    );
  }
  return false;
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  return error instanceof Error && error.message.toLowerCase().includes('timeout');
}

/**
 * Extract status code from error
 */
export function extractStatusCode(error: unknown): number | null {
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    return err.status || err.statusCode || err.response?.status || null;
  }
  return null;
}

/**
 * Create a user-friendly error from any error
 */
export function createUserFriendlyError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  return new Error('An unexpected error occurred');
}

/**
 * Combine multiple errors into one message
 */
export function combineErrors(errors: unknown[]): string {
  return errors
    .map(err => {
      if (err instanceof Error) return err.message;
      if (typeof err === 'string') return err;
      return 'Unknown error';
    })
    .join('; ');
}

