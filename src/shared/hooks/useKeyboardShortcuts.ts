/**
 * Keyboard Shortcuts Hook - Global keyboard shortcut management
 * UX FEATURE: Improve navigation and accessibility with keyboard shortcuts
 */

import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: (event: KeyboardEvent) => void;
  description: string;
  category?: string;
  enabled?: boolean;
  preventDefault?: boolean;
}

export interface ShortcutConfig {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
  preventDefault?: boolean;
}

export const useKeyboardShortcuts = (config: ShortcutConfig) => {
  const shortcutsRef = useRef<KeyboardShortcut[]>([]);

  useEffect(() => {
    shortcutsRef.current = config.shortcuts;
  }, [config.shortcuts]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (config.enabled === false) return;

      for (const shortcut of shortcutsRef.current) {
        if (shortcut.enabled === false) continue;

        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatches = shortcut.alt ? event.altKey : !event.altKey;
        const metaMatches = shortcut.meta ? event.metaKey : !event.metaKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches) {
          if (shortcut.preventDefault !== false || config.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.handler(event);
          break;
        }
      }
    },
    [config.enabled, config.preventDefault]
  );

  useEffect(() => {
    if (config.enabled === false) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [config.enabled, handleKeyDown]);

  return {
    shortcuts: config.shortcuts,
  };
};

/**
 * Default shortcuts for GitCaster
 */
export const defaultShortcuts: KeyboardShortcut[] = [
  // Navigation
  {
    key: 'g',
    shift: true,
    handler: () => window.location.href = '/',
    description: 'Go to home',
    category: 'Navigation',
  },
  {
    key: 'p',
    shift: true,
    handler: () => window.location.href = '/profile',
    description: 'Go to profile',
    category: 'Navigation',
  },
  {
    key: 'd',
    shift: true,
    handler: () => window.location.href = '/dashboard',
    description: 'Go to dashboard',
    category: 'Navigation',
  },
  {
    key: 's',
    shift: true,
    handler: () => window.location.href = '/search',
    description: 'Go to search',
    category: 'Navigation',
  },

  // Search
  {
    key: '/',
    ctrl: true,
    handler: () => {
      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
      searchInput?.focus();
    },
    description: 'Focus search',
    category: 'Search',
  },

  // Actions
  {
    key: 'n',
    ctrl: true,
    handler: () => {
      // Trigger new item creation
      const event = new CustomEvent('keyboard:new');
      window.dispatchEvent(event);
    },
    description: 'Create new',
    category: 'Actions',
  },
  {
    key: 's',
    ctrl: true,
    handler: () => {
      // Trigger save
      const event = new CustomEvent('keyboard:save');
      window.dispatchEvent(event);
    },
    description: 'Save',
    category: 'Actions',
  },
  {
    key: 'e',
    ctrl: true,
    handler: () => {
      // Trigger edit
      const event = new CustomEvent('keyboard:edit');
      window.dispatchEvent(event);
    },
    description: 'Edit',
    category: 'Actions',
  },

  // UI
  {
    key: 't',
    ctrl: true,
    shift: true,
    handler: () => {
      // Toggle theme
      const event = new CustomEvent('keyboard:toggleTheme');
      window.dispatchEvent(event);
    },
    description: 'Toggle theme',
    category: 'UI',
  },
  {
    key: '?',
    shift: true,
    handler: () => {
      // Show keyboard shortcuts help
      const event = new CustomEvent('keyboard:showHelp');
      window.dispatchEvent(event);
    },
    description: 'Show shortcuts help',
    category: 'UI',
  },
  {
    key: 'Escape',
    handler: () => {
      // Close modal/dialog
      const event = new CustomEvent('keyboard:escape');
      window.dispatchEvent(event);
    },
    description: 'Close modal/dialog',
    category: 'UI',
  },

  // Accessibility
  {
    key: 'Tab',
    handler: (e) => {
      // Let default Tab behavior work
      e.stopPropagation();
    },
    description: 'Navigate focusable elements',
    category: 'Accessibility',
    preventDefault: false,
  },
];

export default useKeyboardShortcuts;

