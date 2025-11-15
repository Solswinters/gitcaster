/**
 * Authentication hook
 */

import { useState, useEffect, useCallback } from 'react';
import type { User, Session } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check for existing session
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      verifySession(sessionId);
    } else {
      setLoading(false);
    }
  }, []);

  const verifySession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/features/auth/session/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setSession(data.session);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Session verification failed'));
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/features/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      setSession(data.session);
      localStorage.setItem('sessionId', data.session.id);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (session) {
        await fetch(`/api/features/auth/logout/${session.id}`, { method: 'POST' });
      }
      setUser(null);
      setSession(null);
      localStorage.removeItem('sessionId');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, [session]);

  return {
    user,
    session,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
