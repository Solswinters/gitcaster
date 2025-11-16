/**
 * Theme service for managing themes
 */

import type { Theme, UserThemePreference } from '../types';

export class ThemeService {
  private static themes = new Map<string, Theme>();

  /**
   * Get theme by ID
   */
  static getTheme(themeId: string): Theme | null {
    return this.themes.get(themeId) || null;
  }

  /**
   * Get all themes
   */
  static getAllThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Create custom theme
   */
  static createTheme(theme: Omit<Theme, 'id' | 'createdAt' | 'updatedAt'>): Theme {
    const newTheme: Theme = {
      ...theme,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.themes.set(newTheme.id, newTheme);
    return newTheme;
  }

  /**
   * Update theme
   */
  static updateTheme(themeId: string, updates: Partial<Theme>): Theme | null {
    const theme = this.themes.get(themeId);
    if (!theme) return null;

    const updatedTheme = {
      ...theme,
      ...updates,
      updatedAt: new Date(),
    };

    this.themes.set(themeId, updatedTheme);
    return updatedTheme;
  }

  /**
   * Delete theme
   */
  static deleteTheme(themeId: string): boolean {
    return this.themes.delete(themeId);
  }

  /**
   * Apply theme to CSS variables
   */
  static applyTheme(theme: Theme): void {
    const root = document.documentElement;

    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply typography
    root.style.setProperty('--font-sans', theme.typography.fontFamily.sans);
    root.style.setProperty('--font-serif', theme.typography.fontFamily.serif);
    root.style.setProperty('--font-mono', theme.typography.fontFamily.mono);

    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
  }

  /**
   * Save user preference
   */
  static saveUserPreference(preference: UserThemePreference): void {
    localStorage.setItem('theme-preference', JSON.stringify(preference));
  }

  /**
   * Load user preference
   */
  static loadUserPreference(): UserThemePreference | null {
    const stored = localStorage.getItem('theme-preference');
    return stored ? JSON.parse(stored) : null;
  }
}

