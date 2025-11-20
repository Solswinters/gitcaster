/**
 * GitHub Service
 * 
 * Service layer for GitHub API interactions with caching and sync management
 */

import { GitHubSyncRequest, GitHubSyncResponse } from '../types/github.types';
import { createError, ErrorCode, handleError } from '@/shared/utils/errors';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  createdAt: string;
  closedAt: string | null;
  mergedAt: string | null;
  repository: string;
}

interface Contribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface SyncProgress {
  step: string;
  progress: number;
  total: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

/**
 * GitHub Service Class
 */
export class GitHubService {
  private static instance: GitHubService;
  private baseUrl = '/api';
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private syncListeners: Set<(progress: SyncProgress) => void> = new Set();

  private constructor() {}

  static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  /**
   * Get cached data or fetch
   */
  private async getCachedOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    useCache: boolean = true,
  ): Promise<T> {
    if (useCache) {
      const cached = this.cache.get(key);
      const now = Date.now();

      if (cached && cached.expiresAt > now) {
        return cached.data as T;
      }
    }

    const data = await fetcher();
    const now = Date.now();

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION,
    });

    return data;
  }

  /**
   * Clear cache
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Add sync progress listener
   */
  onSyncProgress(callback: (progress: SyncProgress) => void): () => void {
    this.syncListeners.add(callback);
    return () => this.syncListeners.delete(callback);
  }

  /**
   * Notify sync progress
   */
  private notifySyncProgress(progress: SyncProgress): void {
    this.syncListeners.forEach((listener) => listener(progress));
  }

  /**
   * Sync GitHub data for the authenticated user
   */
  async syncGitHubData(request: GitHubSyncRequest = {}): Promise<GitHubSyncResponse> {
    try {
      this.notifySyncProgress({
        step: 'Starting sync',
        progress: 0,
        total: 100,
        status: 'in_progress',
      });

      const response = await fetch(`${this.baseUrl}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        this.notifySyncProgress({
          step: 'Sync failed',
          progress: 0,
          total: 100,
          status: 'failed',
        });
        throw createError(
          error.message || 'Failed to sync GitHub data',
          ErrorCode.GITHUB_API_ERROR,
          response.status
        );
      }

      const result = await response.json();

      this.notifySyncProgress({
        step: 'Sync completed',
        progress: 100,
        total: 100,
        status: 'completed',
      });

      // Clear cache after sync
      this.clearCache();

      return result;
    } catch (error) {
      this.notifySyncProgress({
        step: 'Sync error',
        progress: 0,
        total: 100,
        status: 'failed',
      });
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

  /**
   * Get user repositories
   */
  async getRepositories(useCache: boolean = true): Promise<Repository[]> {
    const cacheKey = 'repositories';

    return this.getCachedOrFetch(
      cacheKey,
      async () => {
        const response = await fetch(`${this.baseUrl}/github/repositories`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw createError(
            'Failed to fetch repositories',
            ErrorCode.GITHUB_API_ERROR,
            response.status
          );
        }

        return await response.json();
      },
      useCache,
    );
  }

  /**
   * Get repository by name
   */
  async getRepository(owner: string, repo: string): Promise<Repository> {
    try {
      const response = await fetch(
        `${this.baseUrl}/github/repositories/${owner}/${repo}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw createError(
          'Failed to fetch repository',
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
   * Get user pull requests
   */
  async getPullRequests(useCache: boolean = true): Promise<PullRequest[]> {
    const cacheKey = 'pull-requests';

    return this.getCachedOrFetch(
      cacheKey,
      async () => {
        const response = await fetch(`${this.baseUrl}/github/pull-requests`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw createError(
            'Failed to fetch pull requests',
            ErrorCode.GITHUB_API_ERROR,
            response.status
          );
        }

        return await response.json();
      },
      useCache,
    );
  }

  /**
   * Get contribution activity
   */
  async getContributions(
    year?: number,
    useCache: boolean = true,
  ): Promise<Contribution[]> {
    const cacheKey = `contributions:${year || 'current'}`;

    return this.getCachedOrFetch(
      cacheKey,
      async () => {
        const url = year
          ? `${this.baseUrl}/github/contributions?year=${year}`
          : `${this.baseUrl}/github/contributions`;

        const response = await fetch(url, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw createError(
            'Failed to fetch contributions',
            ErrorCode.GITHUB_API_ERROR,
            response.status
          );
        }

        return await response.json();
      },
      useCache,
    );
  }

  /**
   * Get user statistics
   */
  async getStatistics(useCache: boolean = true): Promise<{
    totalCommits: number;
    totalPullRequests: number;
    totalIssues: number;
    totalStars: number;
    totalForks: number;
    totalRepositories: number;
    languageDistribution: Record<string, number>;
  }> {
    const cacheKey = 'statistics';

    return this.getCachedOrFetch(
      cacheKey,
      async () => {
        const response = await fetch(`${this.baseUrl}/github/statistics`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw createError(
            'Failed to fetch statistics',
            ErrorCode.GITHUB_API_ERROR,
            response.status
          );
        }

        return await response.json();
      },
      useCache,
    );
  }

  /**
   * Search repositories
   */
  async searchRepositories(query: string, filters?: {
    language?: string;
    stars?: number;
    isPrivate?: boolean;
  }): Promise<Repository[]> {
    try {
      const params = new URLSearchParams({ q: query });

      if (filters?.language) {
        params.set('language', filters.language);
      }
      if (filters?.stars !== undefined) {
        params.set('minStars', filters.stars.toString());
      }
      if (filters?.isPrivate !== undefined) {
        params.set('private', filters.isPrivate.toString());
      }

      const response = await fetch(
        `${this.baseUrl}/github/search/repositories?${params.toString()}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw createError(
          'Failed to search repositories',
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
   * Get trending repositories by language
   */
  async getTrendingRepositories(language?: string): Promise<Repository[]> {
    try {
      const url = language
        ? `${this.baseUrl}/github/trending?language=${language}`
        : `${this.baseUrl}/github/trending`;

      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw createError(
          'Failed to fetch trending repositories',
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
   * Trigger webhook refresh
   */
  async refreshWebhook(repositoryId: number): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/github/webhooks/refresh/${repositoryId}`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw createError(
          'Failed to refresh webhook',
          ErrorCode.GITHUB_API_ERROR,
          response.status
        );
      }
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Force sync specific data type
   */
  async forceSyncData(dataType: 'repositories' | 'pull-requests' | 'contributions'): Promise<void> {
    try {
      this.notifySyncProgress({
        step: `Syncing ${dataType}`,
        progress: 0,
        total: 100,
        status: 'in_progress',
      });

      const response = await fetch(`${this.baseUrl}/sync/${dataType}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw createError(
          `Failed to sync ${dataType}`,
          ErrorCode.GITHUB_API_ERROR,
          response.status
        );
      }

      // Clear specific cache
      this.clearCache(dataType);

      this.notifySyncProgress({
        step: `${dataType} synced`,
        progress: 100,
        total: 100,
        status: 'completed',
      });
    } catch (error) {
      this.notifySyncProgress({
        step: `Failed to sync ${dataType}`,
        progress: 0,
        total: 100,
        status: 'failed',
      });
      throw handleError(error);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStatistics(): {
    size: number;
    keys: string[];
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    const now = Date.now();
    let oldestEntry: number | null = null;
    let newestEntry: number | null = null;

    for (const [, entry] of this.cache) {
      if (oldestEntry === null || entry.timestamp < oldestEntry) {
        oldestEntry = entry.timestamp;
      }
      if (newestEntry === null || entry.timestamp > newestEntry) {
        newestEntry = entry.timestamp;
      }
    }

    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      oldestEntry,
      newestEntry,
    };
  }

  /**
   * Prefetch common data
   */
  async prefetchData(): Promise<void> {
    await Promise.all([
      this.getRepositories(false),
      this.getPullRequests(false),
      this.getStatistics(false),
    ]);
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
export const getGitHubRepositories = (useCache?: boolean) =>
  githubService.getRepositories(useCache);
export const getGitHubRepository = (owner: string, repo: string) =>
  githubService.getRepository(owner, repo);
export const getGitHubPullRequests = (useCache?: boolean) =>
  githubService.getPullRequests(useCache);
export const getGitHubContributions = (year?: number, useCache?: boolean) =>
  githubService.getContributions(year, useCache);
export const getGitHubStatistics = (useCache?: boolean) =>
  githubService.getStatistics(useCache);
export const searchGitHubRepositories = (
  query: string,
  filters?: { language?: string; stars?: number; isPrivate?: boolean }
) => githubService.searchRepositories(query, filters);
export const forceSyncGitHubData = (
  dataType: 'repositories' | 'pull-requests' | 'contributions'
) => githubService.forceSyncData(dataType);
export const prefetchGitHubData = () => githubService.prefetchData();
export const clearGitHubCache = (key?: string) => githubService.clearCache(key);
export const onGitHubSyncProgress = (callback: (progress: SyncProgress) => void) =>
  githubService.onSyncProgress(callback);

