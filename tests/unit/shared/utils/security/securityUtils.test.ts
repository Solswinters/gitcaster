import {
  escapeHtml,
  unescapeHtml,
  sanitizeUrl,
  isSafeUrl,
  removeScriptTags,
  sanitizeQuery,
  simpleHash,
  validateCSP,
  maskEmail,
  maskCreditCard,
} from '@/shared/utils/security/securityUtils';

describe('Security Utils', () => {
  describe('escapeHtml', () => {
    it('escapes HTML entities', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert("xss")&lt;/script&gt;'
      );
    });

    it('handles special characters', () => {
      expect(escapeHtml('Hello & World')).toBe('Hello &amp; World');
    });
  });

  describe('unescapeHtml', () => {
    it('unescapes HTML entities', () => {
      const escaped = '&lt;div&gt;Hello&lt;/div&gt;';
      expect(unescapeHtml(escaped)).toBe('<div>Hello</div>');
    });
  });

  describe('sanitizeUrl', () => {
    it('allows valid HTTP URLs', () => {
      const url = 'http://example.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('allows valid HTTPS URLs', () => {
      const url = 'https://example.com';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('rejects javascript: protocol', () => {
      expect(sanitizeUrl('javascript:alert("xss")')).toBe('');
    });

    it('rejects data: protocol', () => {
      expect(sanitizeUrl('data:text/html,<script>alert("xss")</script>')).toBe('');
    });

    it('rejects invalid URLs', () => {
      expect(sanitizeUrl('not a url')).toBe('');
    });
  });

  describe('isSafeUrl', () => {
    it('returns true for safe URLs', () => {
      expect(isSafeUrl('https://example.com')).toBe(true);
      expect(isSafeUrl('http://example.com')).toBe(true);
    });

    it('returns false for unsafe URLs', () => {
      expect(isSafeUrl('javascript:alert("xss")')).toBe(false);
      expect(isSafeUrl('not a url')).toBe(false);
    });
  });

  describe('removeScriptTags', () => {
    it('removes script tags', () => {
      const html = '<div>Hello</div><script>alert("xss")</script><p>World</p>';
      const result = removeScriptTags(html);

      expect(result).not.toContain('<script>');
      expect(result).toContain('<div>Hello</div>');
    });

    it('removes multiple script tags', () => {
      const html = '<script>1</script><div>test</div><script>2</script>';
      const result = removeScriptTags(html);

      expect(result).toBe('<div>test</div>');
    });
  });

  describe('sanitizeQuery', () => {
    it('removes SQL injection characters', () => {
      expect(sanitizeQuery("test'; DROP TABLE users;--")).toBe('test DROP TABLE users--');
    });

    it('removes quotes and backslashes', () => {
      expect(sanitizeQuery('test"value\\')).toBe('testvalue');
    });
  });

  describe('simpleHash', () => {
    it('generates consistent hash', () => {
      const hash1 = simpleHash('test');
      const hash2 = simpleHash('test');
      expect(hash1).toBe(hash2);
    });

    it('generates different hashes for different inputs', () => {
      const hash1 = simpleHash('test1');
      const hash2 = simpleHash('test2');
      expect(hash1).not.toBe(hash2);
    });

    it('returns positive number', () => {
      const hash = simpleHash('test');
      expect(hash).toBeGreaterThanOrEqual(0);
    });
  });

  describe('validateCSP', () => {
    it('validates URLs against allowed domains', () => {
      const allowedDomains = ['example.com', 'test.com'];

      expect(validateCSP('https://example.com/path', allowedDomains)).toBe(true);
      expect(validateCSP('https://sub.example.com/path', allowedDomains)).toBe(true);
      expect(validateCSP('https://malicious.com/path', allowedDomains)).toBe(false);
    });

    it('returns false for invalid URLs', () => {
      expect(validateCSP('not a url', ['example.com'])).toBe(false);
    });
  });

  describe('maskEmail', () => {
    it('masks email address', () => {
      const result = maskEmail('john.doe@example.com');
      expect(result).toMatch(/^j\*+e@example\.com$/);
    });

    it('handles short local parts', () => {
      const result = maskEmail('ab@example.com');
      expect(result).toBe('ab@example.com');
    });

    it('returns original for invalid email', () => {
      expect(maskEmail('notanemail')).toBe('notanemail');
    });
  });

  describe('maskCreditCard', () => {
    it('masks credit card number', () => {
      const result = maskCreditCard('1234567890123456');
      expect(result).toBe('************3456');
    });

    it('handles formatted card numbers', () => {
      const result = maskCreditCard('1234-5678-9012-3456');
      expect(result).toBe('************3456');
    });
  });
});

