/**
 * GitHub Feature Types
 * 
 * Type definitions specific to the GitHub integration feature
 */

import {
  GitHubUser,
  GitHubRepo,
  GitHubCommit,
  GitHubPullRequest,
  GitHubIssue,
  GitHubStats,
  LanguageStats,
  ContributionDay,
} from '@/shared/types';

// Re-export shared types
export type {
  GitHubUser,
  GitHubRepo,
  GitHubCommit,
  GitHubPullRequest,
  GitHubIssue,
  GitHubStats,
  LanguageStats,
  ContributionDay,
};

/**
 * GitHub sync status
 */
export interface GitHubSyncStatus {
  isSyncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;
  progress: number;
}

/**
 * GitHub sync request
 */
export interface GitHubSyncRequest {
  githubToken?: string;
  forceRefresh?: boolean;
}

/**
 * GitHub sync response
 */
export interface GitHubSyncResponse {
  success: boolean;
  message: string;
  stats?: GitHubStats;
  error?: string;
}

/**
 * GitHub OAuth callback data
 */
export interface GitHubOAuthCallback {
  code: string;
  state?: string;
}

/**
 * GitHub rate limit info
 */
export interface GitHubRateLimit {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

/**
 * GitHub API error
 */
export interface GitHubError {
  message: string;
  documentation_url?: string;
  status?: number;
}

/**
 * Repository filter options
 */
export interface RepositoryFilters {
  language?: string;
  minStars?: number;
  maxStars?: number;
  type?: 'all' | 'owner' | 'member';
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
}

/**
 * Activity filter options
 */
export interface ActivityFilters {
  type?: 'all' | 'commits' | 'prs' | 'issues';
  startDate?: string;
  endDate?: string;
  repository?: string;
}

