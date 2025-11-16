/**
 * Validation utilities tests
 */

import { describe, it, expect } from '@jest/globals';
import { isValidEmail, isStrongPassword, isPositiveNumber, isValidUrl } from '../validation';

describe('Validation utilities', () => {
  it('should validate emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@.com')).toBe(false);
  });

  it('should validate strong passwords', () => {
    expect(isStrongPassword('Password123!')).toBe(true);
    expect(isStrongPassword('weak')).toBe(false);
    expect(isStrongPassword('NoSpecial1')).toBe(false);
  });

  it('should validate positive numbers', () => {
    expect(isPositiveNumber(5)).toBe(true);
    expect(isPositiveNumber(0)).toBe(false);
    expect(isPositiveNumber(-5)).toBe(false);
  });

  it('should validate URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('not-a-url')).toBe(false);
  });
});

