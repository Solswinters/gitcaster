/**
 * GitHub feature constants
 */

export const GITHUB_API_BASE = 'https://api.github.com';
export const GITHUB_BASE = 'https://github.com';

export const RATE_LIMITS = {
  AUTHENTICATED: 5000,
  UNAUTHENTICATED: 60,
} as const;

export const CONTRIBUTION_LEVELS = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  VERY_HIGH: 4,
} as const;

export const POPULAR_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'Go',
  'Rust',
  'C++',
  'Ruby',
  'PHP',
  'Swift',
] as const;

export const REPO_FILTERS = {
  ALL: 'all',
  OWNER: 'owner',
  MEMBER: 'member',
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;

export const REPO_SORT_OPTIONS = {
  CREATED: 'created',
  UPDATED: 'updated',
  PUSHED: 'pushed',
  FULL_NAME: 'full_name',
  STARS: 'stargazers_count',
} as const;

export const CACHE_DURATIONS = {
  USER: 3600, // 1 hour
  REPOS: 1800, // 30 minutes
  COMMITS: 600, // 10 minutes
} as const;

