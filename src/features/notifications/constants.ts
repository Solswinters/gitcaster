/**
 * Notification feature constants
 */

export const NOTIFICATION_TYPES = {
  CONNECTION_REQUEST: 'connection_request',
  CONNECTION_ACCEPTED: 'connection_accepted',
  TEAM_INVITE: 'team_invite',
  MENTION: 'mention',
  ACHIEVEMENT: 'achievement',
  SYSTEM: 'system',
  UPDATE: 'update',
} as const;

export const DEFAULT_NOTIFICATION_LIMIT = 20;
export const MAX_NOTIFICATIONS_DISPLAY = 99;

