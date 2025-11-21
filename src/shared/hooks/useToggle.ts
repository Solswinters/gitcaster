import { useState, useCallback } from 'react';

export interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
  setValue: (value: boolean) => void;
}

/**
 * Custom hook for managing boolean state with toggle functionality
 * Provides convenient methods to toggle, set true, set false
 *
 * @example
 * const { value, toggle, setTrue, setFalse } = useToggle(false);
 *
 * <button onClick={toggle}>Toggle</button>
 * <button onClick={setTrue}>Show</button>
 * <button onClick={setFalse}>Hide</button>
 */
export function useToggle(initialValue: boolean = false): UseToggleReturn {
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

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue,
  };
}
