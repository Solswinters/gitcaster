import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for using setTimeout with automatic cleanup
 * Handles component unmounting and callback updates properly
 *
 * @example
 * const [showMessage, setShowMessage] = useState(false);
 *
 * const handleClick = () => {
 *   setShowMessage(true);
 *   reset();
 * };
 *
 * useTimeout(() => {
 *   setShowMessage(false);
 * }, 3000);
 */
export function useTimeout(callback: () => void, delay: number | null): {
  reset: () => void;
  clear: () => void;
} {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the timeout
  const set = useCallback(() => {
    if (delay !== null) {
      timeoutRef.current = setTimeout(() => {
        callbackRef.current();
      }, delay);
    }
  }, [delay]);

  // Clear the timeout
  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Reset the timeout
  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  // Set up timeout on mount and when delay changes
  useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);

  return { reset, clear };
}

