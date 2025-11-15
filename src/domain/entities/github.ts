/**
 * GitHub API Types
 * 
 * Type definitions for GitHub API responses and data structures
 */

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
  repository?: {
    name: string;
    full_name: string;
  };
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface LanguageStats {
  language: string;
  percentage: number;
  bytes: number;
  color: string;
}

export interface GitHubStats {
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  languages: LanguageStats[];
  contributionGraph: ContributionDay[];
  topRepositories: GitHubRepo[];
  recentActivity: Array<GitHubCommit | GitHubPullRequest | GitHubIssue>;
}

/**
 * Type guard to check if activity item is a commit
 */
export function isGitHubCommit(
  item: GitHubCommit | GitHubPullRequest | GitHubIssue
): item is GitHubCommit {
  return 'sha' in item && 'commit' in item;
}

/**
 * Type guard to check if activity item is a pull request
 */
export function isGitHubPullRequest(
  item: GitHubCommit | GitHubPullRequest | GitHubIssue
): item is GitHubPullRequest {
  return 'merged_at' in item && 'number' in item;
}

/**
 * Type guard to check if activity item is an issue
 */
export function isGitHubIssue(
  item: GitHubCommit | GitHubPullRequest | GitHubIssue
): item is GitHubIssue {
  return 'closed_at' in item && 'number' in item && !('merged_at' in item);
}

