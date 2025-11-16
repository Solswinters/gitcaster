/**
 * Notification utility helpers
 */

import type { Notification, NotificationType } from '../types';

export function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    connection_request: '👤',
    connection_accepted: '✅',
    team_invite: '👥',
    mention: '@',
    achievement: '🏆',
    system: 'ℹ️',
    update: '🔔',
  };

  return icons[type] || '🔔';
}

export function getNotificationColor(type: NotificationType): string {
  const colors: Record<NotificationType, string> = {
    connection_request: 'blue',
    connection_accepted: 'green',
    team_invite: 'purple',
    mention: 'orange',
    achievement: 'yellow',
    system: 'gray',
    update: 'blue',
  };

  return colors[type] || 'gray';
}

export function formatNotificationTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

export function groupNotificationsByDate(notifications: Notification[]): Record<string, Notification[]> {
  const groups: Record<string, Notification[]> = {};

  notifications.forEach(notification => {
    const date = new Date(notification.createdAt);
    const key = date.toDateString();
    
    if (!groups[key]) {
      groups[key] = [];
    }
    
    groups[key].push(notification);
  });

  return groups;
}

