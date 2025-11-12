import { useState, useEffect } from 'react';

/**
 * Hook that delays showing loading state to prevent flicker
 * @param isLoading - The actual loading state
 * @param delay - Delay in ms before showing loading (default 300ms)
 */
export function useDelayedLoading(isLoading: boolean, delay: number = 300): boolean {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [isLoading, delay]);

  return showLoading;
}

