import { analyticsService } from '@/features/analytics/services/analyticsService';

describe('AnalyticsService', () => {
  it('tracks events', async () => {
    const event = {
      name: 'page_view',
      properties: { page: '/home' },
    };

    const result = await analyticsService.track(event);
    expect(result).toBeTruthy();
  });

  it('retrieves analytics data', async () => {
    const data = await analyticsService.getData({
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    });

    expect(data).toBeDefined();
  });
});

