import { useEffect } from 'react';

/**
 * Hook to handle keyboard events
 * @param key - Key to listen for
 * @param callback - Callback function
 * @param options - Event options
 */
export function useKeyboard(
  key: string,
  callback: () => void,
  options?: {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
  }
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const matchesKey = event.key.toLowerCase() === key.toLowerCase();
      const matchesCtrl = options?.ctrlKey ? event.ctrlKey : true;
      const matchesShift = options?.shiftKey ? event.shiftKey : true;
      const matchesAlt = options?.altKey ? event.altKey : true;
      const matchesMeta = options?.metaKey ? event.metaKey : true;

      if (matchesKey && matchesCtrl && matchesShift && matchesAlt && matchesMeta) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [key, callback, options]);
}

