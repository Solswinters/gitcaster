/**
 * Analytics service tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { AnalyticsService } from '../services/analytics-service';

describe('AnalyticsService', () => {
  beforeEach(() => {
    // Reset any state before each test
  });

  it('should track event', async () => {
    const event = {
      userId: 'test-user',
      eventName: 'page_view',
      properties: { page: '/dashboard' },
    };

    const result = await AnalyticsService.trackEvent(event);
    expect(result).toBeDefined();
  });

  it('should get user analytics', async () => {
    const analytics = await AnalyticsService.getUserAnalytics('test-user');
    expect(analytics).toBeDefined();
  });
});

