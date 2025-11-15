/**
 * GitHub repository domain model
 */

import type { GitHubRepository } from '../types';

export class RepositoryModel {
  constructor(private repo: GitHubRepository) {}

  get id(): number {
    return this.repo.id;
  }

  get name(): string {
    return this.repo.name;
  }

  get fullName(): string {
    return this.repo.full_name;
  }

  get isPopular(): boolean {
    return this.repo.stargazers_count >= 100;
  }

  get isActive(): boolean {
    const daysSinceUpdate = this.getDaysSinceUpdate();
    return daysSinceUpdate < 30;
  }

  getDaysSinceUpdate(): number {
    const updated = new Date(this.repo.updated_at);
    const now = new Date();
    const diff = now.getTime() - updated.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  getEngagementScore(): number {
    const { stargazers_count, forks_count, watchers_count, open_issues_count } = this.repo;
    
    return (
      stargazers_count * 1.0 +
      forks_count * 1.5 +
      watchers_count * 0.5 +
      open_issues_count * 0.1
    );
  }

  toJSON(): GitHubRepository {
    return this.repo;
  }
}

