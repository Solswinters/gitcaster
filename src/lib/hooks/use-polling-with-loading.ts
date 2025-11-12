import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for polling with loading state management
 */
export function usePollingWithLoading<T>(
  fetchFn: () => Promise<T>,
  interval: number = 5000,
  enabled: boolean = true
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (!enabled) return;

    fetch();
    const intervalId = setInterval(fetch, interval);

    return () => clearInterval(intervalId);
  }, [fetch, interval, enabled]);

  return { data, isLoading, error, refetch: fetch };
}

