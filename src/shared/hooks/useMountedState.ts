/**
 * useMountedState Hook
 *
 * Track whether component is currently mounted
 *
 * @module shared/hooks/useMountedState
 */

import { useCallback, useEffect, useRef } from 'react';

/**
 * Get a function that returns whether the component is mounted
 *
 * Useful for preventing state updates on unmounted components
 *
 * @returns Function that returns true if component is mounted
 *
 * @example
 * ```tsx
 * const isMounted = useMountedState();
 *
 * const fetchData = async () => {
 *   const data = await api.getData();
 *   if (isMounted()) {
 *     setState(data);
 *   }
 * };
 * ```
 */
export function useMountedState(): () => boolean {
  const mountedRef = useRef<boolean>(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useCallback(() => mountedRef.current, []);
}

