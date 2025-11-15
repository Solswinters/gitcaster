/**
 * Collaboration feature type definitions
 */

export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
}

export interface Network {
  id: string;
  userId: string;
  connections: Connection[];
  followers: number;
  following: number;
}

export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Invitation {
  id: string;
  teamId: string;
  inviterId: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

