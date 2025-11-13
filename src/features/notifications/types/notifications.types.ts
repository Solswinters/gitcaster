/**
 * Notifications Feature Types
 */

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'mention'
  | 'follow'
  | 'like'
  | 'comment'
  | 'team_invite'
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  actor?: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    types: NotificationType[];
  };
  push: {
    enabled: boolean;
    types: NotificationType[];
  };
  inApp: {
    enabled: boolean;
    types: NotificationType[];
  };
}

export interface NotificationFilter {
  type?: NotificationType[];
  isRead?: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
}

