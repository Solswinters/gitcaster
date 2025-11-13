/**
 * API Client Integration Tests
 *
 * Test API client with interceptors and configuration
 */

import { ApiClient } from '@/shared/services/apiClient';
import { interceptorManager, authInterceptor, requestIdInterceptor } from '@/shared/services/apiInterceptors';

// Mock fetch
global.fetch = jest.fn();

describe('API Client Integration', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = ApiClient.getInstance('/api');
    interceptorManager.clear();
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  it('makes successful GET request', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    const result = await apiClient.get('/users');

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/users',
      expect.objectContaining({
        method: 'GET',
      })
    );

    expect(result).toEqual({ data: 'test' });
  });

  it('makes successful POST request', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: '123' }),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    const body = { name: 'John' };
    const result = await apiClient.post('/users', body);

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/users',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(body),
      })
    );

    expect(result).toEqual({ id: '123' });
  });

  it('handles 404 errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Not found' }),
    });

    await expect(apiClient.get('/missing')).rejects.toThrow();
  });

  it('handles network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(apiClient.get('/test')).rejects.toThrow('Network error');
  });

  it('handles timeout', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    await expect(
      apiClient.get('/slow', { timeout: 50 })
    ).rejects.toThrow();
  });

  it('retries failed requests', async () => {
    let attempts = 0;
    (global.fetch as jest.Mock).mockImplementation(() => {
      attempts++;
      if (attempts < 3) {
        return Promise.reject(new Error('Server error'));
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });
    });

    const result = await apiClient.get('/retry', { retries: 2 });

    expect(attempts).toBe(3);
    expect(result).toEqual({ success: true });
  });

  it('works with auth interceptor', async () => {
    interceptorManager.addRequestInterceptor(authInterceptor('test-token'));

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'authenticated' }),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    await apiClient.get('/protected');

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/protected',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token',
        }),
      })
    );
  });

  it('applies multiple interceptors', async () => {
    interceptorManager.addRequestInterceptor(authInterceptor('token'));
    interceptorManager.addRequestInterceptor(requestIdInterceptor());

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'success' }),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    await apiClient.get('/test');

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer token',
          'X-Request-ID': expect.any(String),
        }),
      })
    );
  });

  describe('HTTP methods', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });
    });

    it('supports PUT', async () => {
      await apiClient.put('/users/123', { name: 'Updated' });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/users/123',
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });

    it('supports PATCH', async () => {
      await apiClient.patch('/users/123', { name: 'Patched' });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/users/123',
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });

    it('supports DELETE', async () => {
      await apiClient.delete('/users/123');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/users/123',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});

