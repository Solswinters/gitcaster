import {
  breakpoints,
  matchesBreakpoint,
  getCurrentBreakpoint,
  isMobileBreakpoint,
  isTabletBreakpoint,
  isDesktopBreakpoint,
  createMediaQuery,
  matchMedia,
} from '@/shared/utils/responsive/responsiveUtils';

describe('Responsive Utils', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe('breakpoints', () => {
    it('defines standard breakpoints', () => {
      expect(breakpoints.xs).toBe(0);
      expect(breakpoints.sm).toBe(640);
      expect(breakpoints.md).toBe(768);
      expect(breakpoints.lg).toBe(1024);
      expect(breakpoints.xl).toBe(1280);
      expect(breakpoints['2xl']).toBe(1536);
    });
  });

  describe('matchesBreakpoint', () => {
    it('returns true when viewport matches breakpoint', () => {
      window.innerWidth = 1024;
      expect(matchesBreakpoint('lg')).toBe(true);
    });

    it('returns false when viewport does not match', () => {
      window.innerWidth = 500;
      expect(matchesBreakpoint('lg')).toBe(false);
    });
  });

  describe('getCurrentBreakpoint', () => {
    it('returns current breakpoint based on width', () => {
      window.innerWidth = 1024;
      expect(getCurrentBreakpoint()).toBe('lg');

      window.innerWidth = 768;
      expect(getCurrentBreakpoint()).toBe('md');

      window.innerWidth = 640;
      expect(getCurrentBreakpoint()).toBe('sm');
    });

    it('returns xs for very small widths', () => {
      window.innerWidth = 320;
      expect(getCurrentBreakpoint()).toBe('xs');
    });
  });

  describe('isMobileBreakpoint', () => {
    it('returns true for mobile widths', () => {
      window.innerWidth = 500;
      expect(isMobileBreakpoint()).toBe(true);
    });

    it('returns false for desktop widths', () => {
      window.innerWidth = 1024;
      expect(isMobileBreakpoint()).toBe(false);
    });
  });

  describe('isTabletBreakpoint', () => {
    it('returns true for tablet widths', () => {
      window.innerWidth = 800;
      expect(isTabletBreakpoint()).toBe(true);
    });

    it('returns false for mobile widths', () => {
      window.innerWidth = 600;
      expect(isTabletBreakpoint()).toBe(false);
    });

    it('returns false for desktop widths', () => {
      window.innerWidth = 1200;
      expect(isTabletBreakpoint()).toBe(false);
    });
  });

  describe('isDesktopBreakpoint', () => {
    it('returns true for desktop widths', () => {
      window.innerWidth = 1200;
      expect(isDesktopBreakpoint()).toBe(true);
    });

    it('returns false for mobile widths', () => {
      window.innerWidth = 600;
      expect(isDesktopBreakpoint()).toBe(false);
    });
  });

  describe('createMediaQuery', () => {
    it('creates min-width media query', () => {
      const query = createMediaQuery('md');
      expect(query).toBe('(min-width: 768px)');
    });

    it('creates max-width media query', () => {
      const query = createMediaQuery('lg', 'max');
      expect(query).toBe('(max-width: 1024px)');
    });
  });

  describe('matchMedia', () => {
    it('checks media query match', () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: true });

      const result = matchMedia('(min-width: 768px)');

      expect(result).toBe(true);
      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
    });

    it('returns false when query does not match', () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: false });

      const result = matchMedia('(min-width: 768px)');

      expect(result).toBe(false);
    });
  });
});

