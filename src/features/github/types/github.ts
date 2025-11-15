/**
 * GitHub integration type definitions
 */

export interface GitHubUser {
  id: number;
  login: string;
  name?: string;
  avatar_url: string;
  bio?: string;
  location?: string;
  email?: string;
  blog?: string;
  company?: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  url: string;
  html_url: string;
  homepage?: string;
  language?: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  private: boolean;
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
  url: string;
  html_url: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body?: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at?: string;
  merged_at?: string;
  user: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body?: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at?: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
  html_url: string;
}

export interface GitHubStats {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  totalForks: number;
  languageDistribution: Record<string, number>;
  contributionStreak: number;
  mostActiveRepo: string;
}

export interface GitHubAPIResponse<T> {
  data: T;
  rateLimit: {
    limit: number;
    remaining: number;
    reset: number;
  };
}

