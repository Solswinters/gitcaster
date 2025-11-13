/**
 * Async Utilities
 * 
 * Helper functions for working with promises and async operations
 */

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function(this: any, ...args: Parameters<T>) {
    const context = this;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Throttle a function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function(this: any, ...args: Parameters<T>) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Execute promises in parallel with concurrency limit
 */
export async function parallel<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const task of tasks) {
    const promise = task().then(result => {
      results.push(result);
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex(p => p === promise),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Execute promises in series (one after another)
 */
export async function series<T>(
  tasks: (() => Promise<T>)[]
): Promise<T[]> {
  const results: T[] = [];

  for (const task of tasks) {
    results.push(await task());
  }

  return results;
}

/**
 * Execute promises with all settled (doesn't fail on rejection)
 */
export async function allSettled<T>(
  promises: Promise<T>[]
): Promise<Array<{ status: 'fulfilled' | 'rejected'; value?: T; reason?: any }>> {
  return Promise.allSettled(promises);
}

/**
 * Race with timeout
 */
export async function raceWithTimeout<T>(
  promise: Promise<T>,
  timeout: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeout);
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
 * Memoize async function results
 */
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    maxAge?: number;
    maxSize?: number;
  } = {}
): T {
  const cache = new Map<string, { value: any; timestamp: number }>();
  const { maxAge = Infinity, maxSize = Infinity } = options;

  return (async (...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < maxAge) {
        return cached.value;
      }
    }

    const value = await fn(...args);
    cache.set(key, { value, timestamp: Date.now() });

    // Enforce max size
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return value;
  }) as T;
}

/**
 * Queue for managing async operations
 */
export class AsyncQueue<T = any> {
  private queue: (() => Promise<T>)[] = [];
  private running = 0;
  private concurrency: number;

  constructor(concurrency = 1) {
    this.concurrency = concurrency;
  }

  add(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedTask = async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          this.next();
        }
      };

      this.queue.push(wrappedTask);
      this.next();
    });
  }

  private async next(): Promise<void> {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    this.running++;
    const task = this.queue.shift();
    if (task) {
      await task();
    }
  }

  clear(): void {
    this.queue = [];
  }

  get size(): number {
    return this.queue.length;
  }

  get isRunning(): boolean {
    return this.running > 0 || this.queue.length > 0;
  }
}

/**
 * Batch process items with async function
 */
export async function batchProcess<T, R>(
  items: T[],
  batchSize: number,
  processFn: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processFn(batch);
    results.push(...batchResults);
  }

  return results;
}

/**
 * Poll a function until condition is met
 */
export async function poll<T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean,
  options: {
    interval?: number;
    timeout?: number;
    maxAttempts?: number;
  } = {}
): Promise<T> {
  const { interval = 1000, timeout = 30000, maxAttempts = Infinity } = options;
  const startTime = Date.now();
  let attempts = 0;

  while (attempts < maxAttempts) {
    const result = await fn();

    if (condition(result)) {
      return result;
    }

    if (Date.now() - startTime >= timeout) {
      throw new Error('Polling timeout');
    }

    attempts++;
    await sleep(interval);
  }

  throw new Error('Max polling attempts reached');
}

/**
 * Cache promise to prevent duplicate calls
 */
export function cachePromise<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  const cache = new Map<string, Promise<any>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (!cache.has(key)) {
      const promise = fn(...args);
      cache.set(key, promise);
      
      // Clean up on completion
      promise.finally(() => {
        cache.delete(key);
      });
    }

    return cache.get(key)!;
  }) as T;
}

/**
 * Lazy load a module or resource
 */
export async function lazyLoad<T>(
  loader: () => Promise<T>
): Promise<T> {
  return await loader();
}

/**
 * Execute callback when idle
 */
export function whenIdle(callback: () => void, timeout = 1000): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, timeout);
  }
}

/**
 * Defer execution to next tick
 */
export function defer<T>(fn: () => T): Promise<T> {
  return Promise.resolve().then(fn);
}

/**
 * Create cancelable promise
 */
export function makeCancelable<T>(
  promise: Promise<T>
): {
  promise: Promise<T>;
  cancel: () => void;
} {
  let isCanceled = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise
      .then(value => {
        if (!isCanceled) {
          resolve(value);
        }
      })
      .catch(error => {
        if (!isCanceled) {
          reject(error);
        }
      });
  });

  return {
    promise: wrappedPromise,
    cancel: () => {
      isCanceled = true;
    },
  };
}

/**
 * Map over array with async function
 */
export async function asyncMap<T, R>(
  array: T[],
  asyncFn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  return Promise.all(array.map(asyncFn));
}

/**
 * Filter array with async predicate
 */
export async function asyncFilter<T>(
  array: T[],
  asyncPredicate: (item: T, index: number) => Promise<boolean>
): Promise<T[]> {
  const results = await asyncMap(array, asyncPredicate);
  return array.filter((_, index) => results[index]);
}

/**
 * Reduce array with async reducer
 */
export async function asyncReduce<T, R>(
  array: T[],
  asyncReducer: (accumulator: R, item: T, index: number) => Promise<R>,
  initialValue: R
): Promise<R> {
  let accumulator = initialValue;

  for (let i = 0; i < array.length; i++) {
    accumulator = await asyncReducer(accumulator, array[i], i);
  }

  return accumulator;
}

/**
 * Find item in array with async predicate
 */
export async function asyncFind<T>(
  array: T[],
  asyncPredicate: (item: T, index: number) => Promise<boolean>
): Promise<T | undefined> {
  for (let i = 0; i < array.length; i++) {
    if (await asyncPredicate(array[i], i)) {
      return array[i];
    }
  }
  return undefined;
}

/**
 * Check if any item matches async predicate
 */
export async function asyncSome<T>(
  array: T[],
  asyncPredicate: (item: T, index: number) => Promise<boolean>
): Promise<boolean> {
  for (let i = 0; i < array.length; i++) {
    if (await asyncPredicate(array[i], i)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if all items match async predicate
 */
export async function asyncEvery<T>(
  array: T[],
  asyncPredicate: (item: T, index: number) => Promise<boolean>
): Promise<boolean> {
  for (let i = 0; i < array.length; i++) {
    if (!(await asyncPredicate(array[i], i))) {
      return false;
    }
  }
  return true;
}

