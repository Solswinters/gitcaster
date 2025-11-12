/**
 * Format error messages for display to users
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Clean up common error prefixes
    return error.message
      .replace(/^Error:\s*/i, '')
      .replace(/^Failed to\s*/i, 'Unable to ')
      .trim();
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Get user-friendly error title based on error type
 */
export function getErrorTitle(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('network')) return 'Network Error';
    if (error.message.includes('timeout')) return 'Request Timeout';
    if (error.message.includes('auth')) return 'Authentication Error';
    if (error.message.includes('permission')) return 'Permission Denied';
  }

  return 'Error';
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('temporarily') ||
      message.includes('try again')
    );
  }
  return false;
}

