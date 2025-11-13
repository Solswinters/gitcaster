/**
 * Cache Key Generators
 * 
 * Standardized cache key generation for consistency
 */

/**
 * Generate cache key for user profile
 */
export function userProfileKey(userId: string): string {
  return `user:profile:${userId}`;
}

/**
 * Generate cache key for GitHub data
 */
export function githubDataKey(username: string): string {
  return `github:data:${username}`;
}

/**
 * Generate cache key for search results
 */
export function searchResultsKey(query: string, filters?: Record<string, any>): string {
  const filterStr = filters ? JSON.stringify(filters) : '';
  return `search:results:${query}:${filterStr}`;
}

/**
 * Generate cache key for API response
 */
export function apiResponseKey(endpoint: string, params?: Record<string, any>): string {
  const paramStr = params ? JSON.stringify(params) : '';
  return `api:${endpoint}:${paramStr}`;
}

/**
 * Generate cache key for Talent Protocol data
 */
export function talentDataKey(passportId: string): string {
  return `talent:data:${passportId}`;
}

/**
 * Generate cache key for analytics
 */
export function analyticsKey(userId: string, metric: string, period: string): string {
  return `analytics:${userId}:${metric}:${period}`;
}

/**
 * Generate cache key for repository data
 */
export function repositoryKey(owner: string, repo: string): string {
  return `repo:${owner}:${repo}`;
}

/**
 * Generate cache key for user stats
 */
export function userStatsKey(userId: string): string {
  return `user:stats:${userId}`;
}

/**
 * Clear all cache keys matching a pattern
 */
export function generateCachePattern(prefix: string): RegExp {
  return new RegExp(`^${prefix}:`);
}

