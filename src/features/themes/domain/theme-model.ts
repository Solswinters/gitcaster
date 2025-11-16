/**
 * Theme domain model
 */

import type { Theme } from '../types';
import { isDarkTheme, validateThemeColors } from '../utils';

export class ThemeModel {
  constructor(private theme: Theme) {}

  get id(): string {
    return this.theme.id;
  }

  get name(): string {
    return this.theme.name;
  }

  isDark(): boolean {
    return isDarkTheme(this.theme);
  }

  isValid(): boolean {
    return validateThemeColors(this.theme.colors);
  }

  getPrimaryColor(): string {
    return this.theme.colors.primary;
  }

  getBackgroundColor(): string {
    return this.theme.colors.background;
  }

  clone(): Theme {
    return JSON.parse(JSON.stringify(this.theme));
  }

  toJSON(): Theme {
    return this.theme;
  }
}

