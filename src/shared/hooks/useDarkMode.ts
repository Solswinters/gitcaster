/**
 * Dark Mode Hook - Manage dark mode theme state
 * UX FEATURE: Provide seamless dark mode experience
 */

import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface UseDarkModeReturn {
  theme: Theme;
  isDark: boolean;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
  systemPreference: 'light' | 'dark';
}

export const useDarkMode = (
  initialTheme: Theme = 'system',
  storageKey: string = 'theme'
): UseDarkModeReturn => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored;
      }
    }
    return initialTheme;
  });

  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>(
    () => {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      return 'light';
    }
  );

  const isDark =
    theme === 'dark' || (theme === 'system' && systemPreference === 'dark');

  // Listen to system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    // Legacy browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    // Set color-scheme for better browser integration
    root.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  // Save theme to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, theme);
    }
  }, [theme, storageKey]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    // Emit custom event for other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('themechange', {
          detail: { theme: newTheme, isDark },
        })
      );
    }
  };

  const toggle = () => {
    if (theme === 'system') {
      // Toggle from system preference
      setTheme(systemPreference === 'dark' ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return {
    theme,
    isDark,
    toggle,
    setTheme,
    systemPreference,
  };
};

/**
 * Theme Provider Context
 */
import { createContext, useContext, ReactNode } from 'react';

interface ThemeContextValue extends UseDarkModeReturn {
  // Additional context-specific methods can be added here
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({
  children,
  initialTheme = 'system',
  storageKey = 'theme',
}: {
  children: ReactNode;
  initialTheme?: Theme;
  storageKey?: string;
}) => {
  const darkMode = useDarkMode(initialTheme, storageKey);

  return (
    <ThemeContext.Provider value={darkMode}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

/**
 * Theme Toggle Button Component
 */
export const ThemeToggleButton = ({
  className = '',
}: {
  className?: string;
}) => {
  const { isDark, toggle, theme } = useTheme();

  const getIcon = () => {
    if (theme === 'system') {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    }

    if (isDark) {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      );
    }

    return (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    );
  };

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 ${className}`}
      aria-label="Toggle theme"
      title={`Current theme: ${theme}`}
    >
      {getIcon()}
    </button>
  );
};

export default useDarkMode;

