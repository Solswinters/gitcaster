/**
 * User Profile Types
 * 
 * Type definitions for user profiles and related data
 */

import { GitHubStats } from './github';

export interface UserProfile {
  id: string;
  slug: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  company: string | null;
  website: string | null;
  walletAddress: string;
  githubUsername: string | null;
  talentScore: number | null;
  isPublic: boolean;
  viewCount: number;
  githubStats?: GitHubStats;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileSettings {
  isPublic: boolean;
  showEmail: boolean;
  showLocation: boolean;
  showCompany: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface ProfileCompleteness {
  percentage: number;
  missingFields: string[];
  suggestions: string[];
}

export interface ProfileMetadata {
  lastSyncedAt: string | null;
  githubConnected: boolean;
  talentProtocolConnected: boolean;
}

/**
 * Type guard to check if profile is complete
 */
export function isProfileComplete(profile: UserProfile): boolean {
  return !!(
    profile.displayName &&
    profile.bio &&
    profile.githubUsername &&
    profile.githubStats
  );
}

/**
 * Calculate profile completeness percentage
 */
export function calculateProfileCompleteness(profile: UserProfile): ProfileCompleteness {
  const fields = [
    { key: 'displayName', label: 'Display Name' },
    { key: 'bio', label: 'Bio' },
    { key: 'avatarUrl', label: 'Profile Picture' },
    { key: 'location', label: 'Location' },
    { key: 'company', label: 'Company' },
    { key: 'githubUsername', label: 'GitHub Connection' },
    { key: 'githubStats', label: 'GitHub Data' },
    { key: 'talentScore', label: 'Talent Protocol Score' },
  ];

  const completed = fields.filter(field => {
    const value = profile[field.key as keyof UserProfile];
    return value !== null && value !== undefined && value !== '';
  });

  const missing = fields
    .filter(field => {
      const value = profile[field.key as keyof UserProfile];
      return value === null || value === undefined || value === '';
    })
    .map(field => field.label);

  const percentage = Math.round((completed.length / fields.length) * 100);

  return {
    percentage,
    missingFields: missing,
    suggestions: missing.length > 0 
      ? [`Complete your ${missing[0]} to improve your profile`]
      : ['Your profile is complete!'],
  };
}

