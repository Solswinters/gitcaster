/**
 * GitHub Helper Utilities
 * 
 * Helper functions for working with GitHub data
 */

import {
  GitHubRepo,
  GitHubCommit,
  GitHubPullRequest,
  GitHubIssue,
  LanguageStats,
} from '../types/github.types';

/**
 * Calculate total stars across repositories
 */
export function calculateTotalStars(repos: GitHubRepo[]): number {
  return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
}

/**
 * Calculate total forks across repositories
 */
export function calculateTotalForks(repos: GitHubRepo[]): number {
  return repos.reduce((total, repo) => total + repo.forks_count, 0);
}

/**
 * Get top repositories by stars
 */
export function getTopReposByStars(repos: GitHubRepo[], limit = 10): GitHubRepo[] {
  return [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, limit);
}

/**
 * Get repositories by language
 */
export function getReposByLanguage(repos: GitHubRepo[], language: string): GitHubRepo[] {
  return repos.filter(
    repo => repo.language?.toLowerCase() === language.toLowerCase()
  );
}

/**
 * Calculate language statistics
 */
export function calculateLanguageStats(repos: GitHubRepo[]): LanguageStats[] {
  const languageCounts = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(languageCounts).reduce((sum, count) => sum + count, 0);

  return Object.entries(languageCounts)
    .map(([language, count]) => ({
      language,
      percentage: (count / total) * 100,
      bytes: count, // Simplified - would need actual byte counts from API
      color: getLanguageColor(language),
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

/**
 * Get language color (simplified version)
 */
export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
  };

  return colors[language] || '#808080';
}

/**
 * Format repository URL
 */
export function formatRepoUrl(fullName: string): string {
  return `https://github.com/${fullName}`;
}

/**
 * Extract username from repository full name
 */
export function extractUsername(fullName: string): string {
  return fullName.split('/')[0];
}

/**
 * Extract repo name from full name
 */
export function extractRepoName(fullName: string): string {
  return fullName.split('/')[1];
}

/**
 * Check if repository is fork
 */
export function isFork(repo: GitHubRepo): boolean {
  // Would need additional field from API
  return false; // Placeholder
}

/**
 * Get recent commits (last N days)
 */
export function getRecentCommits(
  commits: GitHubCommit[],
  days: number
): GitHubCommit[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return commits.filter(commit => {
    const commitDate = new Date(commit.commit.author.date);
    return commitDate >= cutoffDate;
  });
}

/**
 * Group commits by date
 */
export function groupCommitsByDate(
  commits: GitHubCommit[]
): Record<string, GitHubCommit[]> {
  return commits.reduce((acc, commit) => {
    const date = new Date(commit.commit.author.date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(commit);
    return acc;
  }, {} as Record<string, GitHubCommit[]>);
}

/**
 * Calculate commit frequency
 */
export function calculateCommitFrequency(
  commits: GitHubCommit[]
): { daily: number; weekly: number; monthly: number } {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    daily: commits.filter(c => new Date(c.commit.author.date) >= oneDayAgo).length,
    weekly: commits.filter(c => new Date(c.commit.author.date) >= oneWeekAgo).length,
    monthly: commits.filter(c => new Date(c.commit.author.date) >= oneMonthAgo).length,
  };
}

/**
 * Get merged pull requests
 */
export function getMergedPRs(prs: GitHubPullRequest[]): GitHubPullRequest[] {
  return prs.filter(pr => pr.merged_at !== null);
}

/**
 * Get open issues
 */
export function getOpenIssues(issues: GitHubIssue[]): GitHubIssue[] {
  return issues.filter(issue => issue.state === 'open');
}

/**
 * Get closed issues
 */
export function getClosedIssues(issues: GitHubIssue[]): GitHubIssue[] {
  return issues.filter(issue => issue.state === 'closed');
}

/**
 * Calculate issue resolution rate
 */
export function calculateIssueResolutionRate(issues: GitHubIssue[]): number {
  if (issues.length === 0) return 0;
  const closed = getClosedIssues(issues).length;
  return (closed / issues.length) * 100;
}

/**
 * Calculate average time to close issue (in days)
 */
export function calculateAvgTimeToClose(issues: GitHubIssue[]): number {
  const closedIssues = issues.filter(issue => issue.closed_at);
  
  if (closedIssues.length === 0) return 0;

  const totalTime = closedIssues.reduce((sum, issue) => {
    const created = new Date(issue.created_at).getTime();
    const closed = new Date(issue.closed_at!).getTime();
    return sum + (closed - created);
  }, 0);

  const avgMs = totalTime / closedIssues.length;
  return Math.round(avgMs / (1000 * 60 * 60 * 24)); // Convert to days
}

/**
 * Sort repositories by update date
 */
export function sortReposByUpdate(repos: GitHubRepo[]): GitHubRepo[] {
  return [...repos].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

/**
 * Filter repositories by date range
 */
export function filterReposByDateRange(
  repos: GitHubRepo[],
  startDate: string,
  endDate: string
): GitHubRepo[] {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return repos.filter(repo => {
    const created = new Date(repo.created_at);
    return created >= start && created <= end;
  });
}

