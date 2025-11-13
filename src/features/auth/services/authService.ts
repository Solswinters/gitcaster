/**
 * Authentication Service
 * 
 * Core authentication logic and API calls
 */

import { Session, NonceResponse, VerifyResponse } from '@/shared/types';
import { createError, ErrorCode, handleError } from '@/shared/utils/errors';

/**
 * Authentication Service Class
 */
export class AuthService {
  private static instance: AuthService;
  private baseUrl = '/api/auth';

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Get authentication nonce for signing
   */
  async getNonce(address: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/nonce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw createError(
          'Failed to get nonce',
          ErrorCode.AUTH_ERROR,
          response.status
        );
      }

      const data: NonceResponse = await response.json();
      return data.nonce;
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Verify signature and create session
   */
  async verifySignature(
    address: string,
    signature: string,
    message: string
  ): Promise<VerifyResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature, message }),
      });

      if (!response.ok) {
        throw createError(
          'Failed to verify signature',
          ErrorCode.AUTH_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Get current session
   */
  async getSession(): Promise<Session> {
    try {
      const response = await fetch(`${this.baseUrl}/session`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw createError(
          'Failed to get session',
          ErrorCode.AUTH_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Logout and clear session
   */
  async logout(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw createError(
          'Failed to logout',
          ErrorCode.AUTH_ERROR,
          response.status
        );
      }
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const session = await this.getSession();
      return session.isLoggedIn && !!session.walletAddress;
    } catch {
      return false;
    }
  }

  /**
   * Refresh session
   */
  async refreshSession(): Promise<Session> {
    return this.getSession();
  }
}

/**
 * Singleton instance export
 */
export const authService = AuthService.getInstance();

/**
 * Convenience functions
 */
export const getNonce = (address: string) => authService.getNonce(address);
export const verifySignature = (address: string, signature: string, message: string) =>
  authService.verifySignature(address, signature, message);
export const getSession = () => authService.getSession();
export const logout = () => authService.logout();
export const isAuthenticated = () => authService.isAuthenticated();

