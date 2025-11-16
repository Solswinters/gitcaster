/**
 * Central exports for all core utilities
 */

export * as StringUtils from './string';
export * as NumberUtils from './number';
export * as DateUtils from './date';
export * as ArrayUtils from './array';
export * as ObjectUtils from './object';
export * as AsyncUtils from './async';
export * as ValidationUtils from './validation';
export * as BrowserUtils from './browser';
export * as UrlUtils from './url';
export * as FileUtils from './file';
export * as CryptoUtils from './crypto';
export * as ColorUtils from './color';
export * as DeviceUtils from './device';
export * as PerformanceUtils from './performance';

// Re-export commonly used utilities
export { capitalizeFirstLetter, truncateString, toKebabCase } from './string';
export { formatNumber, formatCurrency, formatPercentage, formatBytes } from './number';
export { formatDate, formatDateRelative, addDays } from './date';
export { unique, chunk, groupBy, shuffle } from './array';
export { pick, omit, deepClone, isEmpty } from './object';
export { debounce, throttle, delay, retry } from './async';
export { isValidEmail, isStrongPassword, isValidUrl } from './validation';
export { copyToClipboard, scrollToTop, setLocalStorage, getLocalStorage } from './browser';
export { hexToRgb, rgbToHex } from './color';
export { hashString, generateUUID } from './crypto';
export { isMobile, isDesktop, getDeviceType } from './device';
export { measurePerformance, PerformanceTimer } from './performance';
export { cn } from './cn';
