/**
 * Hook for career progression tracking
 */

import { useState, useEffect } from 'react';
import type { CareerTrajectory, ProgressionData } from '../types';
import { CareerProgressionTracker } from '../services';

export function useCareerProgression(userId?: string) {
  const [trajectory, setTrajectory] = useState<CareerTrajectory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/analytics/career-progression/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch career progression data');
        }

        const data: ProgressionData = await response.json();
        const result = CareerProgressionTracker.analyzeProgression(data);
        setTrajectory(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { trajectory, loading, error };
}

