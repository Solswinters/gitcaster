/**
 * API Interceptors
 *
 * Request and response interceptors for the API client
 *
 * @module shared/services/apiInterceptors
 */

import { errorReporter } from '../utils/errors/ErrorReporting';
import { logger } from '../utils/logger';

export interface RequestConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface ResponseData {
  data: any;
  status: number;
  statusText: string;
  headers: Headers;
}

export type RequestInterceptor = (
  config: RequestConfig
) => RequestConfig | Promise<RequestConfig>;

export type ResponseInterceptor = (
  response: ResponseData
) => ResponseData | Promise<ResponseData>;

export type ErrorInterceptor = (error: any) => any;

class APIInterceptorManager {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor);
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.requestInterceptors.splice(index, 1);
      }
    };
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor);
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.responseInterceptors.splice(index, 1);
      }
    };
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
    this.errorInterceptors.push(interceptor);
    return () => {
      const index = this.errorInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.errorInterceptors.splice(index, 1);
      }
    };
  }

  /**
   * Run request interceptors
   */
  async runRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let modifiedConfig = config;

    for (const interceptor of this.requestInterceptors) {
      try {
        modifiedConfig = await interceptor(modifiedConfig);
      } catch (error) {
        logger.error('Request interceptor failed:', error);
      }
    }

    return modifiedConfig;
  }

  /**
   * Run response interceptors
   */
  async runResponseInterceptors(response: ResponseData): Promise<ResponseData> {
    let modifiedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      try {
        modifiedResponse = await interceptor(modifiedResponse);
      } catch (error) {
        logger.error('Response interceptor failed:', error);
      }
    }

    return modifiedResponse;
  }

  /**
   * Run error interceptors
   */
  async runErrorInterceptors(error: any): Promise<any> {
    let modifiedError = error;

    for (const interceptor of this.errorInterceptors) {
      try {
        modifiedError = await interceptor(modifiedError);
      } catch (err) {
        logger.error('Error interceptor failed:', err);
      }
    }

    return modifiedError;
  }

  /**
   * Clear all interceptors
   */
  clear(): void {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.errorInterceptors = [];
  }
}

// Singleton instance
export const interceptorManager = new APIInterceptorManager();

// Common interceptors

/**
 * Add authorization header
 */
export function authInterceptor(token?: string): RequestInterceptor {
  return (config) => {
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  };
}

/**
 * Add request ID for tracing
 */
export function requestIdInterceptor(): RequestInterceptor {
  return (config) => {
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    config.headers = {
      ...config.headers,
      'X-Request-ID': requestId,
    };
    return config;
  };
}

/**
 * Log requests
 */
export function loggingInterceptor(): RequestInterceptor {
  return (config) => {
    logger.info(`API Request: ${config.method} ${config.url}`, {
      headers: config.headers,
    });
    return config;
  };
}

/**
 * Transform request data
 */
export function transformRequestInterceptor(): RequestInterceptor {
  return (config) => {
    if (config.body && typeof config.body === 'object') {
      // Add any global transformations here
      config.body = {
        ...config.body,
        timestamp: new Date().toISOString(),
      };
    }
    return config;
  };
}

/**
 * Handle response errors
 */
export function errorHandlingInterceptor(): ErrorInterceptor {
  return (error) => {
    // Report error
    errorReporter.report(error, {}, 'high');

    // Log error
    logger.error('API Error:', error);

    return error;
  };
}

/**
 * Transform response data
 */
export function transformResponseInterceptor(): ResponseInterceptor {
  return (response) => {
    // Add any global response transformations here
    return response;
  };
}

/**
 * Cache response
 */
export function cacheInterceptor(cache: Map<string, any>): ResponseInterceptor {
  return (response) => {
    const cacheKey = response.headers.get('X-Cache-Key');
    if (cacheKey) {
      cache.set(cacheKey, response.data);
    }
    return response;
  };
}

/**
 * Retry failed requests
 */
export function retryInterceptor(maxRetries: number = 3): ErrorInterceptor {
  const retryCount = new WeakMap<any, number>();

  return async (error) => {
    const count = retryCount.get(error) || 0;

    if (count < maxRetries && isRetryable(error)) {
      retryCount.set(error, count + 1);
      logger.info(`Retrying request (attempt ${count + 1}/${maxRetries})`);

      // Wait before retry (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, count) * 1000)
      );

      throw error; // Re-throw to trigger retry
    }

    return error;
  };
}

/**
 * Check if error is retryable
 */
function isRetryable(error: any): boolean {
  // Retry on network errors or 5xx server errors
  return (
    error.name === 'NetworkError' ||
    (error.status >= 500 && error.status < 600)
  );
}

