/**
 * PWA feature type definitions
 */

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface ServiceWorkerStatus {
  registered: boolean;
  installing: boolean;
  waiting: boolean;
  active: boolean;
  error?: string;
}

export interface OfflineStatus {
  isOffline: boolean;
  lastOnline?: Date;
}

export interface CacheStatus {
  name: string;
  size: number;
  lastUpdated: Date;
}

export interface PWAConfig {
  enableServiceWorker: boolean;
  enableOfflineMode: boolean;
  cacheStrategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  cacheName: string;
  cacheVersion: string;
}

