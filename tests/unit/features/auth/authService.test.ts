/**
 * Auth Service Tests
 */

import { AuthService } from '@/features/auth/services/authService';

// Mock fetch globally
global.fetch = jest.fn();

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = AuthService.getInstance();
    jest.clearAllMocks();
  });

  describe('getNonce', () => {
    it('should fetch nonce successfully', async () => {
      const mockNonce = 'test-nonce-123';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ nonce: mockNonce }),
      });

      const result = await authService.getNonce('0x123');

      expect(result).toBe(mockNonce);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/nonce',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ address: '0x123' }),
        })
      );
    });

    it('should handle error response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(authService.getNonce('0x123')).rejects.toThrow();
    });
  });

  describe('getSession', () => {
    it('should fetch session successfully', async () => {
      const mockSession = {
        isLoggedIn: true,
        walletAddress: '0x123',
        userId: 'user-123',
        githubConnected: true,
        hasGithubToken: true,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSession,
      });

      const result = await authService.getSession();

      expect(result).toEqual(mockSession);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/session',
        expect.objectContaining({
          credentials: 'include',
        })
      );
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await authService.logout();

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/logout',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      );
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when authenticated', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          isLoggedIn: true,
          walletAddress: '0x123',
        }),
      });

      const result = await authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when not authenticated', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          isLoggedIn: false,
          walletAddress: null,
        }),
      });

      const result = await authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
});

