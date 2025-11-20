/**
 * Authentication service with session management
 */

import type { User, Session, LoginCredentials, RegisterData, WalletAuthData } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface SessionValidation {
  isValid: boolean;
  session?: Session;
  error?: string;
}

export class AuthService {
  private static sessionCache = new Map<string, Session>();
  private static sessionExpiryCheckInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize auth service and start session expiry checks
   */
  static initialize(): void {
    if (typeof window !== 'undefined' && !this.sessionExpiryCheckInterval) {
      this.sessionExpiryCheckInterval = setInterval(() => {
        this.cleanExpiredSessions();
      }, 60000); // Check every minute
    }
  }

  /**
   * Clean up expired sessions from cache
   */
  private static cleanExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessionCache.entries()) {
      if (new Date(session.expiresAt).getTime() < now) {
        this.sessionCache.delete(sessionId);
      }
    }
  }

  /**
   * Login with email and password
   */
  static async loginWithEmail(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data: AuthResponse = await response.json();
      this.cacheSession(data.session);
      
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  /**
   * Register new user
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const result: AuthResponse = await response.json();
      this.cacheSession(result.session);
      
      return result;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  /**
   * Authenticate with wallet (SIWE)
   */
  static async authenticateWallet(data: WalletAuthData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Wallet authentication failed');
      }

      const result: AuthResponse = await response.json();
      this.cacheSession(result.session);
      
      return result;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Wallet authentication failed');
    }
  }

  /**
   * Logout user
   */
  static async logout(sessionId: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
        credentials: 'include',
      });

      this.sessionCache.delete(sessionId);
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('session');
        sessionStorage.removeItem('session');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Refresh session with refresh token
   */
  static async refreshSession(refreshToken: string): Promise<Session> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Session refresh failed');
      }

      const { session } = await response.json();
      this.cacheSession(session);
      
      return session;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Session refresh failed');
    }
  }

  /**
   * Verify session validity
   */
  static async verifySession(sessionId: string): Promise<SessionValidation> {
    // Check cache first
    const cached = this.sessionCache.get(sessionId);
    if (cached && new Date(cached.expiresAt).getTime() > Date.now()) {
      return { isValid: true, session: cached };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
        credentials: 'include',
      });

      if (!response.ok) {
        return { isValid: false, error: 'Session invalid' };
      }

      const { session } = await response.json();
      this.cacheSession(session);
      
      return { isValid: true, session };
    } catch (error) {
      return { 
        isValid: false, 
        error: error instanceof Error ? error.message : 'Verification failed' 
      };
    }
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(sessionId: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionId}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }

      const { user } = await response.json();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Cache session for quick access
   */
  private static cacheSession(session: Session): void {
    this.sessionCache.set(session.id, session);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('session', JSON.stringify(session));
      } catch (error) {
        console.warn('Failed to cache session in localStorage:', error);
      }
    }
  }

  /**
   * Load session from storage
   */
  static loadSessionFromStorage(): Session | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const stored = localStorage.getItem('session');
      if (!stored) {
        return null;
      }

      const session: Session = JSON.parse(stored);
      
      // Check if expired
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        localStorage.removeItem('session');
        return null;
      }

      this.cacheSession(session);
      return session;
    } catch (error) {
      console.error('Failed to load session from storage:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const session = this.loadSessionFromStorage();
    return session !== null && new Date(session.expiresAt).getTime() > Date.now();
  }

  /**
   * Clean up resources
   */
  static cleanup(): void {
    if (this.sessionExpiryCheckInterval) {
      clearInterval(this.sessionExpiryCheckInterval);
      this.sessionExpiryCheckInterval = null;
    }
    this.sessionCache.clear();
  }
}

