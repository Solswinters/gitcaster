/**
 * Collaboration feature constants
 */

export const TEAM_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export const CONNECTION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export const INVITATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;

export const INVITE_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days
export const MAX_TEAM_SIZE = 50;
export const MAX_CONNECTIONS = 500;

