/**
 * Auth configuration
 */

export const authConfig = {
  sessionDuration: parseInt(process.env.SESSION_DURATION || '86400000'), // 24 hours
  refreshTokenDuration: parseInt(process.env.REFRESH_TOKEN_DURATION || '604800000'), // 7 days
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  passwordMinLength: 8,
  passwordMaxLength: 128,
  enableEmailAuth: process.env.ENABLE_EMAIL_AUTH !== 'false',
  enableWalletAuth: process.env.ENABLE_WALLET_AUTH !== 'false',
  enableGitHubAuth: process.env.ENABLE_GITHUB_AUTH !== 'false',
  githubClientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  githubCallbackUrl: process.env.NEXT_PUBLIC_GITHUB_CALLBACK_URL || '',
} as const;

