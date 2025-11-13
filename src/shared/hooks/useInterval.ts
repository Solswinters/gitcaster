import { useEffect, useRef } from 'react';

/**
 * Custom hook for intervals
 * 
 * Automatically cleans up intervals on unmount
 * 
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * 
 * useInterval(() => {
 *   setCount(count + 1);
 * }, 1000);
 * ```
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    // Don't schedule if no delay is specified
    if (delay === null) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

