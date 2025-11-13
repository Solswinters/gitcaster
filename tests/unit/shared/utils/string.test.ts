/**
 * String Utilities Tests
 */

import {
  capitalize,
  camelCase,
  snakeCase,
  kebabCase,
  truncate,
  slugify,
  mask,
  isValidEmail,
  formatBytes,
} from '@/shared/utils/string/stringUtils';

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('Hello-World')).toBe('helloWorld');
      expect(camelCase('hello_world')).toBe('helloWorld');
    });
  });

  describe('snakeCase', () => {
    it('should convert to snake_case', () => {
      expect(snakeCase('helloWorld')).toBe('hello_world');
      expect(snakeCase('Hello World')).toBe('hello_world');
    });
  });

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
      expect(kebabCase('Hello World')).toBe('hello-world');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const long = 'This is a very long string that needs truncation';
      expect(truncate(long, 20)).toBe('This is a very lo...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Short', 10)).toBe('Short');
    });

    it('should use custom suffix', () => {
      expect(truncate('Long string', 8, '…')).toBe('Long st…');
    });
  });

  describe('slugify', () => {
    it('should create URL-friendly slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('Test @#$ String')).toBe('test-string');
    });

    it('should handle special characters', () => {
      expect(slugify('Café & Restaurant')).toBe('caf-restaurant');
    });
  });

  describe('mask', () => {
    it('should mask middle characters', () => {
      expect(mask('1234567890', 4, 4)).toBe('1234**7890');
    });

    it('should not mask short strings', () => {
      expect(mask('12345', 2, 2)).toBe('12345');
    });
  });
});

describe('Validation', () => {
  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });
});

