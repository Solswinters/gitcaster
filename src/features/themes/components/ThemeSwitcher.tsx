/**
 * Theme switcher component
 */

'use client';

import { useTheme } from '../hooks';

export function ThemeSwitcher() {
  const { mode, changeMode } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeMode('light')}
        className={`px-3 py-2 rounded ${mode === 'light' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
        aria-label="Light mode"
      >
        ☀️
      </button>
      <button
        onClick={() => changeMode('dark')}
        className={`px-3 py-2 rounded ${mode === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
        aria-label="Dark mode"
      >
        🌙
      </button>
      <button
        onClick={() => changeMode('system')}
        className={`px-3 py-2 rounded ${mode === 'system' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
        aria-label="System mode"
      >
        💻
      </button>
    </div>
  );
}

