/**
 * Theme service tests
 */

import { describe, it, expect } from '@jest/globals';
import { ThemeService } from '../services/theme-service';

describe('ThemeService', () => {
  it('should get all themes', () => {
    const themes = ThemeService.getAllThemes();
    expect(themes).toBeInstanceOf(Array);
  });

  it('should create custom theme', () => {
    const theme = ThemeService.createTheme({
      name: 'Custom Theme',
      colors: { primary: '#ff0000', background: '#ffffff' },
    } as any);
    expect(theme).toBeDefined();
    expect(theme.id).toBeDefined();
  });
});

