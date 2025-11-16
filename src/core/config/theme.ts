/**
 * Theme configuration
 */

export const themeConfig = {
  defaultThemeId: process.env.NEXT_PUBLIC_DEFAULT_THEME_ID || 'default',
  enableCustomThemes: process.env.ENABLE_CUSTOM_THEMES !== 'false',
  maxCustomThemes: parseInt(process.env.MAX_CUSTOM_THEMES || '10'),
  enableSystemMode: process.env.ENABLE_SYSTEM_MODE !== 'false',
  transitionDuration: parseInt(process.env.THEME_TRANSITION_DURATION || '300'),
} as const;

