import {
  validateEnv,
  getEnv,
  getOptionalEnv,
  isProduction,
  isDevelopment,
  isTest,
} from '@/lib/config/env-validator';

describe('Environment Validator', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('validateEnv', () => {
    it('should pass with all required variables set', () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
      process.env.SESSION_SECRET = 'a'.repeat(32);
      process.env.GITHUB_CLIENT_ID = 'test-client-id';
      process.env.GITHUB_CLIENT_SECRET = 'test-secret';
      process.env.NEXT_PUBLIC_REOWN_PROJECT_ID = 'test-project-id';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.NODE_ENV = 'development';

      const result = validateEnv();
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when required variables are missing', () => {
      process.env = {}; // Clear all env vars

      const result = validateEnv();
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject short SESSION_SECRET', () => {
      process.env.DATABASE_URL = 'postgresql://localhost/db';
      process.env.SESSION_SECRET = 'short'; // Less than 32 chars
      process.env.GITHUB_CLIENT_ID = 'test';
      process.env.GITHUB_CLIENT_SECRET = 'test';
      process.env.NEXT_PUBLIC_REOWN_PROJECT_ID = 'test';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

      const result = validateEnv();
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'SESSION_SECRET must be at least 32 characters long for security'
      );
    });

    it('should reject invalid DATABASE_URL', () => {
      process.env.DATABASE_URL = 'mysql://localhost/db'; // Wrong database type
      process.env.SESSION_SECRET = 'a'.repeat(32);
      process.env.GITHUB_CLIENT_ID = 'test';
      process.env.GITHUB_CLIENT_SECRET = 'test';
      process.env.NEXT_PUBLIC_REOWN_PROJECT_ID = 'test';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

      const result = validateEnv();
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'DATABASE_URL must be a valid PostgreSQL connection string'
      );
    });

    it('should reject invalid NEXT_PUBLIC_APP_URL', () => {
      process.env.DATABASE_URL = 'postgresql://localhost/db';
      process.env.SESSION_SECRET = 'a'.repeat(32);
      process.env.GITHUB_CLIENT_ID = 'test';
      process.env.GITHUB_CLIENT_SECRET = 'test';
      process.env.NEXT_PUBLIC_REOWN_PROJECT_ID = 'test';
      process.env.NEXT_PUBLIC_APP_URL = 'not-a-url';

      const result = validateEnv();
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'NEXT_PUBLIC_APP_URL must be a valid URL'
      );
    });

    it('should require REDIS_URL in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_URL = 'postgresql://localhost/db';
      process.env.SESSION_SECRET = 'a'.repeat(32);
      process.env.GITHUB_CLIENT_ID = 'test';
      process.env.GITHUB_CLIENT_SECRET = 'test';
      process.env.NEXT_PUBLIC_REOWN_PROJECT_ID = 'test';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      // REDIS_URL is missing

      const result = validateEnv();
      expect(result.valid).toBe(false);
    });

    it('should not require REDIS_URL in development', () => {
      process.env.NODE_ENV = 'development';
      process.env.DATABASE_URL = 'postgresql://localhost/db';
      process.env.SESSION_SECRET = 'a'.repeat(32);
      process.env.GITHUB_CLIENT_ID = 'test';
      process.env.GITHUB_CLIENT_SECRET = 'test';
      process.env.NEXT_PUBLIC_REOWN_PROJECT_ID = 'test';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      // REDIS_URL is missing but that's OK in dev

      const result = validateEnv();
      expect(result.valid).toBe(true);
    });
  });

  describe('getEnv', () => {
    it('should return environment variable value', () => {
      process.env.TEST_VAR = 'test-value';
      expect(getEnv('TEST_VAR')).toBe('test-value');
    });

    it('should throw error for missing variable', () => {
      expect(() => getEnv('NON_EXISTENT_VAR')).toThrow();
    });
  });

  describe('getOptionalEnv', () => {
    it('should return value if set', () => {
      process.env.OPTIONAL_VAR = 'value';
      expect(getOptionalEnv('OPTIONAL_VAR')).toBe('value');
    });

    it('should return default value if not set', () => {
      expect(getOptionalEnv('NON_EXISTENT', 'default')).toBe('default');
    });

    it('should return empty string if not set and no default', () => {
      expect(getOptionalEnv('NON_EXISTENT')).toBe('');
    });
  });

  describe('environment checks', () => {
    it('should detect production environment', () => {
      process.env.NODE_ENV = 'production';
      expect(isProduction()).toBe(true);
      expect(isDevelopment()).toBe(false);
      expect(isTest()).toBe(false);
    });

    it('should detect development environment', () => {
      process.env.NODE_ENV = 'development';
      expect(isProduction()).toBe(false);
      expect(isDevelopment()).toBe(true);
      expect(isTest()).toBe(false);
    });

    it('should detect test environment', () => {
      process.env.NODE_ENV = 'test';
      expect(isProduction()).toBe(false);
      expect(isDevelopment()).toBe(false);
      expect(isTest()).toBe(true);
    });
  });
});

