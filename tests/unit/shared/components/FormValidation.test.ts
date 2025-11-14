import { FormValidator, commonValidations } from '@/shared/components/forms/FormValidation';

describe('FormValidator', () => {
  describe('required', () => {
    const rule = FormValidator.required();

    it('validates non-empty strings', () => {
      expect(rule.validate('test')).toBe(true);
      expect(rule.validate('   ')).toBe(false);
      expect(rule.validate('')).toBe(false);
    });

    it('validates arrays', () => {
      expect(rule.validate([1, 2])).toBe(true);
      expect(rule.validate([])).toBe(false);
    });

    it('validates null and undefined', () => {
      expect(rule.validate(null)).toBe(false);
      expect(rule.validate(undefined)).toBe(false);
    });
  });

  describe('email', () => {
    const rule = FormValidator.email();

    it('validates valid emails', () => {
      expect(rule.validate('test@example.com')).toBe(true);
      expect(rule.validate('user+tag@domain.co.uk')).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(rule.validate('notanemail')).toBe(false);
      expect(rule.validate('@example.com')).toBe(false);
      expect(rule.validate('test@')).toBe(false);
    });
  });

  describe('minLength', () => {
    const rule = FormValidator.minLength(5);

    it('validates strings of minimum length', () => {
      expect(rule.validate('12345')).toBe(true);
      expect(rule.validate('123456')).toBe(true);
      expect(rule.validate('1234')).toBe(false);
    });
  });

  describe('maxLength', () => {
    const rule = FormValidator.maxLength(10);

    it('validates strings of maximum length', () => {
      expect(rule.validate('1234567890')).toBe(true);
      expect(rule.validate('123')).toBe(true);
      expect(rule.validate('12345678901')).toBe(false);
    });
  });

  describe('pattern', () => {
    const rule = FormValidator.pattern(/^[0-9]+$/);

    it('validates strings matching pattern', () => {
      expect(rule.validate('12345')).toBe(true);
      expect(rule.validate('abc')).toBe(false);
      expect(rule.validate('123abc')).toBe(false);
    });
  });

  describe('min', () => {
    const rule = FormValidator.min(10);

    it('validates numbers greater than or equal to minimum', () => {
      expect(rule.validate(10)).toBe(true);
      expect(rule.validate(15)).toBe(true);
      expect(rule.validate(9)).toBe(false);
    });
  });

  describe('max', () => {
    const rule = FormValidator.max(100);

    it('validates numbers less than or equal to maximum', () => {
      expect(rule.validate(100)).toBe(true);
      expect(rule.validate(50)).toBe(true);
      expect(rule.validate(101)).toBe(false);
    });
  });

  describe('url', () => {
    const rule = FormValidator.url();

    it('validates valid URLs', () => {
      expect(rule.validate('https://example.com')).toBe(true);
      expect(rule.validate('http://localhost:3000')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(rule.validate('not-a-url')).toBe(false);
      expect(rule.validate('example.com')).toBe(false);
    });
  });

  describe('combine', () => {
    const validator = FormValidator.combine(
      FormValidator.required(),
      FormValidator.minLength(5)
    );

    it('validates all rules', () => {
      expect(validator('12345')).toBeUndefined();
      expect(validator('')).toBe('This field is required');
      expect(validator('123')).toBe('Must be at least 5 characters');
    });
  });

  describe('commonValidations', () => {
    it('validates email', () => {
      expect(commonValidations.email('test@example.com')).toBeUndefined();
      expect(commonValidations.email('')).toBe('This field is required');
      expect(commonValidations.email('invalid')).toBe('Invalid email address');
    });

    it('validates password', () => {
      expect(commonValidations.password('password123')).toBeUndefined();
      expect(commonValidations.password('')).toBe('This field is required');
      expect(commonValidations.password('short')).toBe('Password must be at least 8 characters');
    });

    it('validates username', () => {
      expect(commonValidations.username('john_doe')).toBeUndefined();
      expect(commonValidations.username('')).toBe('This field is required');
      expect(commonValidations.username('ab')).toBe('Username must be at least 3 characters');
      expect(commonValidations.username('john doe')).toBe(
        'Username can only contain letters, numbers, hyphens, and underscores'
      );
    });
  });
});

