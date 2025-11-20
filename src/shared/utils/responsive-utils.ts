/**
 * Responsive Utilities - Helper functions for responsive design
 */

export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints

export interface ResponsiveValue<T> {
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  '2xl'?: T
}

/**
 * Get current breakpoint based on window width
 */
export const getCurrentBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') {
    return 'md'
  }

  const width = window.innerWidth

  if (width >= breakpoints['2xl']) return '2xl'
  if (width >= breakpoints.xl) return 'xl'
  if (width >= breakpoints.lg) return 'lg'
  if (width >= breakpoints.md) return 'md'
  if (width >= breakpoints.sm) return 'sm'
  return 'xs'
}

/**
 * Check if screen is at or above a breakpoint
 */
export const isBreakpointUp = (breakpoint: Breakpoint): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.innerWidth >= breakpoints[breakpoint]
}

/**
 * Check if screen is below a breakpoint
 */
export const isBreakpointDown = (breakpoint: Breakpoint): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.innerWidth < breakpoints[breakpoint]
}

/**
 * Check if screen is between two breakpoints
 */
export const isBreakpointBetween = (
  minBreakpoint: Breakpoint,
  maxBreakpoint: Breakpoint
): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  const width = window.innerWidth
  return width >= breakpoints[minBreakpoint] && width < breakpoints[maxBreakpoint]
}

/**
 * Get responsive value based on current breakpoint
 */
export const getResponsiveValue = <T>(responsiveValue: ResponsiveValue<T>, fallback: T): T => {
  const currentBreakpoint = getCurrentBreakpoint()

  // Priority order: current -> smaller -> fallback
  const breakpointOrder: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs']
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint)

  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i]
    if (responsiveValue[bp] !== undefined) {
      return responsiveValue[bp]!
    }
  }

  return fallback
}

/**
 * Get media query string for a breakpoint
 */
export const getMediaQuery = (breakpoint: Breakpoint, direction: 'up' | 'down' = 'up'): string => {
  const width = breakpoints[breakpoint]

  if (direction === 'up') {
    return `(min-width: ${width}px)`
  }

  return `(max-width: ${width - 1}px)`
}

/**
 * Check if matches media query
 */
export const matchesMediaQuery = (query: string): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia(query).matches
}

/**
 * Get responsive grid columns
 */
export const getGridColumns = (columns: ResponsiveValue<number>): number => {
  return getResponsiveValue(columns, 1)
}

/**
 * Get responsive spacing
 */
export const getSpacing = (spacing: ResponsiveValue<number | string>): number | string => {
  return getResponsiveValue(spacing, 0)
}

/**
 * Check if mobile device
 */
export const isMobile = (): boolean => {
  return isBreakpointDown('md')
}

/**
 * Check if tablet device
 */
export const isTablet = (): boolean => {
  return isBreakpointBetween('md', 'lg')
}

/**
 * Check if desktop device
 */
export const isDesktop = (): boolean => {
  return isBreakpointUp('lg')
}

/**
 * Get device type
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobile()) return 'mobile'
  if (isTablet()) return 'tablet'
  return 'desktop'
}

/**
 * Get responsive font size
 */
export const getFontSize = (
  size: ResponsiveValue<string | number>,
  fallback: string | number = '1rem'
): string | number => {
  return getResponsiveValue(size, fallback)
}

/**
 * Convert px to rem
 */
export const pxToRem = (px: number, baseSize: number = 16): string => {
  return `${px / baseSize}rem`
}

/**
 * Convert rem to px
 */
export const remToPx = (rem: number, baseSize: number = 16): number => {
  return rem * baseSize
}

/**
 * Get viewport width
 */
export const getViewportWidth = (): number => {
  if (typeof window === 'undefined') {
    return 0
  }

  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
}

/**
 * Get viewport height
 */
export const getViewportHeight = (): number => {
  if (typeof window === 'undefined') {
    return 0
  }

  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
}

/**
 * Get aspect ratio
 */
export const getAspectRatio = (): number => {
  const width = getViewportWidth()
  const height = getViewportHeight()

  return height > 0 ? width / height : 0
}

/**
 * Check if landscape orientation
 */
export const isLandscape = (): boolean => {
  return getAspectRatio() > 1
}

/**
 * Check if portrait orientation
 */
export const isPortrait = (): boolean => {
  return getAspectRatio() < 1
}

/**
 * Get orientation
 */
export const getOrientation = (): 'landscape' | 'portrait' | 'square' => {
  const ratio = getAspectRatio()

  if (ratio > 1) return 'landscape'
  if (ratio < 1) return 'portrait'
  return 'square'
}

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * Get responsive padding
 */
export const getResponsivePadding = (
  padding: ResponsiveValue<number | string>
): number | string => {
  return getResponsiveValue(padding, '1rem')
}

/**
 * Get responsive margin
 */
export const getResponsiveMargin = (
  margin: ResponsiveValue<number | string>
): number | string => {
  return getResponsiveValue(margin, '1rem')
}

/**
 * Get container max width
 */
export const getContainerMaxWidth = (): number => {
  const currentBreakpoint = getCurrentBreakpoint()

  const maxWidths: Record<Breakpoint, number> = {
    xs: 640,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  }

  return maxWidths[currentBreakpoint]
}

/**
 * Calculate fluid typography
 */
export const fluidTypography = (
  minSize: number,
  maxSize: number,
  minWidth: number = breakpoints.sm,
  maxWidth: number = breakpoints.xl
): string => {
  const slope = (maxSize - minSize) / (maxWidth - minWidth)
  const yIntercept = minSize - slope * minWidth

  return `clamp(${minSize}px, ${yIntercept}px + ${slope * 100}vw, ${maxSize}px)`
}

/**
 * Calculate fluid spacing
 */
export const fluidSpacing = (
  minSpacing: number,
  maxSpacing: number,
  minWidth: number = breakpoints.sm,
  maxWidth: number = breakpoints.xl
): string => {
  return fluidTypography(minSpacing, maxSpacing, minWidth, maxWidth)
}

/**
 * Get safe area insets (for mobile notches)
 */
export const getSafeAreaInsets = (): {
  top: number
  right: number
  bottom: number
  left: number
} => {
  if (typeof window === 'undefined' || !CSS.supports('padding-top', 'env(safe-area-inset-top)')) {
    return { top: 0, right: 0, bottom: 0, left: 0 }
  }

  const computedStyle = getComputedStyle(document.documentElement)

  return {
    top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
    right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
    bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
    left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0'),
  }
}

/**
 * Apply safe area padding
 */
export const getSafeAreaPadding = (
  side: 'top' | 'right' | 'bottom' | 'left' | 'all' = 'all'
): string => {
  if (side === 'all') {
    return 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)'
  }

  return `env(safe-area-inset-${side})`
}

export default {
  breakpoints,
  getCurrentBreakpoint,
  isBreakpointUp,
  isBreakpointDown,
  isBreakpointBetween,
  getResponsiveValue,
  getMediaQuery,
  matchesMediaQuery,
  getGridColumns,
  getSpacing,
  isMobile,
  isTablet,
  isDesktop,
  getDeviceType,
  getFontSize,
  pxToRem,
  remToPx,
  getViewportWidth,
  getViewportHeight,
  getAspectRatio,
  isLandscape,
  isPortrait,
  getOrientation,
  clamp,
  getResponsivePadding,
  getResponsiveMargin,
  getContainerMaxWidth,
  fluidTypography,
  fluidSpacing,
  getSafeAreaInsets,
  getSafeAreaPadding,
}

