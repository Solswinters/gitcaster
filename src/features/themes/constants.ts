/**
 * Theme feature constants
 */

export const DEFAULT_THEME_ID = 'default';

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const STORAGE_KEYS = {
  THEME_PREFERENCE: 'theme-preference',
  CUSTOM_THEMES: 'custom-themes',
} as const;

export const CSS_VARIABLES = {
  COLOR_PRIMARY: '--color-primary',
  COLOR_BACKGROUND: '--color-background',
  COLOR_FOREGROUND: '--color-foreground',
  FONT_SANS: '--font-sans',
  FONT_SERIF: '--font-serif',
  FONT_MONO: '--font-mono',
} as const;

