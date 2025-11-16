/**
 * PWA hook
 */

import { useState, useEffect, useCallback } from 'react';
import type { PWAInstallPrompt, OfflineStatus } from '../types';
import { isPWAInstalled, isOffline as checkIsOffline } from '../utils';

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [offlineStatus, setOfflineStatus] = useState<OfflineStatus>({
    isOffline: false,
  });

  useEffect(() => {
    // Check if already installed
    setIsInstalled(isPWAInstalled());

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as any);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen for online/offline
    const handleOnline = () => {
      setOfflineStatus({ isOffline: false });
    };

    const handleOffline = () => {
      setOfflineStatus({
        isOffline: true,
        lastOnline: new Date(),
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial offline status
    setOfflineStatus({
      isOffline: checkIsOffline(),
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      setInstallPrompt(null);
    }
  }, [installPrompt]);

  return {
    isInstalled,
    canInstall: !!installPrompt,
    promptInstall,
    offlineStatus,
  };
}

