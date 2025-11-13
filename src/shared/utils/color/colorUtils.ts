/**
 * Color Utilities
 *
 * Utilities for color manipulation and conversion
 *
 * @module shared/utils/color/colorUtils
 */

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Lighten color by percentage
 */
export function lighten(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.min(100, hsl.l + percent);

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Darken color by percentage
 */
export function darken(hex: string, percent: number): string {
  return lighten(hex, -percent);
}

/**
 * Get contrasting text color (black or white) for background
 */
export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Check if color is dark
 */
export function isDark(hex: string): boolean {
  return getContrastColor(hex) === '#FFFFFF';
}

/**
 * Check if color is light
 */
export function isLight(hex: string): boolean {
  return getContrastColor(hex) === '#000000';
}

/**
 * Validate hex color
 */
export function isValidHex(hex: string): boolean {
  return /^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(hex);
}

/**
 * Add alpha channel to hex color
 */
export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0, 0, 0, ${alpha})`;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Mix two colors
 */
export function mixColors(color1: string, color2: string, weight: number = 0.5): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return color1;

  const r = Math.round(rgb1.r * (1 - weight) + rgb2.r * weight);
  const g = Math.round(rgb1.g * (1 - weight) + rgb2.g * weight);
  const b = Math.round(rgb1.b * (1 - weight) + rgb2.b * weight);

  return rgbToHex(r, g, b);
}

/**
 * Generate random hex color
 */
export function randomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

/**
 * Create color palette from base color
 */
export function createPalette(
  baseColor: string,
  steps: number = 5
): string[] {
  const palette: string[] = [];
  const stepSize = 100 / (steps - 1);

  for (let i = 0; i < steps; i++) {
    const lightness = i * stepSize - 50;
    palette.push(lighten(baseColor, lightness));
  }

  return palette;
}

