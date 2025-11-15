/**
 * GitHub Repository Interface
 * 
 * Defines the contract for GitHub data access operations.
 */

import type { GitHubStats } from '../entities';

export interface IGitHubRepository {
  /**
   * Fetch GitHub stats for a user
   */
  getStats(username: string): Promise<GitHubStats | null>;

  /**
   * Sync GitHub data for a user
   */
  syncUserData(username: string, accessToken: string): Promise<void>;

  /**
   * Get repositories for a user
   */
  getRepositories(username: string, page: number, pageSize: number): Promise<any[]>;

  /**
   * Get contribution data
   */
  getContributions(username: string): Promise<any>;

  /**
   * Cache GitHub data
   */
  cacheData(key: string, data: any, ttl: number): Promise<void>;

  /**
   * Get cached GitHub data
   */
  getCachedData(key: string): Promise<any | null>;
}

