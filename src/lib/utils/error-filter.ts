/**
 * Filter and categorize errors for display
 */

export interface FilteredError {
  shouldDisplay: boolean;
  category: 'user' | 'system' | 'network' | 'validation';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Determine if error should be shown to user and how
 */
export function filterError(error: unknown): FilteredError {
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  // Critical errors (always show)
  if (
    errorMessage.includes('payment') ||
    errorMessage.includes('transaction') ||
    errorMessage.includes('security')
  ) {
    return {
      shouldDisplay: true,
      category: 'system',
      severity: 'critical',
    };
  }

  // Network errors (show with retry)
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('fetch')
  ) {
    return {
      shouldDisplay: true,
      category: 'network',
      severity: 'medium',
    };
  }

  // Validation errors (show inline)
  if (
    errorMessage.includes('validation') ||
    errorMessage.includes('invalid') ||
    errorMessage.includes('required')
  ) {
    return {
      shouldDisplay: true,
      category: 'validation',
      severity: 'low',
    };
  }

  // User errors (show friendly message)
  if (
    errorMessage.includes('not found') ||
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('forbidden')
  ) {
    return {
      shouldDisplay: true,
      category: 'user',
      severity: 'medium',
    };
  }

  // System errors (log but show generic message)
  return {
    shouldDisplay: true,
    category: 'system',
    severity: 'high',
  };
}

/**
 * Check if error should be reported to monitoring
 */
export function shouldReportError(error: FilteredError): boolean {
  return error.severity === 'high' || error.severity === 'critical';
}

