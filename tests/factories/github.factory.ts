/**
 * GitHub Mock Factory
 * 
 * Factory functions for creating mock GitHub data.
 */

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  html_url: string;
}

let repoIdCounter = 1;

/**
 * Build a GitHub repository
 */
export function buildGitHubRepository(
  overrides?: Partial<GitHubRepository>
): GitHubRepository {
  const id = overrides?.id || repoIdCounter++;
  const name = overrides?.name || `repo-${id}`;
  
  return {
    id,
    name,
    full_name: `user/${name}`,
    description: `Description for ${name}`,
    stargazers_count: Math.floor(Math.random() * 100),
    forks_count: Math.floor(Math.random() * 50),
    language: 'TypeScript',
    updated_at: new Date().toISOString(),
    html_url: `https://github.com/user/${name}`,
    ...overrides,
  };
}

/**
 * Build multiple GitHub repositories
 */
export function buildGitHubRepositories(
  count: number,
  overrides?: Partial<GitHubRepository>
): GitHubRepository[] {
  return Array.from({ length: count }, () => buildGitHubRepository(overrides));
}

/**
 * Build GitHub user stats
 */
export function buildGitHubStats(overrides?: any) {
  return {
    totalRepos: 25,
    totalStars: 500,
    totalForks: 125,
    totalCommits: 2000,
    followers: 100,
    following: 50,
    contributions: 1000,
    mostUsedLanguages: ['TypeScript', 'JavaScript', 'Python'],
    ...overrides,
  };
}

/**
 * Build GitHub user data
 */
export function buildGitHubUser(overrides?: any) {
  return {
    login: 'testuser',
    id: 12345,
    avatar_url: 'https://avatars.githubusercontent.com/u/12345',
    html_url: 'https://github.com/testuser',
    name: 'Test User',
    company: 'Test Company',
    blog: 'https://testuser.dev',
    location: 'San Francisco',
    email: 'test@example.com',
    bio: 'Test bio',
    public_repos: 25,
    followers: 100,
    following: 50,
    created_at: '2020-01-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Reset factory counter
 */
export function resetGitHubFactory() {
  repoIdCounter = 1;
}

