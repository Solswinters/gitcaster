/**
 * Collaboration Service
 */

import { apiClient } from '@/shared/services/apiClient';
import type {
  Team,
  TeamMember,
  TeamInvitation,
  CreateTeamInput,
  UpdateTeamInput,
  InviteTeamMemberInput,
  NetworkConnection,
  TeamActivity,
} from '../types/collaboration.types';

export class CollaborationService {
  /**
   * Get user's teams
   */
  async getUserTeams(): Promise<Team[]> {
    return await apiClient.get<Team[]>('/api/collaboration/teams');
  }

  /**
   * Get team by ID
   */
  async getTeam(teamId: string): Promise<Team> {
    return await apiClient.get<Team>(`/api/collaboration/teams/${teamId}`);
  }

  /**
   * Create a new team
   */
  async createTeam(data: CreateTeamInput): Promise<Team> {
    return await apiClient.post<Team>('/api/collaboration/teams', data);
  }

  /**
   * Update team
   */
  async updateTeam(teamId: string, data: UpdateTeamInput): Promise<Team> {
    return await apiClient.put<Team>(`/api/collaboration/teams/${teamId}`, data);
  }

  /**
   * Delete team
   */
  async deleteTeam(teamId: string): Promise<void> {
    await apiClient.delete(`/api/collaboration/teams/${teamId}`);
  }

  /**
   * Get team members
   */
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    return await apiClient.get<TeamMember[]>(`/api/collaboration/teams/${teamId}/members`);
  }

  /**
   * Invite team member
   */
  async inviteTeamMember(teamId: string, data: InviteTeamMemberInput): Promise<TeamInvitation> {
    return await apiClient.post<TeamInvitation>(
      `/api/collaboration/teams/${teamId}/invitations`,
      data
    );
  }

  /**
   * Remove team member
   */
  async removeTeamMember(teamId: string, memberId: string): Promise<void> {
    await apiClient.delete(`/api/collaboration/teams/${teamId}/members/${memberId}`);
  }

  /**
   * Accept team invitation
   */
  async acceptInvitation(invitationId: string): Promise<void> {
    await apiClient.post(`/api/collaboration/invitations/${invitationId}/accept`, {});
  }

  /**
   * Decline team invitation
   */
  async declineInvitation(invitationId: string): Promise<void> {
    await apiClient.post(`/api/collaboration/invitations/${invitationId}/decline`, {});
  }

  /**
   * Get network connections
   */
  async getNetworkConnections(): Promise<NetworkConnection[]> {
    return await apiClient.get<NetworkConnection[]>('/api/collaboration/network');
  }

  /**
   * Follow user
   */
  async followUser(userId: string): Promise<void> {
    await apiClient.post(`/api/collaboration/network/${userId}/follow`, {});
  }

  /**
   * Unfollow user
   */
  async unfollowUser(userId: string): Promise<void> {
    await apiClient.delete(`/api/collaboration/network/${userId}/follow`);
  }

  /**
   * Get team activity
   */
  async getTeamActivity(teamId: string, limit: number = 20): Promise<TeamActivity[]> {
    return await apiClient.get<TeamActivity[]>(
      `/api/collaboration/teams/${teamId}/activity?limit=${limit}`
    );
  }
}

export const collaborationService = new CollaborationService();

