/**
 * Common Types - Comprehensive type definitions for type safety
 * HIGH PRIORITY: Code quality improvements through strong typing
 */

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make all properties required recursively
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Make all properties readonly recursively
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Extract values from an object type
 */
export type ValueOf<T> = T[keyof T];

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Exclude null and undefined
 */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * Extract keys of specific type
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Mutable version of readonly type
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Async function type
 */
export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

/**
 * Function with no return value
 */
export type VoidFunction<T extends any[] = []> = (...args: T) => void;

/**
 * Nullable type
 */
export type Nullable<T> = T | null;

/**
 * Optional type
 */
export type Optional<T> = T | undefined;

/**
 * Maybe type (nullable or undefined)
 */
export type Maybe<T> = T | null | undefined;

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: Record<string, any>;
}

/**
 * API error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

/**
 * Loading state
 */
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

/**
 * Async state
 */
export interface AsyncState<T, E = Error> {
  data: T | null;
  error: E | null;
  status: LoadingState;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

/**
 * Form field state
 */
export interface FieldState<T = any> {
  value: T;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

/**
 * Form state
 */
export interface FormState<T extends Record<string, any>> {
  fields: {
    [K in keyof T]: FieldState<T[K]>;
  };
  isValid: boolean;
  isSubmitting: boolean;
  errors: Partial<Record<keyof T, string>>;
}

/**
 * Event handler type
 */
export type EventHandler<E = Event> = (event: E) => void;

/**
 * Change handler type
 */
export type ChangeHandler<T = any> = (value: T) => void;

/**
 * Callback function type
 */
export type Callback<T = void> = () => T;

/**
 * Predicate function type
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Comparator function type
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Mapper function type
 */
export type Mapper<T, R> = (value: T) => R;

/**
 * Reducer function type
 */
export type Reducer<T, A> = (accumulator: A, current: T) => A;

/**
 * Constructor type
 */
export type Constructor<T = any> = new (...args: any[]) => T;

/**
 * Abstract constructor type
 */
export type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;

/**
 * Class type
 */
export type Class<T = any> = Constructor<T> | AbstractConstructor<T>;

/**
 * JSON primitive types
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * JSON object type
 */
export type JsonObject = { [key: string]: JsonValue };

/**
 * JSON array type
 */
export type JsonArray = JsonValue[];

/**
 * JSON value type
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * Timestamp type
 */
export type Timestamp = number | Date | string;

/**
 * ID type
 */
export type ID = string | number;

/**
 * Environment type
 */
export type Environment = 'development' | 'staging' | 'production' | 'test';

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * Status codes
 */
export type StatusCode = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500 | 502 | 503;

/**
 * Coordinates
 */
export interface Coordinates {
  x: number;
  y: number;
}

/**
 * Dimensions
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Rectangle
 */
export interface Rectangle extends Coordinates, Dimensions {}

/**
 * Range
 */
export interface Range {
  min: number;
  max: number;
}

/**
 * Key-value pair
 */
export interface KeyValue<K = string, V = any> {
  key: K;
  value: V;
}

/**
 * Tuple type helper
 */
export type Tuple<T, N extends number> = N extends N ? (number extends N ? T[] : TupleOf<T, N, []>) : never;
type TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : TupleOf<T, N, [T, ...R]>;

/**
 * Union to intersection
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

/**
 * Awaited type (for promise unwrapping)
 */
export type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

export default {
  DeepPartial,
  DeepRequired,
  DeepReadonly,
  NonNullableFields,
  Nullable,
  Optional,
  Maybe,
};

