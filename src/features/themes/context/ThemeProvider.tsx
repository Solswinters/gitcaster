/**
 * Theme context provider
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '../hooks';
import type { Theme } from '../types';

interface ThemeContextValue {
  theme: Theme | null;
  mode: 'light' | 'dark' | 'system';
  loading: boolean;
  changeTheme: (theme: Theme) => void;
  changeMode: (mode: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeState = useTheme();

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
}

