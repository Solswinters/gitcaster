import { useState, useEffect, useRef } from 'react';

export interface ScrollPosition {
  x: number;
  y: number;
}

export interface UseScrollPositionOptions {
  element?: React.RefObject<HTMLElement>;
  throttle?: number;
}

/**
 * Custom hook for tracking scroll position
 * Can track window scroll or specific element scroll
 *
 * @example
 * const { x, y } = useScrollPosition();
 * const isScrolled = y > 100;
 *
 * @example
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { x, y } = useScrollPosition({ element: containerRef });
 */
export function useScrollPosition(options: UseScrollPositionOptions = {}): ScrollPosition {
  const { element, throttle = 100 } = options;

  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ x: 0, y: 0 });
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const targetElement = element?.current || (typeof window !== 'undefined' ? window : null);

    if (!targetElement) {
      return;
    }

    const handleScroll = () => {
      // Throttle scroll events
      if (throttleTimeout.current) {
        return;
      }

      throttleTimeout.current = setTimeout(() => {
        if (element?.current) {
          setScrollPosition({
            x: element.current.scrollLeft,
            y: element.current.scrollTop,
          });
        } else if (typeof window !== 'undefined') {
          setScrollPosition({
            x: window.pageXOffset || window.scrollX,
            y: window.pageYOffset || window.scrollY,
          });
        }

        throttleTimeout.current = null;
      }, throttle);
    };

    // Set initial scroll position
    handleScroll();

    // Add scroll event listener
    targetElement.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      targetElement.removeEventListener('scroll', handleScroll);
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, [element, throttle]);

  return scrollPosition;
}

