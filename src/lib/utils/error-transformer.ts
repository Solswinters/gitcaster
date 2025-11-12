/**
 * Transform various error types into a consistent format
 */

export interface TransformedError {
  message: string;
  code?: number | string;
  type: 'validation' | 'network' | 'auth' | 'api' | 'unknown';
  retryable: boolean;
  details?: unknown;
}

/**
 * Transform any error into a consistent format
 */
export function transformError(error: unknown): TransformedError {
  // Axios/Fetch errors
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    
    // Network/Fetch error
    if (err.response) {
      const status = err.response.status;
      return {
        message: err.response.data?.message || err.message || 'API request failed',
        code: status,
        type: status >= 400 && status < 500 ? 'api' : 'network',
        retryable: status >= 500,
        details: err.response.data,
      };
    }

    // Network error
    if (err.request) {
      return {
        message: 'Network error. Please check your connection.',
        type: 'network',
        retryable: true,
      };
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('auth') || message.includes('unauthorized')) {
      return {
        message: error.message,
        type: 'auth',
        retryable: false,
      };
    }

    if (message.includes('validation') || message.includes('invalid')) {
      return {
        message: error.message,
        type: 'validation',
        retryable: false,
      };
    }

    return {
      message: error.message,
      type: 'unknown',
      retryable: true,
    };
  }

  // String error
  if (typeof error === 'string') {
    return {
      message: error,
      type: 'unknown',
      retryable: true,
    };
  }

  // Unknown error type
  return {
    message: 'An unexpected error occurred',
    type: 'unknown',
    retryable: true,
    details: error,
  };
}

