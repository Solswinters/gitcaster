/**
 * useKeyPress Hook
 *
 * Detect when a specific key is pressed
 *
 * @module shared/hooks/useKeyPress
 */

import { useState, useEffect } from 'react';

/**
 * Detect if a specific key is pressed
 *
 * @param targetKey - Key to detect (e.g., 'Enter', 'Escape')
 * @returns True if key is currently pressed
 *
 * @example
 * ```tsx
 * const enterPressed = useKeyPress('Enter');
 * const escapePressed = useKeyPress('Escape');
 *
 * useEffect(() => {
 *   if (enterPressed) {
 *     submitForm();
 *   }
 * }, [enterPressed]);
 * ```
 */
export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}

/**
 * Detect if multiple keys are pressed (combination)
 *
 * @param targetKeys - Array of keys to detect
 * @returns True if all keys are currently pressed
 *
 * @example
 * ```tsx
 * const ctrlS = useKeyCombo(['Control', 's']);
 *
 * useEffect(() => {
 *   if (ctrlS) {
 *     handleSave();
 *   }
 * }, [ctrlS]);
 * ```
 */
export function useKeyCombo(targetKeys: string[]): boolean {
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const downHandler = (event: KeyboardEvent) => {
      setKeysPressed((prev) => new Set([...prev, event.key]));
    };

    const upHandler = (event: KeyboardEvent) => {
      setKeysPressed((prev) => {
        const next = new Set(prev);
        next.delete(event.key);
        return next;
      });
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return targetKeys.every((key) => keysPressed.has(key));
}

