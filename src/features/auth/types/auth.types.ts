/**
 * Authentication Feature Types
 * 
 * Type definitions specific to the authentication feature
 */

import { Session, AuthenticationStatus } from '@/shared/types';

export type { Session, AuthenticationStatus };

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  error: string | null;
}

export interface AuthUser {
  id: string;
  walletAddress: string;
  githubUsername: string | null;
  hasGithubToken: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error';

export interface AuthContext {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

