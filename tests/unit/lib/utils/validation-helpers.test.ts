import { validateEmail, validateUrl, validateSlug, validatePassword } from '@/lib/utils/validation-helpers';

describe('Validation Helpers', () => {
  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
      ];

      validEmails.forEach((email) => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid emails', () => {
      const invalidEmails = ['invalid', '@example.com', 'user@'];

      invalidEmails.forEach((email) => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://example.com/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('not a url')).toBe(false);
      expect(validateUrl('javascript:alert(1)')).toBe(false);
    });
  });

  describe('validateSlug', () => {
    it('should validate correct slugs', () => {
      expect(validateSlug('user-name')).toBe(true);
      expect(validateSlug('user123')).toBe(true);
    });

    it('should reject invalid slugs', () => {
      expect(validateSlug('User Name')).toBe(false);
      expect(validateSlug('user@name')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('StrongP@ss123')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('12345678')).toBe(false);
    });
  });
});

