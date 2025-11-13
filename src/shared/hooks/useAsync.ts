import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export interface UseAsyncReturn<T, Args extends any[]> {
  execute: (...args: Args) => Promise<void>;
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
}

/**
 * Custom hook for async operations
 * 
 * Manages loading, error, and success states for async functions
 * 
 * @example
 * ```tsx
 * const { execute, data, isLoading, error } = useAsync(fetchUser);
 * 
 * useEffect(() => {
 *   execute(userId);
 * }, [userId]);
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorDisplay message={error.message} />;
 * return <UserProfile user={data} />;
 * ```
 */
export function useAsync<T = any, Args extends any[] = any[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T, Args> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: Args) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await asyncFunction(...args);
        
        if (isMounted.current) {
          setData(result);
          options.onSuccess?.(result);
        }
      } catch (err) {
        if (isMounted.current) {
          const error = err as Error;
          setError(error);
          options.onError?.(error);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [asyncFunction, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (options.immediate) {
      execute([] as any);
    }
  }, [execute, options.immediate]);

  return {
    execute,
    data,
    error,
    isLoading,
    isSuccess: data !== null && error === null,
    isError: error !== null,
    reset,
  };
}

