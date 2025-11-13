/**
 * API Client
 * 
 * Centralized HTTP client with error handling and retry logic
 */

import { createError, ErrorCode, retry } from '../utils/errors';

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
  timeout?: number;
  retries?: number;
}

export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;

  private constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  static getInstance(baseUrl?: string): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(baseUrl);
    }
    return ApiClient.instance;
  }

  private async fetchWithTimeout(
    url: string,
    config: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      credentials = 'include',
      timeout = 30000,
      retries = 0,
    } = config;

    const url = `${this.baseUrl}${endpoint}`;

    const fetchConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials,
      ...(body && { body: JSON.stringify(body) }),
    };

    const makeRequest = async (): Promise<T> => {
      try {
        const response = await this.fetchWithTimeout(url, fetchConfig, timeout);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw createError(
            errorData.message || `HTTP Error ${response.status}`,
            this.getErrorCode(response.status),
            response.status,
            errorData
          );
        }

        // Handle empty responses
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          return {} as T;
        }

        return await response.json();
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw createError('Request timeout', ErrorCode.TIMEOUT_ERROR);
        }
        throw error;
      }
    };

    if (retries > 0) {
      return retry(makeRequest, {
        maxAttempts: retries + 1,
        delay: 1000,
        backoff: 'exponential',
      });
    }

    return makeRequest();
  }

  private getErrorCode(status: number): ErrorCode {
    switch (status) {
      case 400:
        return ErrorCode.VALIDATION_ERROR;
      case 401:
        return ErrorCode.UNAUTHORIZED;
      case 403:
        return ErrorCode.FORBIDDEN;
      case 404:
        return ErrorCode.NOT_FOUND;
      case 429:
        return ErrorCode.RATE_LIMIT;
      case 500:
      case 502:
      case 503:
      case 504:
        return ErrorCode.SERVER_ERROR;
      default:
        return ErrorCode.API_ERROR;
    }
  }

  get<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  put<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  patch<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  delete<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Singleton instance
export const apiClient = ApiClient.getInstance();

// Convenience exports
export const get = <T = any>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
  apiClient.get<T>(endpoint, config);

export const post = <T = any>(
  endpoint: string,
  body?: any,
  config?: Omit<RequestConfig, 'method' | 'body'>
) => apiClient.post<T>(endpoint, body, config);

export const put = <T = any>(
  endpoint: string,
  body?: any,
  config?: Omit<RequestConfig, 'method' | 'body'>
) => apiClient.put<T>(endpoint, body, config);

export const patch = <T = any>(
  endpoint: string,
  body?: any,
  config?: Omit<RequestConfig, 'method' | 'body'>
) => apiClient.patch<T>(endpoint, body, config);

export const del = <T = any>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
  apiClient.delete<T>(endpoint, config);

