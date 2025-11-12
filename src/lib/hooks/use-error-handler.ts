import { useState, useCallback } from 'react';
import { formatErrorMessage, getErrorTitle } from '@/lib/utils/error-formatter';

interface ErrorState {
  message: string;
  title: string;
  originalError: unknown;
}

/**
 * Hook to manage error state with formatting
 */
export function useErrorHandler() {
  const [error, setError] = useState<ErrorState | null>(null);

  const handleError = useCallback((err: unknown) => {
    setError({
      message: formatErrorMessage(err),
      title: getErrorTitle(err),
      originalError: err,
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    hasError: error !== null,
  };
}

