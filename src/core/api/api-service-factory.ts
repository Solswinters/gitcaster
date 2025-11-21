/**
 * API Service Factory - Modular API service creation with dependency injection
 * HIGH PRIORITY: Architecture improvements for API layer organization
 */

import { ApiClient } from '@/shared/utils/api-client';
import { CacheManager } from '@/core/cache/cache-manager';

export interface ApiServiceConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  retryAttempts?: number;
  cacheEnabled?: boolean;
  cacheTTL?: number;
}

export interface ApiServiceDependencies {
  apiClient: ApiClient;
  cacheManager?: CacheManager;
}

export interface IApiService {
  /**
   * Initialize service
   */
  initialize?(): Promise<void>;

  /**
   * Cleanup service resources
   */
  cleanup?(): Promise<void>;

  /**
   * Health check
   */
  healthCheck?(): Promise<boolean>;
}

export abstract class BaseApiService implements IApiService {
  protected apiClient: ApiClient;
  protected cacheManager?: CacheManager;
  protected config: ApiServiceConfig;

  constructor(dependencies: ApiServiceDependencies, config: ApiServiceConfig) {
    this.apiClient = dependencies.apiClient;
    this.cacheManager = dependencies.cacheManager;
    this.config = config;
  }

  /**
   * Make GET request with caching support
   */
  protected async get<T>(endpoint: string, useCache = true): Promise<T> {
    const cacheKey = `${this.config.baseUrl}${endpoint}`;

    // Try cache first
    if (useCache && this.cacheManager) {
      const cached = this.cacheManager.get<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    // Make request
    const response = await this.apiClient.get<T>(endpoint);

    // Cache response
    if (useCache && this.cacheManager) {
      this.cacheManager.set(cacheKey, response, this.config.cacheTTL);
    }

    return response;
  }

  /**
   * Make POST request
   */
  protected async post<T>(endpoint: string, data: any): Promise<T> {
    return this.apiClient.post<T>(endpoint, data);
  }

  /**
   * Make PUT request
   */
  protected async put<T>(endpoint: string, data: any): Promise<T> {
    return this.apiClient.put<T>(endpoint, data);
  }

  /**
   * Make PATCH request
   */
  protected async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.apiClient.patch<T>(endpoint, data);
  }

  /**
   * Make DELETE request
   */
  protected async delete<T>(endpoint: string): Promise<T> {
    return this.apiClient.delete<T>(endpoint);
  }

  /**
   * Clear cache for this service
   */
  protected clearCache(): void {
    if (this.cacheManager) {
      this.cacheManager.clear();
    }
  }

  async initialize(): Promise<void> {
    // Override in subclasses if needed
  }

  async cleanup(): Promise<void> {
    this.clearCache();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health', false);
      return true;
    } catch {
      return false;
    }
  }
}

export class ApiServiceFactory {
  private static services: Map<string, IApiService> = new Map();
  private static apiClient: ApiClient | null = null;
  private static cacheManager: CacheManager | null = null;

  /**
   * Initialize factory with shared dependencies
   */
  static initialize(apiClient: ApiClient, cacheManager?: CacheManager): void {
    this.apiClient = apiClient;
    this.cacheManager = cacheManager || null;
  }

  /**
   * Create or get service instance
   */
  static getService<T extends IApiService>(
    name: string,
    ServiceClass: new (
      dependencies: ApiServiceDependencies,
      config: ApiServiceConfig
    ) => T,
    config: ApiServiceConfig
  ): T {
    if (!this.apiClient) {
      throw new Error('ApiServiceFactory not initialized');
    }

    // Return existing instance if available
    if (this.services.has(name)) {
      return this.services.get(name) as T;
    }

    // Create new instance
    const dependencies: ApiServiceDependencies = {
      apiClient: this.apiClient,
      cacheManager: this.cacheManager || undefined,
    };

    const service = new ServiceClass(dependencies, config);
    this.services.set(name, service);

    return service;
  }

  /**
   * Register service instance
   */
  static registerService(name: string, service: IApiService): void {
    this.services.set(name, service);
  }

  /**
   * Remove service instance
   */
  static removeService(name: string): void {
    const service = this.services.get(name);
    if (service && service.cleanup) {
      service.cleanup();
    }
    this.services.delete(name);
  }

  /**
   * Get all registered services
   */
  static getAllServices(): Map<string, IApiService> {
    return new Map(this.services);
  }

  /**
   * Clear all services
   */
  static clearAll(): void {
    for (const [name, service] of this.services.entries()) {
      if (service.cleanup) {
        service.cleanup();
      }
    }
    this.services.clear();
  }

  /**
   * Health check all services
   */
  static async healthCheckAll(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const [name, service] of this.services.entries()) {
      if (service.healthCheck) {
        results[name] = await service.healthCheck();
      }
    }

    return results;
  }
}

export default ApiServiceFactory;

