/**
 * Profile update hook
 */

import { useState } from 'react';
import type { Profile } from '../types';

export function useProfileUpdate() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProfile = async (profileId: string, updates: Partial<Profile>) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/features/profile/${profileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setError(null);
      return updatedProfile;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  return { updateProfile, updating, error };
}

