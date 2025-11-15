/**
 * GitHub user data hook
 */

import { useState, useEffect } from 'react';
import type { GitHubUser } from '../types';
import { GitHubClient } from '../services';

export function useGitHubUser(username?: string) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const client = new GitHubClient();
        const userData = await client.getUser(username);
        setUser(userData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  return { user, loading, error };
}

