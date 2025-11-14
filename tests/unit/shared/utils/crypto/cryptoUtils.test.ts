import {
  randomString,
  generateUUID,
  simpleHash,
  randomHex,
  base64Encode,
  base64Decode,
  base64UrlEncode,
  base64UrlDecode,
  generateNonce,
  generateCSRFToken,
} from '@/shared/utils/crypto/cryptoUtils';

describe('Crypto Utils', () => {
  describe('randomString', () => {
    it('generates random string of specified length', () => {
      const result = randomString(16);
      expect(result).toHaveLength(16);
    });

    it('uses default length of 32', () => {
      const result = randomString();
      expect(result).toHaveLength(32);
    });

    it('generates different strings', () => {
      const str1 = randomString();
      const str2 = randomString();
      expect(str1).not.toBe(str2);
    });
  });

  describe('generateUUID', () => {
    it('generates valid UUID v4', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('generates unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('simpleHash', () => {
    it('generates consistent hash for same input', () => {
      const hash1 = simpleHash('test');
      const hash2 = simpleHash('test');
      expect(hash1).toBe(hash2);
    });

    it('generates different hashes for different inputs', () => {
      const hash1 = simpleHash('test1');
      const hash2 = simpleHash('test2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('randomHex', () => {
    it('generates hex string of specified bytes', () => {
      const hex = randomHex(8);
      expect(hex).toHaveLength(16); // 8 bytes = 16 hex chars
      expect(hex).toMatch(/^[0-9a-f]+$/);
    });

    it('uses default of 16 bytes', () => {
      const hex = randomHex();
      expect(hex).toHaveLength(32);
    });
  });

  describe('base64Encode', () => {
    it('encodes string to base64', () => {
      const result = base64Encode('Hello, World!');
      expect(result).toBe('SGVsbG8sIFdvcmxkIQ==');
    });

    it('handles empty string', () => {
      const result = base64Encode('');
      expect(result).toBe('');
    });
  });

  describe('base64Decode', () => {
    it('decodes base64 string', () => {
      const result = base64Decode('SGVsbG8sIFdvcmxkIQ==');
      expect(result).toBe('Hello, World!');
    });
  });

  describe('base64UrlEncode', () => {
    it('encodes to URL-safe base64', () => {
      const result = base64UrlEncode('test+/test=');
      expect(result).not.toContain('+');
      expect(result).not.toContain('/');
      expect(result).not.toContain('=');
    });
  });

  describe('base64UrlDecode', () => {
    it('decodes URL-safe base64', () => {
      const encoded = base64UrlEncode('test');
      const decoded = base64UrlDecode(encoded);
      expect(decoded).toBe('test');
    });
  });

  describe('generateNonce', () => {
    it('generates nonce', () => {
      const nonce = generateNonce();
      expect(nonce).toHaveLength(32);
      expect(nonce).toMatch(/^[0-9a-f]+$/);
    });

    it('generates unique nonces', () => {
      const nonce1 = generateNonce();
      const nonce2 = generateNonce();
      expect(nonce1).not.toBe(nonce2);
    });
  });

  describe('generateCSRFToken', () => {
    it('generates CSRF token', () => {
      const token = generateCSRFToken();
      expect(token).toHaveLength(64);
      expect(token).toMatch(/^[0-9a-f]+$/);
    });

    it('generates unique tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      expect(token1).not.toBe(token2);
    });
  });
});

