import {
  isValidEmail,
  isValidUrl,
  isValidPhone,
  isValidHexColor,
  isValidIPv4,
  isValidUsername,
  isValidSlug,
  extractEmails,
  extractUrls,
  extractHashtags,
  extractMentions,
  escapeRegex,
  wildcardToRegex,
} from '@/shared/utils/regex/regexUtils';

describe('Regex Utils', () => {
  describe('isValidEmail', () => {
    it('validates correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('validates correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://subdomain.example.com/path')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('example')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('validates correct phone numbers', () => {
      expect(isValidPhone('123-456-7890')).toBe(true);
      expect(isValidPhone('(123) 456-7890')).toBe(true);
      expect(isValidPhone('+1234567890')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abc-def-ghij')).toBe(false);
    });
  });

  describe('isValidHexColor', () => {
    it('validates correct hex colors', () => {
      expect(isValidHexColor('#FF5733')).toBe(true);
      expect(isValidHexColor('#ABC')).toBe(true);
      expect(isValidHexColor('FF5733')).toBe(true);
    });

    it('rejects invalid hex colors', () => {
      expect(isValidHexColor('#GG5733')).toBe(false);
      expect(isValidHexColor('#12')).toBe(false);
    });
  });

  describe('isValidIPv4', () => {
    it('validates correct IPv4 addresses', () => {
      expect(isValidIPv4('192.168.1.1')).toBe(true);
      expect(isValidIPv4('10.0.0.0')).toBe(true);
    });

    it('rejects invalid IPv4 addresses', () => {
      expect(isValidIPv4('256.1.1.1')).toBe(false);
      expect(isValidIPv4('192.168.1')).toBe(false);
    });
  });

  describe('isValidUsername', () => {
    it('validates correct usernames', () => {
      expect(isValidUsername('user123')).toBe(true);
      expect(isValidUsername('test_user')).toBe(true);
    });

    it('rejects invalid usernames', () => {
      expect(isValidUsername('ab')).toBe(false); // Too short
      expect(isValidUsername('user-name')).toBe(false); // Dash not allowed
    });
  });

  describe('isValidSlug', () => {
    it('validates correct slugs', () => {
      expect(isValidSlug('my-blog-post')).toBe(true);
      expect(isValidSlug('article-123')).toBe(true);
    });

    it('rejects invalid slugs', () => {
      expect(isValidSlug('My Blog Post')).toBe(false); // Uppercase
      expect(isValidSlug('post_title')).toBe(false); // Underscore
    });
  });

  describe('extractEmails', () => {
    it('extracts emails from text', () => {
      const text = 'Contact us at support@example.com or sales@example.com';
      const emails = extractEmails(text);
      expect(emails).toEqual(['support@example.com', 'sales@example.com']);
    });

    it('returns empty array when no emails', () => {
      expect(extractEmails('No emails here')).toEqual([]);
    });
  });

  describe('extractUrls', () => {
    it('extracts URLs from text', () => {
      const text = 'Visit https://example.com and http://test.com';
      const urls = extractUrls(text);
      expect(urls).toEqual(['https://example.com', 'http://test.com']);
    });

    it('returns empty array when no URLs', () => {
      expect(extractUrls('No URLs here')).toEqual([]);
    });
  });

  describe('extractHashtags', () => {
    it('extracts hashtags from text', () => {
      const text = 'Check out #coding and #javascript';
      const hashtags = extractHashtags(text);
      expect(hashtags).toEqual(['coding', 'javascript']);
    });

    it('returns empty array when no hashtags', () => {
      expect(extractHashtags('No hashtags here')).toEqual([]);
    });
  });

  describe('extractMentions', () => {
    it('extracts mentions from text', () => {
      const text = 'Thanks @john and @jane for the help';
      const mentions = extractMentions(text);
      expect(mentions).toEqual(['john', 'jane']);
    });

    it('returns empty array when no mentions', () => {
      expect(extractMentions('No mentions here')).toEqual([]);
    });
  });

  describe('escapeRegex', () => {
    it('escapes special regex characters', () => {
      const result = escapeRegex('test.*+?');
      expect(result).toBe('test\\.\\*\\+\\?');
    });
  });

  describe('wildcardToRegex', () => {
    it('converts wildcard pattern to regex', () => {
      const regex = wildcardToRegex('test*');
      expect(regex.test('test123')).toBe(true);
      expect(regex.test('other')).toBe(false);
    });

    it('handles question mark wildcard', () => {
      const regex = wildcardToRegex('test?');
      expect(regex.test('test1')).toBe(true);
      expect(regex.test('test12')).toBe(false);
    });
  });
});

