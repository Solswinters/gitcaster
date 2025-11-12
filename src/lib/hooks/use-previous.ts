import { useEffect, useRef } from 'react';

/**
 * Hook to get previous value of a variable
 * @param value - Current value
 * @returns Previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

