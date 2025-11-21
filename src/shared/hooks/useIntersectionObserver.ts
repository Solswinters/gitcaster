import { useEffect, useRef, useState } from 'react';

export interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export interface UseIntersectionObserverResult {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

/**
 * Custom hook for using Intersection Observer API
 * Useful for lazy loading, infinite scroll, and animations on scroll
 *
 * @example
 * const { isIntersecting, entry } = useIntersectionObserver(elementRef, {
 *   threshold: 0.5,
 *   freezeOnceVisible: true,
 * });
 */
export function useIntersectionObserver<T extends Element = Element>(
  elementRef: React.RefObject<T>,
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverResult {
  const { threshold = 0, root = null, rootMargin = '0px', freezeOnceVisible = false } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const frozenRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;

    // Don't do anything if element doesn't exist or we've already frozen
    if (!element || (freezeOnceVisible && frozenRef.current)) {
      return;
    }

    const observerCallback: IntersectionObserverCallback = ([entry]) => {
      setEntry(entry);
      setIsIntersecting(entry.isIntersecting);

      // If freezeOnceVisible is true and element is visible, freeze the state
      if (freezeOnceVisible && entry.isIntersecting) {
        frozenRef.current = true;
      }
    };

    const observerOptions: IntersectionObserverInit = {
      threshold,
      root,
      rootMargin,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible]);

  return { isIntersecting, entry };
}

