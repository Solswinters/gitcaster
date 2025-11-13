/**
 * Collaboration Hooks
 */

import { useAsync } from '@/shared/hooks/useAsync';
import { collaborationService } from '../services/collaborationService';
import type { CreateTeamInput, InviteTeamMemberInput } from '../types/collaboration.types';

/**
 * Hook for user's teams
 */
export function useUserTeams() {
  return useAsync(
    async () => collaborationService.getUserTeams(),
    {
      immediate: true,
    }
  );
}

/**
 * Hook for team details
 */
export function useTeam(teamId: string) {
  return useAsync(
    async () => collaborationService.getTeam(teamId),
    {
      immediate: !!teamId,
    }
  );
}

/**
 * Hook for team members
 */
export function useTeamMembers(teamId: string) {
  return useAsync(
    async () => collaborationService.getTeamMembers(teamId),
    {
      immediate: !!teamId,
    }
  );
}

/**
 * Hook for network connections
 */
export function useNetworkConnections() {
  return useAsync(
    async () => collaborationService.getNetworkConnections(),
    {
      immediate: true,
    }
  );
}

/**
 * Hook for team activity
 */
export function useTeamActivity(teamId: string, limit?: number) {
  return useAsync(
    async () => collaborationService.getTeamActivity(teamId, limit),
    {
      immediate: !!teamId,
    }
  );
}

/**
 * Hook for team management actions
 */
export function useTeamActions() {
  const { execute: createTeam, isLoading: isCreating } = useAsync(
    async (data: CreateTeamInput) => collaborationService.createTeam(data)
  );

  const { execute: inviteMember, isLoading: isInviting } = useAsync(
    async (teamId: string, data: InviteTeamMemberInput) =>
      collaborationService.inviteTeamMember(teamId, data)
  );

  const { execute: removeMember, isLoading: isRemoving } = useAsync(
    async (teamId: string, memberId: string) =>
      collaborationService.removeTeamMember(teamId, memberId)
  );

  const { execute: deleteTeam, isLoading: isDeleting } = useAsync(
    async (teamId: string) => collaborationService.deleteTeam(teamId)
  );

  return {
    createTeam,
    inviteMember,
    removeMember,
    deleteTeam,
    isCreating,
    isInviting,
    isRemoving,
    isDeleting,
  };
}

