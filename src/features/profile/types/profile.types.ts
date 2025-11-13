/**
 * Profile Feature Types
 * 
 * Type definitions specific to the profile feature
 */

import {
  UserProfile,
  ProfileSettings,
  ProfileCompleteness,
  ProfileMetadata,
} from '@/shared/types';
import { GitHubStats } from '@/shared/types';

// Re-export shared types
export type {
  UserProfile,
  ProfileSettings,
  ProfileCompleteness,
  ProfileMetadata,
};

/**
 * Profile state for UI
 */
export interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  completeness: ProfileCompleteness | null;
}

/**
 * Profile update request
 */
export interface ProfileUpdateRequest {
  displayName?: string;
  bio?: string;
  location?: string;
  company?: string;
  website?: string;
  avatarUrl?: string;
  isPublic?: boolean;
}

/**
 * Profile creation request
 */
export interface ProfileCreateRequest {
  walletAddress: string;
  displayName?: string;
  bio?: string;
}

/**
 * Profile view event
 */
export interface ProfileView {
  profileId: string;
  viewedAt: string;
  viewerAddress?: string;
}

/**
 * Profile analytics
 */
export interface ProfileAnalytics {
  totalViews: number;
  uniqueViews: number;
  viewsByDate: Record<string, number>;
  topReferrers: Array<{
    source: string;
    count: number;
  }>;
}

/**
 * Profile export format
 */
export type ProfileExportFormat = 'json' | 'pdf' | 'markdown';

/**
 * Profile export options
 */
export interface ProfileExportOptions {
  format: ProfileExportFormat;
  includeStats: boolean;
  includeActivity: boolean;
  includeRepositories: boolean;
}

