/**
 * Theme hook for managing theme state
 */

import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../types';
import { ThemeService } from '../services';

export function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>('system');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved preference
    const preference = ThemeService.loadUserPreference();
    
    if (preference) {
      setMode(preference.mode);
      const savedTheme = ThemeService.getTheme(preference.themeId);
      if (savedTheme) {
        setTheme(savedTheme);
        ThemeService.applyTheme(savedTheme);
      }
    }

    setLoading(false);
  }, []);

  const changeTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    ThemeService.applyTheme(newTheme);
    
    if (newTheme.id) {
      ThemeService.saveUserPreference({
        userId: 'current-user', // TODO: Get from auth context
        themeId: newTheme.id,
        mode,
      });
    }
  }, [mode]);

  const changeMode = useCallback((newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    
    if (theme) {
      ThemeService.saveUserPreference({
        userId: 'current-user', // TODO: Get from auth context
        themeId: theme.id,
        mode: newMode,
      });
    }

    // Apply system preference if mode is 'system'
    if (newMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      document.documentElement.classList.toggle('dark', newMode === 'dark');
    }
  }, [theme]);

  return {
    theme,
    mode,
    loading,
    changeTheme,
    changeMode,
  };
}

