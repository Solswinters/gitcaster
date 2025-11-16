/**
 * Notifications configuration
 */

export const notificationsConfig = {
  enabled: process.env.ENABLE_NOTIFICATIONS !== 'false',
  pushEnabled: process.env.ENABLE_PUSH_NOTIFICATIONS !== 'false',
  emailEnabled: process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'false',
  defaultLimit: parseInt(process.env.NOTIFICATIONS_DEFAULT_LIMIT || '20'),
  maxDisplayCount: parseInt(process.env.NOTIFICATIONS_MAX_DISPLAY || '99'),
  pollingInterval: parseInt(process.env.NOTIFICATIONS_POLLING_INTERVAL || '30000'), // ms
} as const;

