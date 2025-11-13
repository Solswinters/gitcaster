import { useEffect, useRef } from 'react';

/**
 * Custom hook to track previous value
 * 
 * Returns the previous value of a state or prop
 * 
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * 
 * return <div>Current: {count}, Previous: {prevCount}</div>;
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

