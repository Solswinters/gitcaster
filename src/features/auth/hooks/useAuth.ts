/**
 * Authentication Hook
 * 
 * Custom hook for managing authentication state
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { Session } from '@/shared/types';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const sessionData = await authService.getSession();
      setSession(sessionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setSession(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
      throw err;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    await loadSession();
  }, [loadSession]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return {
    session,
    isAuthenticated: session?.isLoggedIn ?? false,
    walletAddress: session?.walletAddress ?? null,
    isLoading,
    error,
    logout,
    refreshSession,
  };
}

