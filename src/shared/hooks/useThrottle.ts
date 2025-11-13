/**
 * useThrottle Hook
 *
 * Throttle a value, ensuring it updates at most once per specified delay
 *
 * @module shared/hooks/useThrottle
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Throttle a value
 *
 * @param value - Value to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled value
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const throttledSearch = useThrottle(searchTerm, 500);
 *
 * useEffect(() => {
 *   // This will run at most once per 500ms
 *   performSearch(throttledSearch);
 * }, [throttledSearch]);
 * ```
 */
export function useThrottle<T>(value: T, delay: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      const now = Date.now();
      if (now >= lastRan.current + delay) {
        setThrottledValue(value);
        lastRan.current = now;
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
}

