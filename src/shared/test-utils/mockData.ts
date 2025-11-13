/**
 * Mock Data for Testing
 * 
 * Reusable mock data generators for tests
 */

import { UserProfile, GitHubRepo, GitHubUser, GitHubStats } from '../types';

export const mockGitHubUser: GitHubUser = {
  login: 'testuser',
  id: 12345,
  avatar_url: 'https://avatar.example.com/test.png',
  name: 'Test User',
  company: 'Test Company',
  blog: 'https://test.com',
  location: 'Test City',
  email: 'test@example.com',
  bio: 'Test bio',
  public_repos: 50,
  public_gists: 10,
  followers: 100,
  following: 50,
  created_at: '2020-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockGitHubRepo: GitHubRepo = {
  id: 1,
  name: 'test-repo',
  full_name: 'testuser/test-repo',
  description: 'A test repository',
  html_url: 'https://github.com/testuser/test-repo',
  homepage: 'https://test-repo.com',
  stargazers_count: 100,
  forks_count: 20,
  language: 'TypeScript',
  topics: ['testing', 'example'],
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  pushed_at: '2024-01-15T00:00:00Z',
};

export const mockGitHubStats: GitHubStats = {
  publicRepos: 50,
  totalStars: 500,
  totalForks: 100,
  totalCommits: 1000,
  totalPRs: 50,
  totalIssues: 30,
  languages: [
    { language: 'TypeScript', percentage: 60, bytes: 60000, color: '#2b7489' },
    { language: 'JavaScript', percentage: 30, bytes: 30000, color: '#f1e05a' },
    { language: 'Python', percentage: 10, bytes: 10000, color: '#3572A5' },
  ],
  contributionGraph: [],
  topRepositories: [mockGitHubRepo],
  recentActivity: [],
};

export const mockUserProfile: UserProfile = {
  id: 'user-123',
  slug: '0x1234567890123456789012345678901234567890',
  displayName: 'Test User',
  bio: 'A test user profile',
  avatarUrl: 'https://avatar.example.com/test.png',
  location: 'Test City',
  company: 'Test Company',
  website: 'https://test.com',
  walletAddress: '0x1234567890123456789012345678901234567890',
  githubUsername: 'testuser',
  talentScore: 85,
  isPublic: true,
  viewCount: 100,
  githubStats: mockGitHubStats,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

export function createMockProfile(overrides?: Partial<UserProfile>): UserProfile {
  return {
    ...mockUserProfile,
    ...overrides,
  };
}

export function createMockRepo(overrides?: Partial<GitHubRepo>): GitHubRepo {
  return {
    ...mockGitHubRepo,
    ...overrides,
  };
}

export function createMockGitHubUser(overrides?: Partial<GitHubUser>): GitHubUser {
  return {
    ...mockGitHubUser,
    ...overrides,
  };
}

