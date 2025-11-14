/**
 * Browser Utilities
 *
 * Browser detection and feature checking
 *
 * @module shared/utils/browser/browserUtils
 */

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if running on mobile
 */
export function isMobile(): boolean {
  if (!isBrowser()) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if running on iOS
 */
export function isIOS(): boolean {
  if (!isBrowser()) return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Check if running on Android
 */
export function isAndroid(): boolean {
  if (!isBrowser()) return false;
  return /Android/.test(navigator.userAgent);
}

/**
 * Check if running on desktop
 */
export function isDesktop(): boolean {
  return !isMobile();
}

/**
 * Get browser name
 */
export function getBrowserName(): string {
  if (!isBrowser()) return 'unknown';

  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari';
  if (ua.includes('Chrome')) return 'chrome';
  if (ua.includes('Edge')) return 'edge';
  if (ua.includes('MSIE') || ua.includes('Trident')) return 'ie';

  return 'unknown';
}

/**
 * Check if browser supports feature
 */
export function supportsFeature(feature: string): boolean {
  if (!isBrowser()) return false;

  switch (feature) {
    case 'localStorage':
      try {
        return 'localStorage' in window && window.localStorage !== null;
      } catch {
        return false;
      }
    case 'sessionStorage':
      try {
        return 'sessionStorage' in window && window.sessionStorage !== null;
      } catch {
        return false;
      }
    case 'geolocation':
      return 'geolocation' in navigator;
    case 'notifications':
      return 'Notification' in window;
    case 'serviceWorker':
      return 'serviceWorker' in navigator;
    case 'webGL':
      try {
        const canvas = document.createElement('canvas');
        return !!(
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        );
      } catch {
        return false;
      }
    default:
      return false;
  }
}

/**
 * Get viewport dimensions
 */
export function getViewport(): { width: number; height: number } {
  if (!isBrowser()) {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (!isBrowser()) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  if (!isBrowser()) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Get device pixel ratio
 */
export function getPixelRatio(): number {
  if (!isBrowser()) return 1;
  return window.devicePixelRatio || 1;
}

/**
 * Check if online
 */
export function isOnline(): boolean {
  if (!isBrowser()) return true;
  return navigator.onLine;
}

/**
 * Get user language
 */
export function getUserLanguage(): string {
  if (!isBrowser()) return 'en';
  return navigator.language || 'en';
}

