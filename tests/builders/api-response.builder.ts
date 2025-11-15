/**
 * API Response Builder
 * 
 * Fluent builder for creating test API responses.
 */

import type { ApiResponse, PaginatedResponse, PaginationMeta } from '@/domain/entities';

export class ApiResponseBuilder<T> {
  private response: Partial<ApiResponse<T>> = {
    success: true,
  };

  withSuccess(data: T): this {
    this.response.success = true;
    this.response.data = data;
    delete this.response.error;
    return this;
  }

  withError(error: string, message?: string): this {
    this.response.success = false;
    this.response.error = error;
    this.response.message = message;
    delete this.response.data;
    return this;
  }

  withMessage(message: string): this {
    this.response.message = message;
    return this;
  }

  build(): ApiResponse<T> {
    return this.response as ApiResponse<T>;
  }
}

export class PaginatedResponseBuilder<T> {
  private data: T[] = [];
  private meta: Partial<PaginationMeta> = {
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  withData(data: T[]): this {
    this.data = data;
    this.meta.totalCount = data.length;
    return this;
  }

  withPage(page: number): this {
    this.meta.page = page;
    return this;
  }

  withPageSize(pageSize: number): this {
    this.meta.pageSize = pageSize;
    return this;
  }

  withTotalCount(count: number): this {
    this.meta.totalCount = count;
    const pageSize = this.meta.pageSize || 10;
    this.meta.totalPages = Math.ceil(count / pageSize);
    return this;
  }

  withNextPage(): this {
    this.meta.hasNextPage = true;
    return this;
  }

  withPreviousPage(): this {
    this.meta.hasPreviousPage = true;
    return this;
  }

  build(): PaginatedResponse<T> {
    return {
      data: this.data,
      meta: this.meta as PaginationMeta,
    };
  }
}

/**
 * Create a new API response builder
 */
export function anApiResponse<T>(): ApiResponseBuilder<T> {
  return new ApiResponseBuilder<T>();
}

/**
 * Create a new paginated response builder
 */
export function aPaginatedResponse<T>(): PaginatedResponseBuilder<T> {
  return new PaginatedResponseBuilder<T>();
}

