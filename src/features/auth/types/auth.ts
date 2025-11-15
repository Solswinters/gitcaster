/**
 * Auth feature type definitions
 */

export interface User {
  id: string;
  email?: string;
  walletAddress?: string;
  githubUsername?: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  refreshToken?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName?: string;
}

export interface WalletAuthData {
  address: string;
  signature: string;
  message: string;
}

export interface AuthProvider {
  type: 'email' | 'wallet' | 'github';
  id: string;
  metadata?: Record<string, any>;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

