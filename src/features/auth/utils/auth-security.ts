/**
 * Auth Security - Enhanced authentication security utilities
 * HIGH PRIORITY: Security improvements for authentication flows
 */

import { createHash, randomBytes, pbkdf2Sync } from 'crypto';

export interface SessionToken {
  token: string;
  expiresAt: Date;
  userId: string;
  fingerprint: string;
}

export interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // in milliseconds
  sessionTimeout: number; // in milliseconds
  tokenRefreshThreshold: number; // in milliseconds
}

export class AuthSecurity {
  private static readonly config: SecurityConfig = {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes
  };

  private static loginAttempts: Map<string, { count: number; lockedUntil?: Date }> =
    new Map();

  /**
   * Generate secure random token
   */
  static generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Hash password with salt
   */
  static hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const actualSalt = salt || randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, actualSalt, 10000, 64, 'sha512').toString('hex');

    return { hash, salt: actualSalt };
  }

  /**
   * Verify password against hash
   */
  static verifyPassword(password: string, hash: string, salt: string): boolean {
    const { hash: computedHash } = this.hashPassword(password, salt);
    return computedHash === hash;
  }

  /**
   * Generate device fingerprint
   */
  static generateFingerprint(userAgent: string, ipAddress: string): string {
    const data = `${userAgent}:${ipAddress}`;
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Verify device fingerprint
   */
  static verifyFingerprint(
    sessionFingerprint: string,
    currentFingerprint: string
  ): boolean {
    return sessionFingerprint === currentFingerprint;
  }

  /**
   * Check if user is locked out
   */
  static isLockedOut(identifier: string): boolean {
    const attempt = this.loginAttempts.get(identifier);

    if (!attempt || !attempt.lockedUntil) {
      return false;
    }

    if (new Date() > attempt.lockedUntil) {
      // Lockout expired, clear it
      this.loginAttempts.delete(identifier);
      return false;
    }

    return true;
  }

  /**
   * Record failed login attempt
   */
  static recordFailedAttempt(identifier: string): void {
    const attempt = this.loginAttempts.get(identifier) || { count: 0 };
    attempt.count += 1;

    if (attempt.count >= this.config.maxLoginAttempts) {
      attempt.lockedUntil = new Date(Date.now() + this.config.lockoutDuration);
    }

    this.loginAttempts.set(identifier, attempt);
  }

  /**
   * Clear login attempts on successful login
   */
  static clearLoginAttempts(identifier: string): void {
    this.loginAttempts.delete(identifier);
  }

  /**
   * Get remaining lockout time
   */
  static getRemainingLockoutTime(identifier: string): number {
    const attempt = this.loginAttempts.get(identifier);

    if (!attempt || !attempt.lockedUntil) {
      return 0;
    }

    const remaining = attempt.lockedUntil.getTime() - Date.now();
    return Math.max(0, remaining);
  }

  /**
   * Validate session token expiration
   */
  static isSessionExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }

  /**
   * Check if token needs refresh
   */
  static needsRefresh(expiresAt: Date): boolean {
    const timeUntilExpiry = expiresAt.getTime() - Date.now();
    return timeUntilExpiry < this.config.tokenRefreshThreshold;
  }

  /**
   * Generate session expiration date
   */
  static generateSessionExpiry(): Date {
    return new Date(Date.now() + this.config.sessionTimeout);
  }

  /**
   * Sanitize sensitive data from logs
   */
  static sanitizeForLogging(data: Record<string, any>): Record<string, any> {
    const sanitized = { ...data };
    const sensitiveFields = ['password', 'token', 'secret', 'privateKey', 'apiKey'];

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Validate token format
   */
  static isValidTokenFormat(token: string): boolean {
    // Check if token is a valid hex string of appropriate length
    return /^[a-f0-9]{64}$/i.test(token);
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    return randomBytes(32).toString('base64');
  }

  /**
   * Verify CSRF token
   */
  static verifyCSRFToken(token: string, expectedToken: string): boolean {
    if (!token || !expectedToken) {
      return false;
    }

    // Use constant-time comparison to prevent timing attacks
    return this.constantTimeCompare(token, expectedToken);
  }

  /**
   * Constant-time string comparison
   */
  private static constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  /**
   * Rate limit check
   */
  static checkRateLimit(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): boolean {
    // This would integrate with a proper rate limiting service
    // For now, it's a placeholder
    return true;
  }

  /**
   * Generate secure state parameter for OAuth
   */
  static generateOAuthState(): string {
    return randomBytes(32).toString('base64url');
  }

  /**
   * Validate OAuth state
   */
  static validateOAuthState(state: string, expectedState: string): boolean {
    return this.constantTimeCompare(state, expectedState);
  }

  /**
   * Mask sensitive data
   */
  static maskSensitiveData(data: string, visibleChars: number = 4): string {
    if (data.length <= visibleChars) {
      return '*'.repeat(data.length);
    }

    const masked = '*'.repeat(data.length - visibleChars);
    const visible = data.slice(-visibleChars);

    return masked + visible;
  }

  /**
   * Update security configuration
   */
  static updateConfig(config: Partial<SecurityConfig>): void {
    Object.assign(this.config, config);
  }

  /**
   * Get security configuration
   */
  static getConfig(): SecurityConfig {
    return { ...this.config };
  }
}

export default AuthSecurity;

