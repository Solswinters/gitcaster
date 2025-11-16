/**
 * Notification bell component
 */

'use client';

import { useNotifications } from '../hooks';

interface NotificationBellProps {
  userId?: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const { unreadCount } = useNotifications(userId);

  return (
    <button className="relative p-2 hover:bg-secondary rounded">
      <span className="text-2xl">🔔</span>
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

