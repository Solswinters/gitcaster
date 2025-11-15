/**
 * Domain Layer Testing Utilities
 * 
 * Utilities for testing domain entities, validators, and business logic.
 */

import type { UserProfile } from '@/domain/entities';

/**
 * Create a mock user profile for testing
 */
export function createMockUserProfile(overrides?: Partial<UserProfile>): UserProfile {
  return {
    id: 'test-user-id',
    slug: 'test-user',
    displayName: 'Test User',
    bio: 'Test bio',
    avatarUrl: 'https://example.com/avatar.jpg',
    location: 'Test City',
    company: 'Test Company',
    website: 'https://example.com',
    walletAddress: '0x1234567890123456789012345678901234567890',
    githubUsername: 'testuser',
    talentScore: 85,
    isPublic: true,
    viewCount: 100,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

/**
 * Create minimal valid user profile
 */
export function createMinimalUserProfile(overrides?: Partial<UserProfile>): UserProfile {
  return {
    id: 'test-user-id',
    slug: 'test-user',
    displayName: 'Test User',
    bio: null,
    avatarUrl: null,
    location: null,
    company: null,
    website: null,
    walletAddress: '0x1234567890123456789012345678901234567890',
    githubUsername: null,
    talentScore: null,
    isPublic: false,
    viewCount: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

/**
 * Assert validation result has expected errors
 */
export function expectValidationErrors(
  result: { isValid: boolean; errors: string[] },
  expectedErrors: string[]
): void {
  expect(result.isValid).toBe(false);
  expect(result.errors).toHaveLength(expectedErrors.length);
  expectedErrors.forEach(error => {
    expect(result.errors).toContain(error);
  });
}

/**
 * Assert validation result is successful
 */
export function expectValidationSuccess(result: { isValid: boolean; errors: string[] }): void {
  expect(result.isValid).toBe(true);
  expect(result.errors).toHaveLength(0);
}

