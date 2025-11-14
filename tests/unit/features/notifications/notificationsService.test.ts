import { notificationsService } from '@/features/notifications/services/notificationsService';

describe('NotificationsService', () => {
  it('sends notifications', async () => {
    const notification = {
      userId: 'user1',
      title: 'Test Notification',
      message: 'This is a test',
    };

    const result = await notificationsService.send(notification);
    expect(result).toBeTruthy();
  });

  it('retrieves user notifications', async () => {
    const notifications = await notificationsService.getForUser('user1');
    expect(Array.isArray(notifications)).toBe(true);
  });

  it('marks notifications as read', async () => {
    const result = await notificationsService.markAsRead('notification1');
    expect(result).toBeTruthy();
  });
});

