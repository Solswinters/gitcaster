/**
 * PWA utility helpers
 */

export function isPWAInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

export function canInstallPWA(): boolean {
  return 'BeforeInstallPromptEvent' in window;
}

export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}

export function isOffline(): boolean {
  return !navigator.onLine;
}

export async function getCacheSize(cacheName: string): Promise<number> {
  if (!('caches' in window)) return 0;

  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    let totalSize = 0;

    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }

    return totalSize;
  } catch (error) {
    console.error('Failed to get cache size:', error);
    return 0;
  }
}

export async function clearCache(cacheName: string): Promise<boolean> {
  if (!('caches' in window)) return false;

  try {
    return await caches.delete(cacheName);
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return false;
  }
}

export function formatCacheSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

