import { useState, useCallback } from 'react';

/**
 * Custom hook for managing boolean state with toggle functionality
 *
 * @example
 * const [isOpen, toggle, setIsOpen] = useToggle(false);
 *
 * @param initialValue - Initial boolean value (default: false)
 * @returns Tuple of [value, toggle function, setValue function]
 */
export function useToggle(initialValue: boolean = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}

/**
 * Hook for managing multiple toggles
 */
export function useToggles<K extends string>(
  initialValues: Record<K, boolean>,
): [Record<K, boolean>, (key: K) => void, (key: K, value: boolean) => void] {
  const [values, setValues] = useState<Record<K, boolean>>(initialValues);

  const toggle = useCallback((key: K) => {
    setValues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const setValue = useCallback((key: K, value: boolean) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  return [values, toggle, setValue];
}
