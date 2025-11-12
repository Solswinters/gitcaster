import { useState, useCallback } from 'react';
import { retryWithBackoff, RetryOptions } from '@/lib/utils/error-recovery';

/**
 * Hook for managing retry logic with error state
 */
export function useErrorRetry<T extends any[], R>(
  asyncFn: (...args: T) => Promise<R>,
  options?: RetryOptions
) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<unknown>(null);

  const executeWithRetry = useCallback(async (...args: T): Promise<R | undefined> => {
    setIsRetrying(true);
    setError(null);

    try {
      const result = await retryWithBackoff(
        () => asyncFn(...args),
        {
          ...options,
          onRetry: (attempt, err) => {
            setRetryCount(attempt);
            options?.onRetry?.(attempt, err);
          },
        }
      );
      setRetryCount(0);
      return result;
    } catch (err) {
      setError(err);
      return undefined;
    } finally {
      setIsRetrying(false);
    }
  }, [asyncFn, options]);

  const reset = useCallback(() => {
    setError(null);
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    executeWithRetry,
    isRetrying,
    retryCount,
    error,
    reset,
  };
}

