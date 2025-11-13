/**
 * GitHub Service
 * 
 * Service layer for GitHub API interactions
 */

import { GitHubSyncRequest, GitHubSyncResponse } from '../types/github.types';
import { createError, ErrorCode, handleError } from '@/shared/utils/errors';

/**
 * GitHub Service Class
 */
export class GitHubService {
  private static instance: GitHubService;
  private baseUrl = '/api';

  private constructor() {}

  static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  /**
   * Sync GitHub data for the authenticated user
   */
  async syncGitHubData(request: GitHubSyncRequest = {}): Promise<GitHubSyncResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw createError(
          error.message || 'Failed to sync GitHub data',
          ErrorCode.GITHUB_API_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Initiate GitHub OAuth flow
   */
  initiateOAuth(redirectUri?: string): void {
    const params = new URLSearchParams({
      redirect_uri: redirectUri || `${window.location.origin}/api/github/callback`,
    });

    window.location.href = `/api/github/auth?${params.toString()}`;
  }

  /**
   * Check GitHub connection status
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/session`, {
        credentials: 'include',
      });

      if (!response.ok) {
        return false;
      }

      const session = await response.json();
      return session.githubConnected && session.hasGithubToken;
    } catch {
      return false;
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<{ isSyncing: boolean; lastSyncedAt: string | null }> {
    try {
      const response = await fetch(`${this.baseUrl}/sync/status`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw createError(
          'Failed to get sync status',
          ErrorCode.GITHUB_API_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      throw handleError(error);
    }
  }
}

/**
 * Singleton instance export
 */
export const githubService = GitHubService.getInstance();

/**
 * Convenience functions
 */
export const syncGitHubData = (request?: GitHubSyncRequest) =>
  githubService.syncGitHubData(request);
export const initiateGitHubOAuth = (redirectUri?: string) =>
  githubService.initiateOAuth(redirectUri);
export const checkGitHubConnection = () => githubService.checkConnection();
export const getGitHubSyncStatus = () => githubService.getSyncStatus();

