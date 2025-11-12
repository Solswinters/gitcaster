'use client';

import { useEffect } from 'react';
import { KEYBOARD_KEYS } from '@/lib/utils/keyboard';

interface KeyboardShortcutProps {
  keys: string[];
  onTrigger: () => void;
  enabled?: boolean;
  preventDefault?: boolean;
}

/**
 * Register keyboard shortcuts for accessibility
 */
export function KeyboardShortcut({
  keys,
  onTrigger,
  enabled = true,
  preventDefault = true,
}: KeyboardShortcutProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isMatch = keys.every(key => {
        if (key === 'ctrl') return event.ctrlKey;
        if (key === 'shift') return event.shiftKey;
        if (key === 'alt') return event.altKey;
        if (key === 'meta') return event.metaKey;
        return event.key.toLowerCase() === key.toLowerCase();
      });

      if (isMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        onTrigger();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, onTrigger, enabled, preventDefault]);

  return null;
}

