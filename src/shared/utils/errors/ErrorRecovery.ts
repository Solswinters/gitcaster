/**
 * Error Recovery Strategies
 * 
 * Provides strategies for recovering from errors
 */

import { AppError, ErrorCode } from './ErrorService';

export type RetryOptions = {
  maxAttempts?: number;
  delay?: number;
  backoff?: 'linear' | 'exponential';
  shouldRetry?: (error: AppError) => boolean;
};

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delay: 1000,
  backoff: 'exponential',
  shouldRetry: (error: AppError) => {
    // Retry on network and timeout errors
    return [
      ErrorCode.NETWORK_ERROR,
      ErrorCode.TIMEOUT_ERROR,
      ErrorCode.SERVER_ERROR,
    ].includes(error.code);
  },
};

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: AppError | undefined;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof AppError 
        ? error 
        : new AppError('Retry failed', ErrorCode.UNKNOWN_ERROR);

      // Don't retry if we shouldn't or if it's the last attempt
      if (!opts.shouldRetry(lastError) || attempt === opts.maxAttempts) {
        throw lastError;
      }

      // Calculate delay with backoff
      const delay = opts.backoff === 'exponential'
        ? opts.delay * Math.pow(2, attempt - 1)
        : opts.delay * attempt;

      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Execute with timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timed out'
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new AppError(errorMessage, ErrorCode.TIMEOUT_ERROR));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

/**
 * Execute with fallback
 */
export async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T> | T
): Promise<T> {
  try {
    return await primary();
  } catch (error) {
    return await fallback();
  }
}

/**
 * Execute multiple functions and return first successful result
 */
export async function firstSuccess<T>(
  fns: Array<() => Promise<T>>
): Promise<T> {
  let lastError: Error | undefined;

  for (const fn of fns) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error 
        ? error 
        : new Error('Unknown error');
    }
  }

  throw lastError || new AppError('All attempts failed', ErrorCode.UNKNOWN_ERROR);
}

/**
 * Circuit breaker pattern
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000, // 1 minute
    private resetTimeout: number = 30000 // 30 seconds
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
        this.state = 'half-open';
      } else {
        throw new AppError(
          'Circuit breaker is open',
          ErrorCode.SERVER_ERROR
        );
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }

  getState(): 'closed' | 'open' | 'half-open' {
    return this.state;
  }

  reset(): void {
    this.failures = 0;
    this.state = 'closed';
    this.lastFailureTime = 0;
  }
}

/**
 * Safe execution that catches and logs errors
 */
export async function safe<T>(
  fn: () => Promise<T>,
  defaultValue: T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Safe execution caught error:', error);
    }
    return defaultValue;
  }
}

/**
 * Execute with AbortController support
 */
export async function withAbort<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  timeoutMs?: number
): Promise<T> {
  const controller = new AbortController();
  const signal = controller.signal;

  let timeoutId: NodeJS.Timeout | undefined;

  if (timeoutMs) {
    timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  }

  try {
    const result = await fn(signal);
    if (timeoutId) clearTimeout(timeoutId);
    return result;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Helper function to sleep for a duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce errors to prevent error flooding
 */
export function debounceErrors<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number = 1000
): T {
  let timeoutId: NodeJS.Timeout | undefined;
  let lastError: Error | undefined;

  return ((...args: Parameters<T>) => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
          lastError = undefined;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          reject(lastError);
        }
      }, delay);
    });
  }) as T;
}

