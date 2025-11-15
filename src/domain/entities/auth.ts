/**
 * Authentication Types
 * 
 * Type definitions for authentication and session management
 */

export interface Session {
  isLoggedIn: boolean;
  walletAddress: string | null;
  userId: string | null;
  githubConnected: boolean;
  hasGithubToken: boolean;
  expiresAt: number | null;
}

export interface AuthenticationStatus {
  isAuthenticated: boolean;
  walletAddress: string | null;
  userId: string | null;
}

export interface SignInRequest {
  message: string;
  signature: string;
  address: string;
}

export interface NonceResponse {
  nonce: string;
}

export interface VerifyResponse {
  success: boolean;
  userId?: string;
  error?: string;
}

export interface GitHubAuthCallback {
  code: string;
  state?: string;
}

export type AuthProvider = 'wallet' | 'email' | 'social';

export type WalletType = 'eoa' | 'smart_contract';

/**
 * Type guard to check if user is authenticated
 */
export function isAuthenticated(session: Session): boolean {
  return session.isLoggedIn && !!session.walletAddress;
}

/**
 * Type guard to check if session is expired
 */
export function isSessionExpired(session: Session): boolean {
  if (!session.expiresAt) return false;
  return Date.now() > session.expiresAt;
}

/**
 * Type guard to check if GitHub is connected
 */
export function hasGitHubConnection(session: Session): boolean {
  return session.githubConnected && session.hasGithubToken;
}

