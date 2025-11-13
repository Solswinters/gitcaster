/**
 * API Configuration
 *
 * @module shared/services/apiConfig
 */

export interface APIConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  withCredentials?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * Default API configuration
 */
export const defaultAPIConfig: APIConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  retryAttempts: 3,
  retryDelay: 1000,
};

/**
 * GitHub API configuration
 */
export const githubAPIConfig: Partial<APIConfig> = {
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
  },
};

/**
 * Talent Protocol API configuration
 */
export const talentAPIConfig: Partial<APIConfig> = {
  baseURL: process.env.NEXT_PUBLIC_TALENT_API_URL || 'https://api.talentprotocol.com',
  headers: {
    'X-API-KEY': process.env.NEXT_PUBLIC_TALENT_API_KEY || '',
  },
};

/**
 * Create API configuration
 */
export function createAPIConfig(overrides?: Partial<APIConfig>): APIConfig {
  return {
    ...defaultAPIConfig,
    ...overrides,
    headers: {
      ...defaultAPIConfig.headers,
      ...overrides?.headers,
    },
  };
}

