/**
 * Common validation utilities
 */

export function isPositiveNumber(value: number): boolean {
  return typeof value === 'number' && value > 0;
}

export function isNonEmptyString(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function isWithinRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export function containsOnlyLetters(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

export function containsOnlyNumbers(str: string): boolean {
  return /^\d+$/.test(str);
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

