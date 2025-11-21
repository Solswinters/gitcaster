/**
 * Array manipulation utility functions
 * Provides reusable array operations
 */

export class ArrayUtils {
  /**
   * Remove duplicates from array
   */
  static unique<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  /**
   * Remove duplicates by key
   */
  static uniqueBy<T>(array: T[], key: keyof T): T[] {
    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }

  /**
   * Shuffle array (Fisher-Yates algorithm)
   */
  static shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Get random element from array
   */
  static random<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Get random n elements from array
   */
  static randomN<T>(array: T[], n: number): T[] {
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, Math.min(n, array.length));
  }

  /**
   * Chunk array into smaller arrays
   */
  static chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Flatten nested array
   */
  static flatten<T>(array: any[]): T[] {
    return array.reduce((acc, val) => (Array.isArray(val) ? acc.concat(this.flatten(val)) : acc.concat(val)), []);
  }

  /**
   * Group array by key
   */
  static groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce(
      (acc, item) => {
        const groupKey = String(item[key]);
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
      },
      {} as Record<string, T[]>,
    );
  }

  /**
   * Count occurrences of each element
   */
  static countBy<T>(array: T[], key?: keyof T): Record<string, number> {
    return array.reduce(
      (acc, item) => {
        const countKey = key ? String(item[key]) : String(item);
        acc[countKey] = (acc[countKey] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  /**
   * Find difference between arrays (items in first array but not in second)
   */
  static difference<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2);
    return array1.filter((item) => !set2.has(item));
  }

  /**
   * Find intersection of arrays
   */
  static intersection<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2);
    return array1.filter((item) => set2.has(item));
  }

  /**
   * Find union of arrays
   */
  static union<T>(...arrays: T[][]): T[] {
    return this.unique(arrays.flat());
  }

  /**
   * Partition array based on predicate
   */
  static partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
    const truthy: T[] = [];
    const falsy: T[] = [];

    array.forEach((item) => {
      if (predicate(item)) {
        truthy.push(item);
      } else {
        falsy.push(item);
      }
    });

    return [truthy, falsy];
  }

  /**
   * Sort array by multiple keys
   */
  static sortBy<T>(array: T[], ...keys: (keyof T)[]): T[] {
    return [...array].sort((a, b) => {
      for (const key of keys) {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
      }
      return 0;
    });
  }

  /**
   * Get range of numbers
   */
  static range(start: number, end: number, step: number = 1): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
    return result;
  }

  /**
   * Fill array with value
   */
  static fill<T>(length: number, value: T | ((index: number) => T)): T[] {
    return Array.from({ length }, (_, i) => (typeof value === 'function' ? (value as (index: number) => T)(i) : value));
  }

  /**
   * Zip multiple arrays together
   */
  static zip<T>(...arrays: T[][]): T[][] {
    const minLength = Math.min(...arrays.map((arr) => arr.length));
    return Array.from({ length: minLength }, (_, i) => arrays.map((arr) => arr[i]));
  }

  /**
   * Compact array (remove falsy values)
   */
  static compact<T>(array: (T | null | undefined | false | 0 | '')[]): T[] {
    return array.filter(Boolean) as T[];
  }

  /**
   * Remove item at index
   */
  static removeAt<T>(array: T[], index: number): T[] {
    return [...array.slice(0, index), ...array.slice(index + 1)];
  }

  /**
   * Insert item at index
   */
  static insertAt<T>(array: T[], index: number, item: T): T[] {
    return [...array.slice(0, index), item, ...array.slice(index)];
  }

  /**
   * Move item from one index to another
   */
  static move<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    const result = [...array];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  }

  /**
   * Rotate array by n positions
   */
  static rotate<T>(array: T[], n: number): T[] {
    const len = array.length;
    const shift = ((n % len) + len) % len;
    return [...array.slice(shift), ...array.slice(0, shift)];
  }

  /**
   * Get first n items
   */
  static take<T>(array: T[], n: number): T[] {
    return array.slice(0, n);
  }

  /**
   * Get last n items
   */
  static takeLast<T>(array: T[], n: number): T[] {
    return array.slice(-n);
  }

  /**
   * Drop first n items
   */
  static drop<T>(array: T[], n: number): T[] {
    return array.slice(n);
  }

  /**
   * Drop last n items
   */
  static dropLast<T>(array: T[], n: number): T[] {
    return array.slice(0, -n);
  }

  /**
   * Find all indices of value
   */
  static findAllIndices<T>(array: T[], value: T): number[] {
    const indices: number[] = [];
    array.forEach((item, index) => {
      if (item === value) indices.push(index);
    });
    return indices;
  }

  /**
   * Binary search (array must be sorted)
   */
  static binarySearch<T>(array: T[], target: T): number {
    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (array[mid] === target) return mid;
      if (array[mid] < target) left = mid + 1;
      else right = mid - 1;
    }

    return -1;
  }

  /**
   * Check if arrays are equal
   */
  static areEqual<T>(array1: T[], array2: T[]): boolean {
    if (array1.length !== array2.length) return false;
    return array1.every((item, index) => item === array2[index]);
  }

  /**
   * Deep equal comparison for arrays
   */
  static areDeepEqual<T>(array1: T[], array2: T[]): boolean {
    if (array1.length !== array2.length) return false;
    return array1.every((item, index) => JSON.stringify(item) === JSON.stringify(array2[index]));
  }

  /**
   * Get minimum value
   */
  static min(array: number[]): number | undefined {
    if (array.length === 0) return undefined;
    return Math.min(...array);
  }

  /**
   * Get maximum value
   */
  static max(array: number[]): number | undefined {
    if (array.length === 0) return undefined;
    return Math.max(...array);
  }

  /**
   * Calculate sum
   */
  static sum(array: number[]): number {
    return array.reduce((acc, val) => acc + val, 0);
  }

  /**
   * Calculate average
   */
  static average(array: number[]): number | undefined {
    if (array.length === 0) return undefined;
    return this.sum(array) / array.length;
  }

  /**
   * Calculate median
   */
  static median(array: number[]): number | undefined {
    if (array.length === 0) return undefined;

    const sorted = [...array].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  /**
   * Calculate mode (most frequent value)
   */
  static mode<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;

    const counts = this.countBy(array);
    let maxCount = 0;
    let mode: T | undefined;

    Object.entries(counts).forEach(([key, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mode = array.find((item) => String(item) === key);
      }
    });

    return mode;
  }

  /**
   * Split array into two based on predicate (maintain order)
   */
  static split<T>(array: T[], predicate: (item: T, index: number) => boolean): [T[], T[]] {
    const first: T[] = [];
    const second: T[] = [];
    let foundSplit = false;

    array.forEach((item, index) => {
      if (!foundSplit && predicate(item, index)) {
        foundSplit = true;
      }

      if (foundSplit) {
        second.push(item);
      } else {
        first.push(item);
      }
    });

    return [first, second];
  }

  /**
   * Interleave multiple arrays
   */
  static interleave<T>(...arrays: T[][]): T[] {
    const maxLength = Math.max(...arrays.map((arr) => arr.length));
    const result: T[] = [];

    for (let i = 0; i < maxLength; i++) {
      arrays.forEach((arr) => {
        if (i < arr.length) {
          result.push(arr[i]);
        }
      });
    }

    return result;
  }

  /**
   * Create cartesian product of arrays
   */
  static cartesianProduct<T>(...arrays: T[][]): T[][] {
    if (arrays.length === 0) return [[]];
    if (arrays.length === 1) return arrays[0].map((item) => [item]);

    const [first, ...rest] = arrays;
    const restProduct = this.cartesianProduct(...rest);

    return first.flatMap((item) => restProduct.map((prod) => [item, ...prod]));
  }
}

