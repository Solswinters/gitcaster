/**
 * GitHub configuration
 */

export const githubConfig = {
  apiUrl: process.env.NEXT_PUBLIC_GITHUB_API_URL || 'https://api.github.com',
  clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  token: process.env.GITHUB_TOKEN || '',
  redirectUri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || '',
  scope: 'read:user user:email repo',
  cacheEnabled: process.env.GITHUB_CACHE_ENABLED !== 'false',
  cacheDuration: parseInt(process.env.GITHUB_CACHE_DURATION || '3600'),
  rateLimitWarningThreshold: 10,
} as const;

