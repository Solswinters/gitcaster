/**
 * Service worker management service
 */

import type { ServiceWorkerStatus } from '../types';

export class ServiceWorkerManager {
  /**
   * Register service worker
   */
  static async register(swPath: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register(swPath);
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  /**
   * Unregister service worker
   */
  static async unregister(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      return await registration.unregister();
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
      return false;
    }
  }

  /**
   * Get service worker status
   */
  static async getStatus(): Promise<ServiceWorkerStatus> {
    if (!('serviceWorker' in navigator)) {
      return {
        registered: false,
        installing: false,
        waiting: false,
        active: false,
      };
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();

      if (!registration) {
        return {
          registered: false,
          installing: false,
          waiting: false,
          active: false,
        };
      }

      return {
        registered: true,
        installing: !!registration.installing,
        waiting: !!registration.waiting,
        active: !!registration.active,
      };
    } catch (error) {
      return {
        registered: false,
        installing: false,
        waiting: false,
        active: false,
        error: String(error),
      };
    }
  }

  /**
   * Update service worker
   */
  static async update(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
    } catch (error) {
      console.error('Service Worker update failed:', error);
    }
  }

  /**
   * Skip waiting service worker
   */
  static async skipWaiting(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }
}

