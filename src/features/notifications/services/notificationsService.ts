/**
 * Notifications Service
 */

import { apiClient } from '@/shared/services/apiClient';
import type {
  Notification,
  NotificationPreferences,
  NotificationFilter,
  NotificationStats,
} from '../types/notifications.types';

export class NotificationsService {
  /**
   * Get user notifications
   */
  async getNotifications(filter?: NotificationFilter): Promise<Notification[]> {
    const params = new URLSearchParams();
    
    if (filter) {
      if (filter.type) params.set('type', filter.type.join(','));
      if (filter.isRead !== undefined) params.set('isRead', filter.isRead.toString());
      if (filter.startDate) params.set('startDate', filter.startDate.toString());
      if (filter.endDate) params.set('endDate', filter.endDate.toString());
    }

    const query = params.toString();
    const url = `/api/notifications${query ? `?${query}` : ''}`;

    return await apiClient.get<Notification[]>(url);
  }

  /**
   * Get notification statistics
   */
  async getStats(): Promise<NotificationStats> {
    return await apiClient.get<NotificationStats>('/api/notifications/stats');
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.put(`/api/notifications/${notificationId}/read`, {});
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.put('/api/notifications/read-all', {});
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/api/notifications/${notificationId}`);
  }

  /**
   * Clear all notifications
   */
  async clearAll(): Promise<void> {
    await apiClient.delete('/api/notifications');
  }

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<NotificationPreferences> {
    return await apiClient.get<NotificationPreferences>('/api/notifications/preferences');
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: NotificationPreferences): Promise<NotificationPreferences> {
    return await apiClient.put<NotificationPreferences>(
      '/api/notifications/preferences',
      preferences
    );
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(subscription: PushSubscription): Promise<void> {
    await apiClient.post('/api/notifications/push/subscribe', {
      subscription: subscription.toJSON(),
    });
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPush(): Promise<void> {
    await apiClient.post('/api/notifications/push/unsubscribe', {});
  }
}

export const notificationsService = new NotificationsService();

