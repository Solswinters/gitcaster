/**
 * Common test mocks
 */

export const mockUser = {
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
};

export const mockProfile = {
  id: 'test-profile-id',
  userId: 'test-user-id',
  bio: 'Test bio',
  skills: ['TypeScript', 'React'],
};

export const mockNotification = {
  id: 'test-notification-id',
  userId: 'test-user-id',
  type: 'system' as const,
  title: 'Test Notification',
  message: 'Test message',
  read: false,
  createdAt: new Date(),
};

export const mockTeam = {
  id: 'test-team-id',
  name: 'Test Team',
  description: 'A test team',
  ownerId: 'test-user-id',
  members: [],
  createdAt: new Date(),
};

