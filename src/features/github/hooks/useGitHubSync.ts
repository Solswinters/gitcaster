/**
 * GitHub Sync Hook
 * 
 * Custom hook for managing GitHub data synchronization
 */

'use client';

import { useState, useCallback } from 'react';
import { githubService } from '../services/githubService';
import { GitHubSyncResponse } from '../types/github.types';

export function useGitHubSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const sync = useCallback(async (githubToken?: string) => {
    try {
      setIsSyncing(true);
      setError(null);
      
      const response: GitHubSyncResponse = await githubService.syncGitHubData({
        githubToken,
        forceRefresh: true,
      });

      if (response.success) {
        setLastSyncedAt(new Date().toISOString());
        return response;
      } else {
        throw new Error(response.error || 'Sync failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync GitHub data';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const checkConnection = useCallback(async () => {
    return await githubService.checkConnection();
  }, []);

  return {
    sync,
    isSyncing,
    error,
    lastSyncedAt,
    checkConnection,
  };
}

