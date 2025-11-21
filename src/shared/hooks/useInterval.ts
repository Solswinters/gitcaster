import React, { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for setting up intervals with automatic cleanup
 * Handles the common pattern of setInterval with useEffect
 *
 * @example
 * useInterval(() => {
 *   console.log('Runs every second');
 * }, 1000);
 *
 * @param callback - Function to call on each interval
 * @param delay - Delay in milliseconds (null to pause)
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (delay === null) return;

    const tick = () => {
      savedCallback.current?.();
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Hook that counts up from 0 at a specified interval
 */
export function useCounter(delay: number = 1000): number {
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount((c) => c + 1);
  }, delay);

  return count;
}

/**
 * Hook for countdown timer
 */
export function useCountdown(initialSeconds: number, onComplete?: () => void): {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
} {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(
    () => {
      setSeconds((s) => {
        if (s <= 1) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return s - 1;
      });
    },
    isRunning ? 1000 : null,
  );

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setSeconds(initialSeconds);
    setIsRunning(false);
  };

  return { seconds, isRunning, start, pause, reset };
}
