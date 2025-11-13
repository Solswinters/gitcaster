/**
 * Notifications Hooks
 */

import { useAsync } from '@/shared/hooks/useAsync';
import { notificationsService } from '../services/notificationsService';
import type { NotificationFilter, NotificationPreferences } from '../types/notifications.types';
import { useInterval } from '@/shared/hooks/useInterval';
import { useState } from 'react';

/**
 * Hook for fetching notifications
 */
export function useNotifications(filter?: NotificationFilter) {
  return useAsync(
    async () => notificationsService.getNotifications(filter),
    {
      immediate: true,
    }
  );
}

/**
 * Hook for notification statistics
 */
export function useNotificationStats() {
  return useAsync(
    async () => notificationsService.getStats(),
    {
      immediate: true,
    }
  );
}

/**
 * Hook for notification preferences
 */
export function useNotificationPreferences() {
  return useAsync(
    async () => notificationsService.getPreferences(),
    {
      immediate: true,
    }
  );
}

/**
 * Hook for notification actions
 */
export function useNotificationActions() {
  const { execute: markAsRead } = useAsync(
    async (id: string) => notificationsService.markAsRead(id)
  );

  const { execute: markAllAsRead } = useAsync(
    async () => notificationsService.markAllAsRead()
  );

  const { execute: deleteNotification } = useAsync(
    async (id: string) => notificationsService.deleteNotification(id)
  );

  const { execute: clearAll } = useAsync(
    async () => notificationsService.clearAll()
  );

  const { execute: updatePreferences } = useAsync(
    async (prefs: NotificationPreferences) =>
      notificationsService.updatePreferences(prefs)
  );

  return {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    updatePreferences,
  };
}

/**
 * Hook for real-time notifications with polling
 */
export function useRealTimeNotifications(pollInterval: number = 30000) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Poll for new notifications
  useInterval(fetchNotifications, pollInterval);

  return {
    notifications,
    unreadCount,
    refresh: fetchNotifications,
  };
}

