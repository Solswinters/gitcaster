import { useEffect, useRef } from 'react';

/**
 * Hook for using setInterval with React
 * @param callback - Function to run at interval
 * @param delay - Delay in milliseconds (null to pause)
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

