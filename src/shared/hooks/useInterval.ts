import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for using setInterval with automatic cleanup
 * Handles component unmounting and callback updates properly
 *
 * @example
 * const [count, setCount] = useState(0);
 *
 * useInterval(() => {
 *   setCount(count + 1);
 * }, 1000);
 */
export function useInterval(
  callback: () => void,
  delay: number | null,
): {
  reset: () => void;
  clear: () => void;
  start: () => void;
} {
  const callbackRef = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the interval
  const start = useCallback(() => {
    if (delay !== null) {
      intervalRef.current = setInterval(() => {
        callbackRef.current();
      }, delay);
    }
  }, [delay]);

  // Clear the interval
  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Reset the interval
  const reset = useCallback(() => {
    clear();
    start();
  }, [clear, start]);

  // Set up interval on mount and when delay changes
  useEffect(() => {
    if (delay !== null) {
      start();
      return clear;
    }
  }, [delay, start, clear]);

  return { reset, clear, start };
}
