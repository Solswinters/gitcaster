/**
 * Offline status indicator component
 */

'use client';

import { usePWA } from '../hooks';

export function OfflineIndicator() {
  const { offlineStatus } = usePWA();

  if (!offlineStatus.isOffline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-warning text-warning-foreground px-4 py-2 text-center text-sm z-50">
      <span className="mr-2">📡</span>
      You're offline. Some features may be limited.
    </div>
  );
}

