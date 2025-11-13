/**
 * useEffectOnce Hook
 *
 * useEffect that runs only once on mount
 *
 * @module shared/hooks/useEffectOnce
 */

import { useEffect, EffectCallback } from 'react';

/**
 * Run effect only once on component mount
 *
 * @param effect - Effect function
 *
 * @example
 * ```tsx
 * useEffectOnce(() => {
 *   // This runs only once when component mounts
 *   initializeApp();
 *
 *   return () => {
 *     // Cleanup
 *     cleanupApp();
 *   };
 * });
 * ```
 */
export function useEffectOnce(effect: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}

