/**
 * useUpdateEffect Hook
 *
 * useEffect that skips the initial mount
 *
 * @module shared/hooks/useUpdateEffect
 */

import { useEffect, useRef, DependencyList, EffectCallback } from 'react';

/**
 * Run effect only on updates, not on initial mount
 *
 * @param effect - Effect function
 * @param deps - Dependency array
 *
 * @example
 * ```tsx
 * useUpdateEffect(() => {
 *   // This won't run on initial mount
 *   // Only runs when count changes after mount
 *   console.log('Count updated:', count);
 * }, [count]);
 * ```
 */
export function useUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList
): void {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      return effect();
    }
    isMounted.current = true;
  }, deps);
}

