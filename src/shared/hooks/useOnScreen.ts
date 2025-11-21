import { useState, useEffect, useRef, RefObject } from 'react';

export interface UseOnScreenOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

/**
 * Custom hook to detect if an element is visible on screen
 * Uses Intersection Observer API
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const isVisible = useOnScreen(ref);
 *
 * @param ref - React ref to the element to observe
 * @param options - Intersection Observer options
 * @returns boolean indicating if element is visible
 */
export function useOnScreen<T extends Element>(
  ref: RefObject<T>,
  options: UseOnScreenOptions = {},
): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      {
        threshold: options.threshold || 0,
        rootMargin: options.rootMargin || '0px',
        root: options.root || null,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options.threshold, options.rootMargin, options.root]);

  return isIntersecting;
}

/**
 * Hook that returns a ref and visibility status
 */
export function useIntersectionObserver<T extends Element>(
  options: UseOnScreenOptions = {},
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const isVisible = useOnScreen(ref, options);

  return [ref, isVisible];
}

/**
 * Hook that triggers a callback when element becomes visible
 */
export function useOnScreenCallback<T extends Element>(
  callback: () => void,
  options: UseOnScreenOptions = {},
): RefObject<T> {
  const ref = useRef<T>(null);
  const hasTriggered = useRef(false);
  const isVisible = useOnScreen(ref, options);

  useEffect(() => {
    if (isVisible && !hasTriggered.current) {
      hasTriggered.current = true;
      callback();
    }
  }, [isVisible, callback]);

  return ref;
}
