/**
 * Preset theme configurations
 */

export interface ThemeConfig {
  id: string
  name: string
  description: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  layout: 'default' | 'two-column' | 'grid' | 'minimal'
  fontFamily: string
  fontSize: 'sm' | 'base' | 'lg'
  backgroundPattern?: 'none' | 'dots' | 'grid' | 'gradient'
  customCSS?: string
}

export const PRESET_THEMES: ThemeConfig[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and corporate look for serious developers',
    primaryColor: '#1e40af',
    secondaryColor: '#475569',
    accentColor: '#0ea5e9',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    layout: 'default',
    fontFamily: 'Inter',
    fontSize: 'base',
    backgroundPattern: 'none',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant and expressive for creative developers',
    primaryColor: '#8b5cf6',
    secondaryColor: '#ec4899',
    accentColor: '#f59e0b',
    backgroundColor: '#faf5ff',
    textColor: '#1f2937',
    layout: 'grid',
    fontFamily: 'Poppins',
    fontSize: 'base',
    backgroundPattern: 'dots',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and distraction-free design',
    primaryColor: '#000000',
    secondaryColor: '#6b7280',
    accentColor: '#9ca3af',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    layout: 'minimal',
    fontFamily: 'Inter',
    fontSize: 'base',
    backgroundPattern: 'none',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Modern dark theme for night owls',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentColor: '#06b6d4',
    backgroundColor: '#0f172a',
    textColor: '#f1f5f9',
    layout: 'default',
    fontFamily: 'Inter',
    fontSize: 'base',
    backgroundPattern: 'grid',
  },
  {
    id: 'colorful',
    name: 'Colorful',
    description: 'Bold and energetic multi-color theme',
    primaryColor: '#f59e0b',
    secondaryColor: '#ef4444',
    accentColor: '#10b981',
    backgroundColor: '#fffbeb',
    textColor: '#1f2937',
    layout: 'two-column',
    fontFamily: 'Nunito',
    fontSize: 'base',
    backgroundPattern: 'gradient',
  },
]

export const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter', preview: 'The quick brown fox' },
  { value: 'Roboto', label: 'Roboto', preview: 'The quick brown fox' },
  { value: 'Poppins', label: 'Poppins', preview: 'The quick brown fox' },
  { value: 'Nunito', label: 'Nunito', preview: 'The quick brown fox' },
  { value: 'Montserrat', label: 'Montserrat', preview: 'The quick brown fox' },
  { value: 'Open Sans', label: 'Open Sans', preview: 'The quick brown fox' },
  { value: 'Lato', label: 'Lato', preview: 'The quick brown fox' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro', preview: 'The quick brown fox' },
]

export const LAYOUT_OPTIONS = [
  {
    value: 'default',
    label: 'Default',
    description: 'Single column with full-width sections',
  },
  {
    value: 'two-column',
    label: 'Two Column',
    description: 'Sidebar with main content area',
  },
  {
    value: 'grid',
    label: 'Grid',
    description: 'Card-based grid layout',
  },
  {
    value: 'minimal',
    label: 'Minimal',
    description: 'Centered content with minimal styling',
  },
]

export const BACKGROUND_PATTERNS = [
  { value: 'none', label: 'None', preview: 'Solid color' },
  { value: 'dots', label: 'Dots', preview: '• • • •' },
  { value: 'grid', label: 'Grid', preview: '# # # #' },
  { value: 'gradient', label: 'Gradient', preview: '🌈' },
]

/**
 * Generate CSS variables from theme config
 */
export function generateThemeCSS(theme: ThemeConfig): string {
  return `
    :root {
      --color-primary: ${theme.primaryColor};
      --color-secondary: ${theme.secondaryColor};
      --color-accent: ${theme.accentColor};
      --color-background: ${theme.backgroundColor};
      --color-text: ${theme.textColor};
      --font-family: ${theme.fontFamily}, system-ui, -apple-system, sans-serif;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--color-background);
      color: var(--color-text);
    }

    ${theme.backgroundPattern === 'dots' ? `
      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px);
        background-size: 20px 20px;
        pointer-events: none;
        z-index: -1;
      }
    ` : ''}

    ${theme.backgroundPattern === 'grid' ? `
      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: 
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
        background-size: 30px 30px;
        pointer-events: none;
        z-index: -1;
      }
    ` : ''}

    ${theme.backgroundPattern === 'gradient' ? `
      body {
        background: linear-gradient(135deg, ${theme.backgroundColor} 0%, ${theme.primaryColor}20 100%);
      }
    ` : ''}

    ${theme.customCSS || ''}
  `.trim()
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: ThemeConfig) {
  if (typeof document === 'undefined') return

  // Remove existing theme style
  const existingStyle = document.getElementById('profile-theme')
  if (existingStyle) {
    existingStyle.remove()
  }

  // Create and inject new theme style
  const style = document.createElement('style')
  style.id = 'profile-theme'
  style.textContent = generateThemeCSS(theme)
  document.head.appendChild(style)

  // Update font link if needed
  updateFontLink(theme.fontFamily)
}

/**
 * Update Google Fonts link
 */
function updateFontLink(fontFamily: string) {
  if (typeof document === 'undefined') return

  const fontLink = document.getElementById('profile-font')
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`

  if (fontLink) {
    fontLink.setAttribute('href', fontUrl)
  } else {
    const link = document.createElement('link')
    link.id = 'profile-font'
    link.rel = 'stylesheet'
    link.href = fontUrl
    document.head.appendChild(link)
  }
}

/**
 * Get preset theme by ID
 */
export function getPresetTheme(id: string): ThemeConfig | undefined {
  return PRESET_THEMES.find(theme => theme.id === id)
}

/**
 * Validate theme configuration
 */
export function validateTheme(theme: Partial<ThemeConfig>): string[] {
  const errors: string[] = []

  if (!theme.name || theme.name.trim().length === 0) {
    errors.push('Theme name is required')
  }

  if (theme.primaryColor && !isValidColor(theme.primaryColor)) {
    errors.push('Invalid primary color')
  }

  if (theme.customCSS && theme.customCSS.length > 10000) {
    errors.push('Custom CSS is too long (max 10000 characters)')
  }

  return errors
}

/**
 * Validate hex color
 */
function isValidColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color)
}

/**
 * Convert theme config to database format
 */
export function themeToDatabase(theme: ThemeConfig) {
  return {
    name: theme.name,
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor,
    accentColor: theme.accentColor,
    backgroundColor: theme.backgroundColor,
    textColor: theme.textColor,
    layout: theme.layout,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize,
    backgroundPattern: theme.backgroundPattern || null,
    customCSS: theme.customCSS || null,
  }
}

/**
 * Convert database theme to config format
 */
export function themeFromDatabase(dbTheme: any): ThemeConfig {
  return {
    id: dbTheme.id,
    name: dbTheme.name,
    description: '',
    primaryColor: dbTheme.primaryColor,
    secondaryColor: dbTheme.secondaryColor,
    accentColor: dbTheme.accentColor,
    backgroundColor: dbTheme.backgroundColor,
    textColor: dbTheme.textColor,
    layout: dbTheme.layout as any,
    fontFamily: dbTheme.fontFamily,
    fontSize: dbTheme.fontSize as any,
    backgroundPattern: dbTheme.backgroundPattern as any,
    customCSS: dbTheme.customCSS || undefined,
  }
}

