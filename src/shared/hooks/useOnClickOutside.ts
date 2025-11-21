import { useEffect, RefObject } from 'react';

/**
 * Custom hook that triggers a callback when user clicks outside the referenced element
 * Useful for dropdowns, modals, and popover components
 *
 * @example
 * const modalRef = useRef<HTMLDivElement>(null);
 * useOnClickOutside(modalRef, () => setIsOpen(false));
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const listener = (event: MouseEvent | TouchEvent) => {
      const refs = Array.isArray(ref) ? ref : [ref];

      // Check if the click is on any of the refs
      const isOutside = refs.every((r) => {
        const element = r.current;
        // Do nothing if clicking ref's element or descendent elements
        if (!element || element.contains(event.target as Node)) {
          return false;
        }
        return true;
      });

      if (isOutside) {
        handler(event);
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}

