/**
 * Profile Hook
 * 
 * Custom hook for managing profile data
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../services/profileService';
import { UserProfile, ProfileUpdateRequest } from '../types/profile.types';

export function useProfile(slug: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profileData = await profileService.getProfile(slug);
      setProfile(profileData);
      
      // Track view
      await profileService.trackView(slug);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  const updateProfile = useCallback(async (updates: ProfileUpdateRequest) => {
    try {
      const updated = await profileService.updateProfile(slug, updates);
      setProfile(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      loadProfile();
    }
  }, [slug, loadProfile]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile: loadProfile,
  };
}

