/**
 * Theme Customizer - Advanced theme customization utilities
 */

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  error: string
  warning: string
  success: string
  info: string
}

export interface ThemeTypography {
  fontFamily: string
  fontFamilyCode: string
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
  }
  fontWeight: {
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
  }
  lineHeight: {
    tight: number
    normal: number
    relaxed: number
  }
}

export interface ThemeSpacing {
  unit: number
  scale: number[]
}

export interface ThemeBorderRadius {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  full: string
}

export interface ThemeShadows {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  inner: string
  none: string
}

export interface ThemeAnimations {
  duration: {
    fast: string
    normal: string
    slow: string
  }
  easing: {
    linear: string
    easeIn: string
    easeOut: string
    easeInOut: string
  }
}

export interface CustomTheme {
  id: string
  name: string
  description?: string
  colors: ThemeColors
  typography: ThemeTypography
  spacing: ThemeSpacing
  borderRadius: ThemeBorderRadius
  shadows: ThemeShadows
  animations: ThemeAnimations
  custom?: Record<string, any>
}

export interface ThemePreset {
  id: string
  name: string
  theme: Partial<CustomTheme>
}

export class ThemeCustomizer {
  private currentTheme: CustomTheme
  private readonly storageKey = 'user-custom-theme'

  constructor(baseTheme?: CustomTheme) {
    this.currentTheme = baseTheme || this.getDefaultTheme()
    this.loadFromStorage()
  }

  /**
   * Get default theme configuration
   */
  private getDefaultTheme(): CustomTheme {
    return {
      id: 'default',
      name: 'Default',
      description: 'Default GitCaster theme',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f9fafb',
        text: '#111827',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        error: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        info: '#3b82f6',
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontFamilyCode: 'Fira Code, Consolas, monospace',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
        },
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
        lineHeight: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75,
        },
      },
      spacing: {
        unit: 4,
        scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        none: 'none',
      },
      animations: {
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms',
        },
        easing: {
          linear: 'linear',
          easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
          easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
          easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    }
  }

  /**
   * Get current theme
   */
  getTheme(): CustomTheme {
    return { ...this.currentTheme }
  }

  /**
   * Update theme colors
   */
  updateColors(colors: Partial<ThemeColors>): void {
    this.currentTheme.colors = {
      ...this.currentTheme.colors,
      ...colors,
    }
    this.applyTheme()
    this.saveToStorage()
  }

  /**
   * Update typography
   */
  updateTypography(typography: Partial<ThemeTypography>): void {
    this.currentTheme.typography = {
      ...this.currentTheme.typography,
      ...typography,
      fontSize: { ...this.currentTheme.typography.fontSize, ...typography.fontSize },
      fontWeight: { ...this.currentTheme.typography.fontWeight, ...typography.fontWeight },
      lineHeight: { ...this.currentTheme.typography.lineHeight, ...typography.lineHeight },
    }
    this.applyTheme()
    this.saveToStorage()
  }

  /**
   * Update spacing
   */
  updateSpacing(spacing: Partial<ThemeSpacing>): void {
    this.currentTheme.spacing = {
      ...this.currentTheme.spacing,
      ...spacing,
    }
    this.applyTheme()
    this.saveToStorage()
  }

  /**
   * Update border radius
   */
  updateBorderRadius(borderRadius: Partial<ThemeBorderRadius>): void {
    this.currentTheme.borderRadius = {
      ...this.currentTheme.borderRadius,
      ...borderRadius,
    }
    this.applyTheme()
    this.saveToStorage()
  }

  /**
   * Update shadows
   */
  updateShadows(shadows: Partial<ThemeShadows>): void {
    this.currentTheme.shadows = {
      ...this.currentTheme.shadows,
      ...shadows,
    }
    this.applyTheme()
    this.saveToStorage()
  }

  /**
   * Update animations
   */
  updateAnimations(animations: Partial<ThemeAnimations>): void {
    this.currentTheme.animations = {
      ...this.currentTheme.animations,
      ...animations,
      duration: { ...this.currentTheme.animations.duration, ...animations.duration },
      easing: { ...this.currentTheme.animations.easing, ...animations.easing },
    }
    this.applyTheme()
    this.saveToStorage()
  }

  /**
   * Apply theme to DOM
   */
  private applyTheme(): void {
    if (typeof document === 'undefined') return

    const root = document.documentElement

    // Apply colors
    Object.entries(this.currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${this.kebabCase(key)}`, value)
    })

    // Apply typography
    root.style.setProperty('--font-family', this.currentTheme.typography.fontFamily)
    root.style.setProperty('--font-family-code', this.currentTheme.typography.fontFamilyCode)

    Object.entries(this.currentTheme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value)
    })

    Object.entries(this.currentTheme.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value.toString())
    })

    Object.entries(this.currentTheme.typography.lineHeight).forEach(([key, value]) => {
      root.style.setProperty(`--line-height-${key}`, value.toString())
    })

    // Apply spacing
    root.style.setProperty('--spacing-unit', `${this.currentTheme.spacing.unit}px`)
    this.currentTheme.spacing.scale.forEach((value, index) => {
      root.style.setProperty(`--spacing-${index}`, `${value}px`)
    })

    // Apply border radius
    Object.entries(this.currentTheme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value)
    })

    // Apply shadows
    Object.entries(this.currentTheme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value)
    })

    // Apply animations
    Object.entries(this.currentTheme.animations.duration).forEach(([key, value]) => {
      root.style.setProperty(`--duration-${key}`, value)
    })

    Object.entries(this.currentTheme.animations.easing).forEach(([key, value]) => {
      root.style.setProperty(`--easing-${key}`, value)
    })
  }

  /**
   * Reset theme to default
   */
  reset(): void {
    this.currentTheme = this.getDefaultTheme()
    this.applyTheme()
    this.clearStorage()
  }

  /**
   * Load theme from preset
   */
  loadPreset(preset: ThemePreset): void {
    this.currentTheme = {
      ...this.currentTheme,
      ...preset.theme,
      id: preset.id,
      name: preset.name,
    } as CustomTheme
    this.applyTheme()
    this.saveToStorage()
  }

  /**
   * Export theme as JSON
   */
  exportTheme(): string {
    return JSON.stringify(this.currentTheme, null, 2)
  }

  /**
   * Import theme from JSON
   */
  importTheme(json: string): boolean {
    try {
      const theme = JSON.parse(json) as CustomTheme
      this.validateTheme(theme)
      this.currentTheme = theme
      this.applyTheme()
      this.saveToStorage()
      return true
    } catch (error) {
      console.error('Failed to import theme:', error)
      return false
    }
  }

  /**
   * Validate theme structure
   */
  private validateTheme(theme: any): void {
    if (!theme.colors || !theme.typography || !theme.spacing) {
      throw new Error('Invalid theme structure')
    }
  }

  /**
   * Generate color palette from base color
   */
  generatePalette(baseColor: string): Record<string, string> {
    // Simple palette generation (could be enhanced with color theory)
    return {
      50: this.lighten(baseColor, 0.95),
      100: this.lighten(baseColor, 0.9),
      200: this.lighten(baseColor, 0.75),
      300: this.lighten(baseColor, 0.6),
      400: this.lighten(baseColor, 0.4),
      500: baseColor,
      600: this.darken(baseColor, 0.2),
      700: this.darken(baseColor, 0.4),
      800: this.darken(baseColor, 0.6),
      900: this.darken(baseColor, 0.8),
    }
  }

  /**
   * Lighten color
   */
  private lighten(color: string, amount: number): string {
    // Simple implementation - could be enhanced
    return color
  }

  /**
   * Darken color
   */
  private darken(color: string, amount: number): string {
    // Simple implementation - could be enhanced
    return color
  }

  /**
   * Convert camelCase to kebab-case
   */
  private kebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  }

  /**
   * Save theme to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.currentTheme))
    } catch (error) {
      console.error('Failed to save theme to storage:', error)
    }
  }

  /**
   * Load theme from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const theme = JSON.parse(stored) as CustomTheme
        this.currentTheme = theme
        this.applyTheme()
      }
    } catch (error) {
      console.error('Failed to load theme from storage:', error)
    }
  }

  /**
   * Clear theme from localStorage
   */
  private clearStorage(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(this.storageKey)
    } catch (error) {
      console.error('Failed to clear theme storage:', error)
    }
  }

  /**
   * Get theme presets
   */
  static getPresets(): ThemePreset[] {
    return [
      {
        id: 'ocean',
        name: 'Ocean',
        theme: {
          colors: {
            primary: '#0891b2',
            secondary: '#06b6d4',
            accent: '#14b8a6',
          } as ThemeColors,
        },
      },
      {
        id: 'sunset',
        name: 'Sunset',
        theme: {
          colors: {
            primary: '#f97316',
            secondary: '#fb923c',
            accent: '#fbbf24',
          } as ThemeColors,
        },
      },
      {
        id: 'forest',
        name: 'Forest',
        theme: {
          colors: {
            primary: '#16a34a',
            secondary: '#22c55e',
            accent: '#84cc16',
          } as ThemeColors,
        },
      },
      {
        id: 'midnight',
        name: 'Midnight',
        theme: {
          colors: {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            accent: '#a855f7',
          } as ThemeColors,
        },
      },
    ]
  }
}

export default ThemeCustomizer

