/**
 * Team data hook
 */

import { useState, useEffect } from 'react';
import type { Team } from '../types';

export function useTeam(teamId?: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!teamId) {
      setLoading(false);
      return;
    }

    const fetchTeam = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/features/collaboration/teams/${teamId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch team');
        }

        const data = await response.json();
        setTeam(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch team'));
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  return { team, loading, error };
}

