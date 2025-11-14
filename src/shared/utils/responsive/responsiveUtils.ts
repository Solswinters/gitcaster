/**
 * Responsive Utilities
 *
 * Utilities for responsive design and breakpoints
 *
 * @module shared/utils/responsive/responsiveUtils
 */

export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Check if viewport matches breakpoint
 */
export function matchesBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints[breakpoint];
}

/**
 * Get current breakpoint
 */
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'xs';

  const width = window.innerWidth;
  const entries = Object.entries(breakpoints) as [Breakpoint, number][];
  
  for (let i = entries.length - 1; i >= 0; i--) {
    const [name, minWidth] = entries[i];
    if (width >= minWidth) {
      return name;
    }
  }
  
  return 'xs';
}

/**
 * Check if mobile device
 */
export function isMobileBreakpoint(): boolean {
  return !matchesBreakpoint('md');
}

/**
 * Check if tablet device
 */
export function isTabletBreakpoint(): boolean {
  return matchesBreakpoint('md') && !matchesBreakpoint('lg');
}

/**
 * Check if desktop device
 */
export function isDesktopBreakpoint(): boolean {
  return matchesBreakpoint('lg');
}

/**
 * Create media query string
 */
export function createMediaQuery(breakpoint: Breakpoint, type: 'min' | 'max' = 'min'): string {
  const width = breakpoints[breakpoint];
  return `(${type}-width: ${width}px)`;
}

/**
 * Check media query match
 */
export function matchMedia(query: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
}

