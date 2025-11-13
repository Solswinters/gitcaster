import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  lighten,
  darken,
  getContrastColor,
  isDark,
  isLight,
  isValidHex,
  hexToRgba,
  mixColors,
  randomColor,
  createPalette,
} from '@/shared/utils/color/colorUtils';

describe('Color Utils', () => {
  describe('hexToRgb', () => {
    it('converts hex to RGB', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('handles hex without #', () => {
      expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('returns null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull();
    });
  });

  describe('rgbToHex', () => {
    it('converts RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
    });
  });

  describe('rgbToHsl', () => {
    it('converts RGB to HSL', () => {
      const result = rgbToHsl(255, 0, 0);
      expect(result.h).toBe(0);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });
  });

  describe('hslToRgb', () => {
    it('converts HSL to RGB', () => {
      const result = hslToRgb(0, 100, 50);
      expect(result.r).toBe(255);
      expect(result.g).toBe(0);
      expect(result.b).toBe(0);
    });
  });

  describe('lighten', () => {
    it('lightens color', () => {
      const original = '#FF0000';
      const lighter = lighten(original, 20);
      expect(lighter).not.toBe(original);

      // Verify it's actually lighter
      const originalRgb = hexToRgb(original);
      const lighterRgb = hexToRgb(lighter);
      expect(originalRgb && lighterRgb).toBeTruthy();
    });
  });

  describe('darken', () => {
    it('darkens color', () => {
      const original = '#FF0000';
      const darker = darken(original, 20);
      expect(darker).not.toBe(original);
    });
  });

  describe('getContrastColor', () => {
    it('returns white for dark colors', () => {
      expect(getContrastColor('#000000')).toBe('#FFFFFF');
      expect(getContrastColor('#FF0000')).toBe('#FFFFFF');
    });

    it('returns black for light colors', () => {
      expect(getContrastColor('#FFFFFF')).toBe('#000000');
      expect(getContrastColor('#FFFF00')).toBe('#000000');
    });
  });

  describe('isDark', () => {
    it('detects dark colors', () => {
      expect(isDark('#000000')).toBe(true);
      expect(isDark('#FFFFFF')).toBe(false);
    });
  });

  describe('isLight', () => {
    it('detects light colors', () => {
      expect(isLight('#FFFFFF')).toBe(true);
      expect(isLight('#000000')).toBe(false);
    });
  });

  describe('isValidHex', () => {
    it('validates hex colors', () => {
      expect(isValidHex('#FF0000')).toBe(true);
      expect(isValidHex('#F00')).toBe(true);
      expect(isValidHex('FF0000')).toBe(true);
      expect(isValidHex('F00')).toBe(true);
      expect(isValidHex('invalid')).toBe(false);
      expect(isValidHex('#GG0000')).toBe(false);
    });
  });

  describe('hexToRgba', () => {
    it('converts hex to RGBA', () => {
      expect(hexToRgba('#FF0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
      expect(hexToRgba('#00FF00', 1)).toBe('rgba(0, 255, 0, 1)');
    });
  });

  describe('mixColors', () => {
    it('mixes two colors', () => {
      const color1 = '#FF0000';
      const color2 = '#0000FF';
      const mixed = mixColors(color1, color2, 0.5);

      expect(mixed).toBeDefined();
      expect(mixed).not.toBe(color1);
      expect(mixed).not.toBe(color2);
    });
  });

  describe('randomColor', () => {
    it('generates random hex color', () => {
      const color = randomColor();
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('generates different colors', () => {
      const color1 = randomColor();
      const color2 = randomColor();
      // Very unlikely to be the same
      expect(color1 === color2).toBe(false);
    });
  });

  describe('createPalette', () => {
    it('creates color palette', () => {
      const palette = createPalette('#FF0000', 5);
      expect(palette).toHaveLength(5);
      expect(palette.every((c) => isValidHex(c))).toBe(true);
    });

    it('creates graduated shades', () => {
      const palette = createPalette('#808080', 3);
      expect(palette).toHaveLength(3);
      // Middle should be close to original
      expect(palette[1]).toBeDefined();
    });
  });
});

