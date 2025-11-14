/**
 * Crypto Utilities
 *
 * Cryptographic and hashing utilities
 *
 * @module shared/utils/crypto/cryptoUtils
 */

/**
 * Generate random string
 */
export function randomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Simple hash function (for non-crypto purposes)
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate random hex string
 */
export function randomHex(bytes: number = 16): string {
  const hex = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < bytes * 2; i++) {
    result += hex[Math.floor(Math.random() * 16)];
  }
  return result;
}

/**
 * Base64 encode
 */
export function base64Encode(str: string): string {
  if (typeof window !== 'undefined') {
    return window.btoa(str);
  }
  return Buffer.from(str).toString('base64');
}

/**
 * Base64 decode
 */
export function base64Decode(str: string): string {
  if (typeof window !== 'undefined') {
    return window.atob(str);
  }
  return Buffer.from(str, 'base64').toString();
}

/**
 * URL-safe Base64 encode
 */
export function base64UrlEncode(str: string): string {
  return base64Encode(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * URL-safe Base64 decode
 */
export function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return base64Decode(base64);
}

/**
 * Generate nonce
 */
export function generateNonce(): string {
  return randomHex(16);
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return randomHex(32);
}

