/**
 * Common Types
 * 
 * Shared type definitions used across the application
 */

/**
 * Status types for async operations
 */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort configuration
 */
export interface SortConfig<T = string> {
  field: T;
  direction: SortDirection;
}

/**
 * Filter operator types
 */
export type FilterOperator = 
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'in'
  | 'notIn';

/**
 * Filter configuration
 */
export interface FilterConfig {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

/**
 * Onboarding step
 */
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

/**
 * Notification types
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * Notification object
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Theme type
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * Size variants
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Color variants
 */
export type ColorVariant = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

/**
 * Type guard for API success response
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
  return response.success && response.data !== undefined;
}

/**
 * Type guard for API error response
 */
export function isApiError<T>(response: ApiResponse<T>): response is ApiResponse<T> & { error: string } {
  return !response.success && response.error !== undefined;
}

/**
 * Create pagination metadata
 */
export function createPaginationMeta(
  page: number,
  pageSize: number,
  totalCount: number
): PaginationMeta {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return {
    page,
    pageSize,
    totalPages,
    totalCount,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

