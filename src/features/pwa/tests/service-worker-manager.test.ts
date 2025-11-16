/**
 * Service worker manager tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { ServiceWorkerManager } from '../services/service-worker-manager';

describe('ServiceWorkerManager', () => {
  beforeEach(() => {
    // Mock service worker API
    (global as any).navigator = {
      serviceWorker: {
        register: jest.fn().mockResolvedValue({}),
        ready: Promise.resolve({}),
      },
    };
  });

  it('should register service worker', async () => {
    const registration = await ServiceWorkerManager.register();
    expect(registration).toBeDefined();
  });

  it('should get service worker status', async () => {
    const status = await ServiceWorkerManager.getStatus();
    expect(status).toBeDefined();
    expect(status).toHaveProperty('registered');
  });
});

