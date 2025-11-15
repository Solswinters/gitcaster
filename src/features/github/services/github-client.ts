/**
 * GitHub API client service
 */

import type { GitHubUser, GitHubRepository, GitHubCommit, GitHubAPIResponse } from '../types';

export class GitHubClient {
  private baseUrl = 'https://api.github.com';
  private token?: string;

  constructor(token?: string) {
    this.token = token;
  }

  /**
   * Get user information
   */
  async getUser(username: string): Promise<GitHubUser> {
    const response = await this.fetch(`/users/${username}`);
    return response.data;
  }

  /**
   * Get user repositories
   */
  async getUserRepositories(username: string): Promise<GitHubRepository[]> {
    const response = await this.fetch(`/users/${username}/repos?sort=updated&per_page=100`);
    return response.data;
  }

  /**
   * Get repository commits
   */
  async getRepositoryCommits(owner: string, repo: string): Promise<GitHubCommit[]> {
    const response = await this.fetch(`/repos/${owner}/${repo}/commits?per_page=100`);
    return response.data;
  }

  /**
   * Search users
   */
  async searchUsers(query: string): Promise<GitHubUser[]> {
    const response = await this.fetch(`/search/users?q=${encodeURIComponent(query)}`);
    return response.data.items;
  }

  /**
   * Get user contribution stats
   */
  async getUserStats(username: string): Promise<any> {
    const [user, repos] = await Promise.all([
      this.getUser(username),
      this.getUserRepositories(username),
    ]);

    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    
    const languages: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    return {
      totalRepos: user.public_repos,
      totalStars,
      totalForks,
      followers: user.followers,
      following: user.following,
      languages,
    };
  }

  /**
   * Make authenticated request to GitHub API
   */
  private async fetch<T = any>(endpoint: string): Promise<GitHubAPIResponse<T>> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rateLimit = {
      limit: parseInt(response.headers.get('X-RateLimit-Limit') || '60'),
      remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '60'),
      reset: parseInt(response.headers.get('X-RateLimit-Reset') || '0'),
    };

    return { data, rateLimit };
  }
}

