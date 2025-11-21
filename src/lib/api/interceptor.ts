/**
 * API Request and Response Interceptor
 * Centralized interceptor for API calls
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface InterceptorConfig {
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
}

export interface RequestInterceptor {
  onFulfilled?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  onRejected?: (error: AxiosError) => Promise<AxiosError>;
}

export interface ResponseInterceptor {
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onRejected?: (error: AxiosError) => Promise<AxiosError>;
}

export class APIInterceptor {
  private instance: AxiosInstance;
  private requestInterceptors: number[] = [];
  private responseInterceptors: number[] = [];
  private retryQueue: Map<string, number> = new Map();

  constructor(config: InterceptorConfig = {}) {
    this.instance = axios.create({
      baseURL: config.baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      timeout: config.timeout || 30000,
      withCredentials: config.withCredentials ?? true,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupDefaultInterceptors();
  }

  /**
   * Setup default request and response interceptors
   */
  private setupDefaultInterceptors(): void {
    // Request interceptor for adding auth token
    this.addRequestInterceptor({
      onFulfilled: async (config) => {
        // Add authentication token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Add timestamp
        config.headers['X-Request-Time'] = new Date().toISOString();

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data,
          });
        }

        return config;
      },
      onRejected: async (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      },
    });

    // Response interceptor for handling common responses
    this.addResponseInterceptor({
      onFulfilled: (response) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }

        // Remove from retry queue if successful
        const requestId = response.config.headers['X-Request-ID'] as string;
        if (requestId) {
          this.retryQueue.delete(requestId);
        }

        return response;
      },
      onRejected: async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Log error in development
        if (process.env.NODE_ENV === 'development') {
          console.error(
            `[API Response Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`,
            {
              status: error.response?.status,
              message: error.message,
              data: error.response?.data,
            },
          );
        }

        // Handle 401 Unauthorized - refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshAuthToken();
            const token = this.getAuthToken();
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.instance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.handleAuthenticationFailure();
            return Promise.reject(refreshError);
          }
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
          this.handleForbidden(error);
        }

        // Handle 429 Too Many Requests - rate limiting
        if (error.response?.status === 429) {
          return this.handleRateLimit(error, originalRequest);
        }

        // Handle 500+ Server Errors - retry logic
        if (error.response?.status && error.response.status >= 500) {
          return this.handleServerError(error, originalRequest);
        }

        // Handle network errors
        if (!error.response) {
          return this.handleNetworkError(error, originalRequest);
        }

        return Promise.reject(error);
      },
    });
  }

  /**
   * Add a custom request interceptor
   */
  public addRequestInterceptor(interceptor: RequestInterceptor): number {
    const id = this.instance.interceptors.request.use(interceptor.onFulfilled, interceptor.onRejected);
    this.requestInterceptors.push(id);
    return id;
  }

  /**
   * Add a custom response interceptor
   */
  public addResponseInterceptor(interceptor: ResponseInterceptor): number {
    const id = this.instance.interceptors.response.use(interceptor.onFulfilled, interceptor.onRejected);
    this.responseInterceptors.push(id);
    return id;
  }

  /**
   * Remove a request interceptor
   */
  public removeRequestInterceptor(id: number): void {
    this.instance.interceptors.request.eject(id);
    const index = this.requestInterceptors.indexOf(id);
    if (index > -1) {
      this.requestInterceptors.splice(index, 1);
    }
  }

  /**
   * Remove a response interceptor
   */
  public removeResponseInterceptor(id: number): void {
    this.instance.interceptors.response.eject(id);
    const index = this.responseInterceptors.indexOf(id);
    if (index > -1) {
      this.responseInterceptors.splice(index, 1);
    }
  }

  /**
   * Get the axios instance
   */
  public getInstance(): AxiosInstance {
    return this.instance;
  }

  /**
   * Make a GET request
   */
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  /**
   * Make a POST request
   */
  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  /**
   * Make a PUT request
   */
  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  /**
   * Make a PATCH request
   */
  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  /**
   * Make a DELETE request
   */
  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  // Private helper methods

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  private clearAuthToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }

  private async refreshAuthToken(): Promise<void> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${this.instance.defaults.baseURL}/auth/refresh`, {
        refreshToken,
      });

      const { token, refreshToken: newRefreshToken } = response.data;
      this.setAuthToken(token);
      
      if (newRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken);
      }
    } catch (error) {
      this.clearAuthToken();
      throw error;
    }
  }

  private handleAuthenticationFailure(): void {
    this.clearAuthToken();
    
    if (typeof window !== 'undefined') {
      // Redirect to login page
      window.location.href = '/login?session_expired=true';
    }
  }

  private handleForbidden(error: AxiosError): void {
    console.error('[Access Denied]', error.response?.data);
    
    // Could dispatch a global event or show a notification
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('api:forbidden', {
          detail: { message: 'You do not have permission to access this resource.' },
        }),
      );
    }
  }

  private async handleRateLimit(
    error: AxiosError,
    originalRequest: InternalAxiosRequestConfig,
  ): Promise<AxiosResponse> {
    const retryAfter = error.response?.headers['retry-after'];
    const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 5000; // Default 5 seconds

    console.warn(`[Rate Limit] Waiting ${waitTime}ms before retrying...`);

    await new Promise((resolve) => setTimeout(resolve, waitTime));

    return this.instance(originalRequest);
  }

  private async handleServerError(
    error: AxiosError,
    originalRequest: InternalAxiosRequestConfig & { _retryCount?: number },
  ): Promise<AxiosResponse> {
    const maxRetries = 3;
    const requestId = originalRequest.headers['X-Request-ID'] as string;
    const retryCount = this.retryQueue.get(requestId) || 0;

    if (retryCount >= maxRetries) {
      this.retryQueue.delete(requestId);
      console.error(`[Server Error] Max retries (${maxRetries}) reached for ${originalRequest.url}`);
      return Promise.reject(error);
    }

    this.retryQueue.set(requestId, retryCount + 1);

    // Exponential backoff: 1s, 2s, 4s
    const waitTime = Math.pow(2, retryCount) * 1000;
    console.warn(`[Server Error] Retrying ${originalRequest.url} in ${waitTime}ms (attempt ${retryCount + 1}/${maxRetries})`);

    await new Promise((resolve) => setTimeout(resolve, waitTime));

    return this.instance(originalRequest);
  }

  private async handleNetworkError(
    error: AxiosError,
    originalRequest: InternalAxiosRequestConfig & { _networkRetry?: number },
  ): Promise<AxiosResponse> {
    const maxRetries = 2;
    originalRequest._networkRetry = (originalRequest._networkRetry || 0) + 1;

    if (originalRequest._networkRetry > maxRetries) {
      console.error(`[Network Error] Max retries (${maxRetries}) reached for ${originalRequest.url}`);
      
      // Dispatch offline event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('api:offline', {
            detail: { message: 'Network connection failed. Please check your internet connection.' },
          }),
        );
      }
      
      return Promise.reject(error);
    }

    const waitTime = 2000; // 2 seconds
    console.warn(`[Network Error] Retrying ${originalRequest.url} in ${waitTime}ms`);

    await new Promise((resolve) => setTimeout(resolve, waitTime));

    return this.instance(originalRequest);
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create a default instance
export const apiInterceptor = new APIInterceptor();

// Export the axios instance for direct use
export const api = apiInterceptor.getInstance();

export default apiInterceptor;

