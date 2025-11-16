/**
 * Notification service tests
 */

import { describe, it, expect } from '@jest/globals';
import { NotificationService } from '../services/notification-service';

describe('NotificationService', () => {
  it('should create notification', async () => {
    const notification = await NotificationService.createNotification({
      userId: 'test-user',
      type: 'system',
      title: 'Test',
      message: 'Test message',
      read: false,
    });
    expect(notification).toBeDefined();
    expect(notification.id).toBeDefined();
  });

  it('should get unread count', async () => {
    const count = await NotificationService.getUnreadCount('test-user');
    expect(typeof count).toBe('number');
  });
});

