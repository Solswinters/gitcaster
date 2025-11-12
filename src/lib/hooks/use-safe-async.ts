import { useCallback, useState } from 'react';
import { ErrorLogger } from '@/lib/utils/error-logger';

/**
 * Hook to safely execute async functions with error handling
 */
export function useSafeAsync<T extends any[], R>(
  asyncFn: (...args: T) => Promise<R>,
  onError?: (error: unknown) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const execute = useCallback(async (...args: T): Promise<R | undefined> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFn(...args);
      return result;
    } catch (err) {
      setError(err);
      ErrorLogger.log(err, `useSafeAsync: ${asyncFn.name}`);
      
      if (onError) {
        onError(err);
      }
      
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFn, onError]);

  return {
    execute,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

