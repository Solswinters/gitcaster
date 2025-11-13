/**
 * Profile Service
 * 
 * Service layer for profile operations
 */

import { UserProfile } from '../types/profile.types';
import { createError, ErrorCode, handleError } from '@/shared/utils/errors';
import type { ProfileUpdateRequest } from '../types/profile.types';

/**
 * Profile Service Class
 */
export class ProfileService {
  private static instance: ProfileService;
  private baseUrl = '/api/profile';

  private constructor() {}

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  /**
   * Get profile by slug
   */
  async getProfile(slug: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/${slug}`);

      if (!response.ok) {
        throw createError(
          'Profile not found',
          ErrorCode.NOT_FOUND,
          response.status
        );
      }

      const data = await response.json();
      return data.profile;
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Update profile
   */
  async updateProfile(slug: string, updates: ProfileUpdateRequest): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw createError(
          'Failed to update profile',
          ErrorCode.API_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Get current user's profile
   */
  async getMyProfile(): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw createError(
          'Failed to get profile',
          ErrorCode.API_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      throw handleError(error);
    }
  }

  /**
   * Track profile view
   */
  async trackView(slug: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/${slug}/view`, {
        method: 'POST',
      });
    } catch (error) {
      // Silently fail view tracking
      console.error('Failed to track profile view:', error);
    }
  }

  /**
   * Get profile completeness
   */
  async getCompleteness(slug: string): Promise<{
    percentage: number;
    missingFields: string[];
  }> {
    try {
      const profile = await this.getProfile(slug);
      
      const fields = [
        { key: 'displayName', label: 'Display Name' },
        { key: 'bio', label: 'Bio' },
        { key: 'avatarUrl', label: 'Profile Picture' },
        { key: 'location', label: 'Location' },
        { key: 'company', label: 'Company' },
        { key: 'githubUsername', label: 'GitHub Connection' },
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

      return {
        percentage: Math.round((completed.length / fields.length) * 100),
        missingFields: missing,
      };
    } catch (error) {
      throw handleError(error);
    }
  }
}

/**
 * Singleton instance export
 */
export const profileService = ProfileService.getInstance();

/**
 * Convenience functions
 */
export const getProfile = (slug: string) => profileService.getProfile(slug);
export const updateProfile = (slug: string, updates: ProfileUpdateRequest) =>
  profileService.updateProfile(slug, updates);
export const getMyProfile = () => profileService.getMyProfile();
export const trackProfileView = (slug: string) => profileService.trackView(slug);
export const getProfileCompleteness = (slug: string) =>
  profileService.getCompleteness(slug);

