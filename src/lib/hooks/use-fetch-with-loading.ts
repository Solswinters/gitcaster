import { useState, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseFetchResult<T> extends FetchState<T> {
  fetch: () => Promise<void>;
  refetch: () => Promise<void>;
  reset: () => void;
}

/**
 * Hook for fetching data with automatic loading and error states
 */
export function useFetchWithLoading<T>(
  fetchFn: () => Promise<T>
): UseFetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await fetchFn();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error });
    }
  }, [fetchFn]);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    fetch,
    refetch: fetch,
    reset,
  };
}

