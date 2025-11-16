/**
 * Notification feature type definitions
 */

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
  readAt?: Date;
}

export type NotificationType = 
  | 'connection_request'
  | 'connection_accepted'
  | 'team_invite'
  | 'mention'
  | 'achievement'
  | 'system'
  | 'update';

export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  types: {
    [K in NotificationType]: boolean;
  };
}

export interface NotificationBadge {
  count: number;
  hasUnread: boolean;
}

