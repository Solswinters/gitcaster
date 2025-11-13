/**
 * Profile Helpers Tests
 */

import {
  getDisplayName,
  getCompletionPercentage,
  isProfileComplete,
  calculateProfileScore,
  getProfileRating,
} from '@/features/profile/utils/profileHelpers';
import { createMockProfile } from '@/shared/test-utils';

describe('Profile Helpers', () => {
  describe('getDisplayName', () => {
    it('should return display name when available', () => {
      const profile = createMockProfile({ displayName: 'John Doe' });
      expect(getDisplayName(profile)).toBe('John Doe');
    });

    it('should fallback to github username', () => {
      const profile = createMockProfile({
        displayName: null,
        githubUsername: 'johndoe',
      });
      expect(getDisplayName(profile)).toBe('johndoe');
    });

    it('should fallback to wallet address', () => {
      const profile = createMockProfile({
        displayName: null,
        githubUsername: null,
        walletAddress: '0x1234567890123456789012345678901234567890',
      });
      expect(getDisplayName(profile)).toBe('0x1234...7890');
    });
  });

  describe('getCompletionPercentage', () => {
    it('should calculate completion for full profile', () => {
      const profile = createMockProfile({
        displayName: 'John',
        bio: 'Test bio',
        avatarUrl: 'https://avatar.com/test.png',
        location: 'Test City',
        company: 'Test Co',
        website: 'https://test.com',
        githubUsername: 'test',
        talentScore: 85,
      });

      expect(getCompletionPercentage(profile)).toBe(100);
    });

    it('should calculate partial completion', () => {
      const profile = createMockProfile({
        displayName: 'John',
        bio: null,
        avatarUrl: null,
        location: null,
        company: null,
        website: null,
        githubUsername: null,
        talentScore: null,
      });

      expect(getCompletionPercentage(profile)).toBeGreaterThan(0);
      expect(getCompletionPercentage(profile)).toBeLessThan(100);
    });
  });

  describe('isProfileComplete', () => {
    it('should return true for complete profile', () => {
      const profile = createMockProfile({
        displayName: 'John',
        bio: 'Test bio',
        githubUsername: 'test',
      });

      expect(isProfileComplete(profile)).toBe(true);
    });

    it('should return false for incomplete profile', () => {
      const profile = createMockProfile({
        displayName: null,
        bio: null,
      });

      expect(isProfileComplete(profile)).toBe(false);
    });
  });

  describe('calculateProfileScore', () => {
    it('should calculate high score for complete profile with activity', () => {
      const profile = createMockProfile({
        displayName: 'John',
        bio: 'Test',
        githubStats: {
          publicRepos: 50,
          totalStars: 1000,
          totalCommits: 5000,
          totalPRs: 100,
          totalForks: 0,
          totalIssues: 0,
          languages: [],
          contributionGraph: [],
          topRepositories: [],
          recentActivity: [],
        },
        talentScore: 90,
      });

      const score = calculateProfileScore(profile);
      expect(score).toBeGreaterThan(70);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should calculate lower score for minimal profile', () => {
      const profile = createMockProfile({
        displayName: null,
        bio: null,
        githubStats: undefined,
        talentScore: null,
      });

      const score = calculateProfileScore(profile);
      expect(score).toBeLessThan(30);
    });
  });

  describe('getProfileRating', () => {
    it('should return Excellent for high scores', () => {
      const profile = createMockProfile();
      // Mock high score calculation
      jest.spyOn({ calculateProfileScore }, 'calculateProfileScore').mockReturnValue(85);
      
      expect(getProfileRating(profile)).toBe('Excellent');
    });

    it('should return Poor for low scores', () => {
      const profile = createMockProfile({
        displayName: null,
        bio: null,
        githubStats: undefined,
      });

      expect(getProfileRating(profile)).toBe('Poor');
    });
  });
});

