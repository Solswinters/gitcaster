/**
 * Environment Variables
 *
 * Centralized and validated environment variables
 */

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnvVar(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

export const env = {
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // URLs
  NEXTAUTH_URL: getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
  API_URL: getOptionalEnvVar('API_URL', 'http://localhost:3000/api'),
  
  // Auth
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET'),
  GITHUB_CLIENT_ID: getEnvVar('GITHUB_CLIENT_ID'),
  GITHUB_CLIENT_SECRET: getEnvVar('GITHUB_CLIENT_SECRET'),
  
  // Database
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  
  // Web3
  NEXT_PUBLIC_PROJECT_ID: getEnvVar('NEXT_PUBLIC_PROJECT_ID'),
  
  // External APIs
  TALENT_PROTOCOL_API_KEY: getOptionalEnvVar('TALENT_PROTOCOL_API_KEY'),
  
  // Features
  ENABLE_ANALYTICS: getOptionalEnvVar('ENABLE_ANALYTICS', 'true') === 'true',
  ENABLE_CACHE: getOptionalEnvVar('ENABLE_CACHE', 'true') === 'true',
} as const;

