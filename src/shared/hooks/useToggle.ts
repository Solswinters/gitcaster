import { useState, useCallback } from 'react';

/**
 * Custom hook for toggling boolean state
 * 
 * Provides convenient methods for toggling state
 * 
 * @example
 * ```tsx
 * const [isOpen, toggle, setOpen, setClosed] = useToggle(false);
 * 
 * return (
 *   <div>
 *     <button onClick={toggle}>Toggle</button>
 *     <button onClick={setOpen}>Open</button>
 *     <button onClick={setClosed}>Close</button>
 *   </div>
 * );
 * ```
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
}

