import { useState, useEffect } from 'react';

/**
 * Hook to show timeout message if loading takes too long
 */
export function useLoadingTimeout(
  isLoading: boolean,
  timeoutMs: number = 10000
): boolean {
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasTimedOut(false);
      return;
    }

    const timer = setTimeout(() => {
      setHasTimedOut(true);
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [isLoading, timeoutMs]);

  return hasTimedOut;
}

