/**
 * Environment variable validation
 * Ensures all required environment variables are set before app starts
 */

interface EnvConfig {
  name: string;
  value: string | undefined;
  required: boolean;
  description?: string;
}

const envVars: EnvConfig[] = [
  // Database
  {
    name: 'DATABASE_URL',
    value: process.env.DATABASE_URL,
    required: true,
    description: 'PostgreSQL database connection URL',
  },

  // Session
  {
    name: 'SESSION_SECRET',
    value: process.env.SESSION_SECRET,
    required: true,
    description: 'Secret key for session encryption (minimum 32 characters)',
  },

  // GitHub OAuth
  {
    name: 'GITHUB_CLIENT_ID',
    value: process.env.GITHUB_CLIENT_ID,
    required: true,
    description: 'GitHub OAuth application client ID',
  },
  {
    name: 'GITHUB_CLIENT_SECRET',
    value: process.env.GITHUB_CLIENT_SECRET,
    required: true,
    description: 'GitHub OAuth application client secret',
  },

  // Reown/WalletConnect
  {
    name: 'NEXT_PUBLIC_REOWN_PROJECT_ID',
    value: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
    required: true,
    description: 'Reown project ID for Web3 authentication',
  },

  // App URL
  {
    name: 'NEXT_PUBLIC_APP_URL',
    value: process.env.NEXT_PUBLIC_APP_URL,
    required: true,
    description: 'Public URL of the application',
  },

  // Talent Protocol (optional)
  {
    name: 'TALENT_PROTOCOL_API_KEY',
    value: process.env.TALENT_PROTOCOL_API_KEY,
    required: false,
    description: 'Talent Protocol API key (optional)',
  },

  // Redis (optional in development)
  {
    name: 'REDIS_URL',
    value: process.env.REDIS_URL,
    required: process.env.NODE_ENV === 'production',
    description: 'Redis connection URL for caching (required in production)',
  },
];

/**
 * Validate environment variables
 */
export function validateEnv(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const envVar of envVars) {
    if (envVar.required && !envVar.value) {
      errors.push(
        `Missing required environment variable: ${envVar.name}${
          envVar.description ? ` (${envVar.description})` : ''
        }`
      );
    }

    // Additional validation for specific variables
    if (envVar.name === 'SESSION_SECRET' && envVar.value) {
      if (envVar.value.length < 32) {
        errors.push(
          'SESSION_SECRET must be at least 32 characters long for security'
        );
      }
    }

    if (envVar.name === 'DATABASE_URL' && envVar.value) {
      if (!envVar.value.startsWith('postgresql://') && !envVar.value.startsWith('postgres://')) {
        errors.push(
          'DATABASE_URL must be a valid PostgreSQL connection string'
        );
      }
    }

    if (envVar.name === 'NEXT_PUBLIC_APP_URL' && envVar.value) {
      try {
        new URL(envVar.value);
      } catch {
        errors.push('NEXT_PUBLIC_APP_URL must be a valid URL');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate and throw error if invalid
 */
export function validateEnvOrThrow(): void {
  const { valid, errors } = validateEnv();

  if (!valid) {
    console.error('\n❌ Environment validation failed:\n');
    errors.forEach((error) => {
      console.error(`  - ${error}`);
    });
    console.error('\nPlease check your .env.local file and ensure all required variables are set.\n');
    throw new Error('Invalid environment configuration');
  }

  console.log('✅ Environment validation passed');
}

/**
 * Get environment variable with type safety
 */
export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

/**
 * Get optional environment variable
 */
export function getOptionalEnv(name: string, defaultValue: string = ''): string {
  return process.env[name] || defaultValue;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in test
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

