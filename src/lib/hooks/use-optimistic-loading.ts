import { useState, useCallback } from 'react';

/**
 * Hook for optimistic loading states that show immediately
 * but have a minimum display time to prevent flicker
 */
export function useOptimisticLoading(minLoadingTime: number = 500) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number>(0);

  const withOptimisticLoading = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      const startTime = Date.now();
      setLoadingStartTime(startTime);
      setIsLoading(true);

      try {
        const result = await fn();
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsed);

        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }

        setIsLoading(false);
        return result;
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    [minLoadingTime]
  );

  return {
    isLoading,
    withOptimisticLoading,
  };
}

