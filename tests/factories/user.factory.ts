/**
 * User Mock Factory
 * 
 * Factory functions for creating mock user data.
 */

import type { UserProfile } from '@/domain/entities';

let userIdCounter = 1;

/**
 * Build a complete user profile
 */
export function buildUserProfile(overrides?: Partial<UserProfile>): UserProfile {
  const id = overrides?.id || `user-${userIdCounter++}`;
  const slug = overrides?.slug || `user-${id}`;
  
  return {
    id,
    slug,
    displayName: `User ${id}`,
    bio: `Bio for ${id}`,
    avatarUrl: `https://example.com/avatars/${id}.jpg`,
    location: 'San Francisco, CA',
    company: 'Acme Corp',
    website: `https://${slug}.example.com`,
    walletAddress: `0x${id.padEnd(40, '0')}`,
    githubUsername: slug,
    talentScore: 75 + Math.floor(Math.random() * 25),
    isPublic: true,
    viewCount: Math.floor(Math.random() * 1000),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Build multiple user profiles
 */
export function buildUserProfiles(count: number, overrides?: Partial<UserProfile>): UserProfile[] {
  return Array.from({ length: count }, () => buildUserProfile(overrides));
}

/**
 * Build a user profile with minimal data
 */
export function buildMinimalUserProfile(overrides?: Partial<UserProfile>): UserProfile {
  const id = overrides?.id || `user-${userIdCounter++}`;
  
  return {
    id,
    slug: `user-${id}`,
    displayName: `User ${id}`,
    bio: null,
    avatarUrl: null,
    location: null,
    company: null,
    website: null,
    walletAddress: `0x${id.padEnd(40, '0')}`,
    githubUsername: null,
    talentScore: null,
    isPublic: false,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Build a complete user profile with GitHub data
 */
export function buildUserWithGitHub(overrides?: Partial<UserProfile>): UserProfile {
  return buildUserProfile({
    githubUsername: 'octocat',
    talentScore: 90,
    githubStats: {
      totalRepos: 50,
      totalStars: 1000,
      totalForks: 250,
      totalCommits: 5000,
      followers: 500,
      following: 100,
      contributions: 2000,
      mostUsedLanguages: ['TypeScript', 'JavaScript', 'Python'],
    } as any,
    ...overrides,
  });
}

/**
 * Reset factory counter (useful between tests)
 */
export function resetUserFactory() {
  userIdCounter = 1;
}

