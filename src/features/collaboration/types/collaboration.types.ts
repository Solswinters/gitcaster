/**
 * Collaboration Feature Types
 */

export interface Team {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  memberCount: number;
  isPublic: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  username: string;
  avatar?: string;
  role: TeamRole;
  joinedAt: Date | string;
}

export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: TeamRole;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: Date | string;
  createdAt: Date | string;
}

export interface Collaboration {
  id: string;
  type: 'project' | 'repository' | 'team';
  title: string;
  description?: string;
  participants: CollaborationParticipant[];
  status: 'active' | 'completed' | 'archived';
  startDate: Date | string;
  endDate?: Date | string;
}

export interface CollaborationParticipant {
  userId: string;
  username: string;
  avatar?: string;
  role: string;
  contribution?: number;
}

export interface NetworkConnection {
  userId: string;
  username: string;
  avatar?: string;
  profession?: string;
  location?: string;
  connectionType: 'follower' | 'following' | 'mutual';
  connectedAt: Date | string;
}

export interface TeamActivity {
  id: string;
  teamId: string;
  userId: string;
  username: string;
  action: string;
  description: string;
  timestamp: Date | string;
  metadata?: Record<string, any>;
}

export interface CreateTeamInput {
  name: string;
  description?: string;
  isPublic: boolean;
}

export interface UpdateTeamInput {
  name?: string;
  description?: string;
  isPublic?: boolean;
  avatar?: string;
}

export interface InviteTeamMemberInput {
  email: string;
  role: TeamRole;
}

