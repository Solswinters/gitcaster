/**
 * Environment Utilities
 * 
 * Safe environment variable access with validation
 */

/**
 * Get environment variable with fallback
 */
export function getEnv(key: string, fallback = ''): string {
  if (typeof process === 'undefined') return fallback;
  return process.env[key] || fallback;
}

/**
 * Get required environment variable (throws if missing)
 */
export function getRequiredEnv(key: string): string {
  const value = getEnv(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Check if we're in development
 */
export function isDevelopment(): boolean {
  return getEnv('NODE_ENV') === 'development';
}

/**
 * Check if we're in production
 */
export function isProduction(): boolean {
  return getEnv('NODE_ENV') === 'production';
}

/**
 * Check if we're in test environment
 */
export function isTest(): boolean {
  return getEnv('NODE_ENV') === 'test';
}

/**
 * Check if we're on server
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Check if we're on client
 */
export function isClient(): boolean {
  return !isServer();
}

/**
 * Get app URL
 */
export function getAppUrl(): string {
  return getEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');
}

/**
 * Get API URL
 */
export function getApiUrl(): string {
  return getEnv('NEXT_PUBLIC_API_URL', getAppUrl());
}

/**
 * Check if feature flag is enabled
 */
export function isFeatureEnabled(feature: string): boolean {
  const value = getEnv(`NEXT_PUBLIC_FEATURE_${feature.toUpperCase()}`);
  return value === 'true' || value === '1';
}

/**
 * Get numeric environment variable
 */
export function getEnvNumber(key: string, fallback: number): number {
  const value = getEnv(key);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Get boolean environment variable
 */
export function getEnvBoolean(key: string, fallback: boolean): boolean {
  const value = getEnv(key).toLowerCase();
  if (value === 'true' || value === '1' || value === 'yes') return true;
  if (value === 'false' || value === '0' || value === 'no') return false;
  return fallback;
}

/**
 * Get array from comma-separated environment variable
 */
export function getEnvArray(key: string, fallback: string[] = []): string[] {
  const value = getEnv(key);
  if (!value) return fallback;
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

/**
 * Validate required environment variables
 */
export function validateEnv(required: string[]): void {
  const missing = required.filter(key => !getEnv(key));
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(k => `  - ${k}`).join('\n')}`
    );
  }
}

/**
 * Get all environment variables (server-side only)
 */
export function getAllEnv(): Record<string, string | undefined> {
  if (isClient()) {
    console.warn('getAllEnv() called on client - returning empty object');
    return {};
  }
  return process.env;
}

/**
 * Mask sensitive environment variable for logging
 */
export function maskEnv(value: string, visibleChars = 4): string {
  if (value.length <= visibleChars * 2) {
    return '*'.repeat(value.length);
  }
  const start = value.slice(0, visibleChars);
  const end = value.slice(-visibleChars);
  const masked = '*'.repeat(value.length - visibleChars * 2);
  return `${start}${masked}${end}`;
}

