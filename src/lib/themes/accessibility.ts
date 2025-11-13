/**
 * Theme accessibility checker
 * Validates themes against WCAG accessibility guidelines
 */

export interface AccessibilityIssue {
  type: 'error' | 'warning'
  message: string
  suggestion: string
}

/**
 * Check theme for accessibility issues
 */
export function checkThemeAccessibility(theme: {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
}): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []

  // Check contrast ratio for text on background
  const textContrast = getContrastRatio(theme.textColor, theme.backgroundColor)
  if (textContrast < 4.5) {
    issues.push({
      type: 'error',
      message: `Text color has insufficient contrast (${textContrast.toFixed(2)}:1)`,
      suggestion: 'Increase contrast to at least 4.5:1 for normal text (WCAG AA)',
    })
  } else if (textContrast < 7) {
    issues.push({
      type: 'warning',
      message: `Text color contrast could be improved (${textContrast.toFixed(2)}:1)`,
      suggestion: 'Aim for 7:1 contrast for better readability (WCAG AAA)',
    })
  }

  // Check primary color on background
  const primaryContrast = getContrastRatio(theme.primaryColor, theme.backgroundColor)
  if (primaryContrast < 3) {
    issues.push({
      type: 'warning',
      message: `Primary color has low contrast with background (${primaryContrast.toFixed(2)}:1)`,
      suggestion: 'Ensure interactive elements have at least 3:1 contrast',
    })
  }

  // Check if colors are distinguishable for color blindness
  if (areSimilarColors(theme.primaryColor, theme.accentColor)) {
    issues.push({
      type: 'warning',
      message: 'Primary and accent colors may be hard to distinguish',
      suggestion: 'Choose more distinct colors to improve accessibility for color blind users',
    })
  }

  return issues
}

/**
 * Calculate contrast ratio between two colors
 * @returns ratio from 1 to 21
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1)
  const lum2 = getRelativeLuminance(color2)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Get relative luminance of a color
 */
function getRelativeLuminance(color: string): number {
  const rgb = hexToRgb(color)
  if (!rgb) return 0

  const [r, g, b] = rgb.map((val) => {
    const sRGB = val / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null
}

/**
 * Check if two colors are similar (may be confused by color blind users)
 */
function areSimilarColors(color1: string, color2: string): boolean {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return false

  // Calculate Euclidean distance in RGB space
  const distance = Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  )

  // If distance is less than threshold, colors are too similar
  return distance < 100
}

/**
 * Suggest accessible color adjustments
 */
export function suggestAccessibleColor(
  color: string,
  backgroundColor: string,
  targetContrast: number = 4.5
): string {
  const currentContrast = getContrastRatio(color, backgroundColor)
  
  if (currentContrast >= targetContrast) {
    return color
  }

  const rgb = hexToRgb(color)
  if (!rgb) return color

  // Try darkening or lightening the color
  const bgLum = getRelativeLuminance(backgroundColor)
  const shouldDarken = bgLum > 0.5

  for (let i = 0; i < 100; i++) {
    const factor = shouldDarken ? 1 - (i / 100) : 1 + (i / 100)
    const adjusted = rgb.map(val => Math.max(0, Math.min(255, Math.round(val * factor))))
    const adjustedHex = rgbToHex(adjusted[0], adjusted[1], adjusted[2])
    
    if (getContrastRatio(adjustedHex, backgroundColor) >= targetContrast) {
      return adjustedHex
    }
  }

  return color
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * Get accessibility rating
 */
export function getAccessibilityRating(issues: AccessibilityIssue[]): {
  rating: 'excellent' | 'good' | 'fair' | 'poor'
  score: number
  label: string
} {
  const errorCount = issues.filter(i => i.type === 'error').length
  const warningCount = issues.filter(i => i.type === 'warning').length

  if (errorCount === 0 && warningCount === 0) {
    return { rating: 'excellent', score: 100, label: 'Excellent - WCAG AAA' }
  } else if (errorCount === 0 && warningCount <= 1) {
    return { rating: 'good', score: 85, label: 'Good - WCAG AA' }
  } else if (errorCount <= 1) {
    return { rating: 'fair', score: 60, label: 'Fair - Needs improvement' }
  } else {
    return { rating: 'poor', score: 30, label: 'Poor - Major issues' }
  }
}

