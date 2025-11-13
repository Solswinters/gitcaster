import { useEffect, useCallback } from 'react'

interface ShortcutConfig {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  description: string
  action: () => void
  preventDefault?: boolean
}

/**
 * Hook for managing keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrlKey === undefined || shortcut.ctrlKey === event.ctrlKey
        const metaMatch = shortcut.metaKey === undefined || shortcut.metaKey === event.metaKey
        const shiftMatch = shortcut.shiftKey === undefined || shortcut.shiftKey === event.shiftKey
        const altMatch = shortcut.altKey === undefined || shortcut.altKey === event.altKey

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault()
          }
          shortcut.action()
          break
        }
      }
    },
    [shortcuts]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return shortcuts
}

/**
 * Hook for search-specific keyboard shortcuts
 */
export function useSearchKeyboardShortcuts(callbacks: {
  onFocusSearch?: () => void
  onClearSearch?: () => void
  onToggleFilters?: () => void
  onNextPage?: () => void
  onPrevPage?: () => void
  onEscape?: () => void
}) {
  const shortcuts: ShortcutConfig[] = [
    {
      key: '/',
      description: 'Focus search',
      action: () => callbacks.onFocusSearch?.(),
    },
    {
      key: 'Escape',
      description: 'Clear search / Close',
      action: () => callbacks.onEscape?.(),
      preventDefault: false,
    },
    {
      key: 'f',
      ctrlKey: true,
      description: 'Toggle filters',
      action: () => callbacks.onToggleFilters?.(),
    },
    {
      key: 'k',
      ctrlKey: true,
      description: 'Focus search',
      action: () => callbacks.onFocusSearch?.(),
    },
    {
      key: 'k',
      metaKey: true,
      description: 'Focus search (Mac)',
      action: () => callbacks.onFocusSearch?.(),
    },
    {
      key: 'ArrowLeft',
      altKey: true,
      description: 'Previous page',
      action: () => callbacks.onPrevPage?.(),
    },
    {
      key: 'ArrowRight',
      altKey: true,
      description: 'Next page',
      action: () => callbacks.onNextPage?.(),
    },
  ]

  return useKeyboardShortcuts(shortcuts)
}

/**
 * Component to display keyboard shortcuts help
 */
export function KeyboardShortcutsHelp({ shortcuts }: { shortcuts: ShortcutConfig[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-semibold mb-3">Keyboard Shortcuts</h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">{shortcut.description}</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-mono text-xs">
              {shortcut.ctrlKey && 'Ctrl + '}
              {shortcut.metaKey && 'Cmd + '}
              {shortcut.shiftKey && 'Shift + '}
              {shortcut.altKey && 'Alt + '}
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  )
}

