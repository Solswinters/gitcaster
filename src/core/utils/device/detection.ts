/**
 * Device detection utilities
 */

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|Android/i.test(navigator.userAgent) && !isMobile();
}

export function isDesktop(): boolean {
  return !isMobile() && !isTablet();
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
}

export function getBrowserInfo(): { name: string; version: string } {
  if (typeof window === 'undefined') return { name: 'unknown', version: 'unknown' };
  
  const ua = navigator.userAgent;
  let name = 'unknown';
  let version = 'unknown';

  if (ua.indexOf('Chrome') > -1) {
    name = 'Chrome';
    version = ua.match(/Chrome\/([\d.]+)/)?.[1] || 'unknown';
  } else if (ua.indexOf('Safari') > -1) {
    name = 'Safari';
    version = ua.match(/Version\/([\d.]+)/)?.[1] || 'unknown';
  } else if (ua.indexOf('Firefox') > -1) {
    name = 'Firefox';
    version = ua.match(/Firefox\/([\d.]+)/)?.[1] || 'unknown';
  } else if (ua.indexOf('Edge') > -1) {
    name = 'Edge';
    version = ua.match(/Edge\/([\d.]+)/)?.[1] || 'unknown';
  }

  return { name, version };
}

