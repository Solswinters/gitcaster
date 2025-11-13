import { 
  validateProfileData, 
  validateEmail, 
  validateUrl, 
  validateSlug 
} from '@/lib/validators/profile-validator';

describe('Profile Validator', () => {
  describe('validateProfileData', () => {
    it('should validate complete profile data', () => {
      const validProfile = {
        displayName: 'John Doe',
        bio: 'Software engineer',
        email: 'john@example.com',
        website: 'https://example.com',
        location: 'San Francisco',
      };

      const result = validateProfileData(validProfile);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject profile with invalid email', () => {
      const invalidProfile = {
        displayName: 'John Doe',
        email: 'invalid-email',
      };

      const result = validateProfileData(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });

    it('should reject profile with too long bio', () => {
      const longBio = 'a'.repeat(1001);
      const invalidProfile = {
        displayName: 'John Doe',
        bio: longBio,
      };

      const result = validateProfileData(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Bio must be less than 1000 characters');
    });

    it('should allow optional fields to be empty', () => {
      const minimalProfile = {
        displayName: 'John Doe',
      };

      const result = validateProfileData(minimalProfile);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
        'user123@sub.example.com',
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user @example.com',
        'user@.com',
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('validateUrl', () => {
    it('should accept valid URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://example.com',
        'https://sub.example.com/path',
        'https://example.com?query=param',
      ];

      validUrls.forEach(url => {
        expect(validateUrl(url)).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        'not a url',
        'ftp://example.com',
        'example.com',
        'javascript:alert(1)',
      ];

      invalidUrls.forEach(url => {
        expect(validateUrl(url)).toBe(false);
      });
    });
  });

  describe('validateSlug', () => {
    it('should accept valid slugs', () => {
      const validSlugs = [
        'john-doe',
        'user123',
        'test-user-name',
        'a',
      ];

      validSlugs.forEach(slug => {
        expect(validateSlug(slug)).toBe(true);
      });
    });

    it('should reject invalid slugs', () => {
      const invalidSlugs = [
        'John Doe',
        'user@name',
        'test_user',
        '',
        'a'.repeat(51),
      ];

      invalidSlugs.forEach(slug => {
        expect(validateSlug(slug)).toBe(false);
      });
    });
  });
});

