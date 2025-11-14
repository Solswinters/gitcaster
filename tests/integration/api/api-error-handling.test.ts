/**
 * API Error Handling Integration Tests
 *
 * Test error handling across API endpoints
 */

import { apiClient } from '@/shared/services/apiClient';

describe('API Error Handling', () => {
  it('handles 404 errors', async () => {
    try {
      await apiClient.get('/api/nonexistent');
      fail('Should have thrown error');
    } catch (error: any) {
      expect(error.status).toBe(404);
    }
  });

  it('handles 500 errors', async () => {
    try {
      await apiClient.get('/api/error');
      fail('Should have thrown error');
    } catch (error: any) {
      expect(error.status).toBe(500);
    }
  });

  it('retries on network errors', async () => {
    const maxRetries = 3;
    let attemptCount = 0;

    const mockFetch = jest.fn().mockImplementation(() => {
      attemptCount++;
      if (attemptCount < maxRetries) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: 'success' }),
      });
    });

    global.fetch = mockFetch as any;

    const result = await apiClient.get('/api/data');
    expect(attemptCount).toBe(maxRetries);
    expect(result).toEqual({ data: 'success' });
  });

  it('transforms errors correctly', async () => {
    try {
      await apiClient.post('/api/invalid', {});
      fail('Should have thrown error');
    } catch (error: any) {
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('status');
    }
  });
});

