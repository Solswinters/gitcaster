/**
 * Array manipulation utility functions
 * Provides reusable array operations
 */

export class ArrayUtils {
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
   * Shuffle array (Fisher-Yates)
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
   * Get random element
   */
  static random<T>(array: T[]): T | undefined {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Get random elements
   */
  static randomN<T>(array: T[], n: number): T[] {
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, Math.min(n, array.length));
  }

  /**
   * Flatten nested array
   */
  static flatten<T>(array: any[]): T[] {
    return array.reduce((acc, val) => (Array.isArray(val) ? acc.concat(this.flatten(val)) : acc.concat(val)), []);
  }

  /**
   * Group by key
   */
  static groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce(
      (groups, item) => {
        const groupKey = String(item[key]);
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
      },
      {} as Record<string, T[]>,
    );
  }

  /**
   * Count by key
   */
  static countBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce(
      (counts, item) => {
        const countKey = String(item[key]);
        counts[countKey] = (counts[countKey] || 0) + 1;
        return counts;
      },
      {} as Record<string, number>,
    );
  }

  /**
   * Sort by key
   */
  static sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /**
   * Partition array by predicate
   */
  static partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
    const pass: T[] = [];
    const fail: T[] = [];

    array.forEach((item) => {
      if (predicate(item)) {
        pass.push(item);
      } else {
        fail.push(item);
      }
    });

    return [pass, fail];
  }

  /**
   * Difference between arrays
   */
  static difference<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2);
    return array1.filter((item) => !set2.has(item));
  }

  /**
   * Intersection of arrays
   */
  static intersection<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2);
    return array1.filter((item) => set2.has(item));
  }

  /**
   * Union of arrays
   */
  static union<T>(...arrays: T[][]): T[] {
    return this.unique(arrays.flat());
  }

  /**
   * Zip arrays together
   */
  static zip<T>(...arrays: T[][]): T[][] {
    const length = Math.max(...arrays.map((arr) => arr.length));
    const result: T[][] = [];

    for (let i = 0; i < length; i++) {
      result.push(arrays.map((arr) => arr[i]));
    }

    return result;
  }

  /**
   * Take first n elements
   */
  static take<T>(array: T[], n: number): T[] {
    return array.slice(0, n);
  }

  /**
   * Take last n elements
   */
  static takeLast<T>(array: T[], n: number): T[] {
    return array.slice(-n);
  }

  /**
   * Drop first n elements
   */
  static drop<T>(array: T[], n: number): T[] {
    return array.slice(n);
  }

  /**
   * Drop last n elements
   */
  static dropLast<T>(array: T[], n: number): T[] {
    return array.slice(0, -n);
  }

  /**
   * Compact array (remove falsy values)
   */
  static compact<T>(array: T[]): T[] {
    return array.filter(Boolean);
  }

  /**
   * Find index by predicate
   */
  static findIndex<T>(array: T[], predicate: (item: T) => boolean): number {
    return array.findIndex(predicate);
  }

  /**
   * Find last index by predicate
   */
  static findLastIndex<T>(array: T[], predicate: (item: T) => boolean): number {
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array[i])) return i;
    }
    return -1;
  }

  /**
   * Check if array includes all items
   */
  static includesAll<T>(array: T[], items: T[]): boolean {
    return items.every((item) => array.includes(item));
  }

  /**
   * Check if array includes any item
   */
  static includesAny<T>(array: T[], items: T[]): boolean {
    return items.some((item) => array.includes(item));
  }

  /**
   * Sum of numbers
   */
  static sum(array: number[]): number {
    return array.reduce((sum, num) => sum + num, 0);
  }

  /**
   * Average of numbers
   */
  static average(array: number[]): number {
    return array.length === 0 ? 0 : this.sum(array) / array.length;
  }

  /**
   * Max value
   */
  static max(array: number[]): number {
    return Math.max(...array);
  }

  /**
   * Min value
   */
  static min(array: number[]): number {
    return Math.min(...array);
  }

  /**
   * Max by key
   */
  static maxBy<T>(array: T[], key: keyof T): T | undefined {
    if (array.length === 0) return undefined;
    return array.reduce((max, item) => (item[key] > max[key] ? item : max));
  }

  /**
   * Min by key
   */
  static minBy<T>(array: T[], key: keyof T): T | undefined {
    if (array.length === 0) return undefined;
    return array.reduce((min, item) => (item[key] < min[key] ? item : min));
  }

  /**
   * Rotate array
   */
  static rotate<T>(array: T[], n: number): T[] {
    const len = array.length;
    n = ((n % len) + len) % len; // Handle negative rotation
    return [...array.slice(n), ...array.slice(0, n)];
  }

  /**
   * Insert at index
   */
  static insertAt<T>(array: T[], index: number, ...items: T[]): T[] {
    return [...array.slice(0, index), ...items, ...array.slice(index)];
  }

  /**
   * Remove at index
   */
  static removeAt<T>(array: T[], index: number): T[] {
    return [...array.slice(0, index), ...array.slice(index + 1)];
  }

  /**
   * Move item from one index to another
   */
  static move<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    const result = [...array];
    const [item] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, item);
    return result;
  }

  /**
   * Range of numbers
   */
  static range(start: number, end?: number, step: number = 1): number[] {
    if (end === undefined) {
      end = start;
      start = 0;
    }

    const result: number[] = [];
    for (let i = start; step > 0 ? i < end : i > end; i += step) {
      result.push(i);
    }

    return result;
  }

  /**
   * Check if array is empty
   */
  static isEmpty<T>(array: T[]): boolean {
    return array.length === 0;
  }

  /**
   * Check if array is not empty
   */
  static isNotEmpty<T>(array: T[]): boolean {
    return array.length > 0;
  }

  /**
   * First element
   */
  static first<T>(array: T[]): T | undefined {
    return array[0];
  }

  /**
   * Last element
   */
  static last<T>(array: T[]): T | undefined {
    return array[array.length - 1];
  }

  /**
   * All but first
   */
  static tail<T>(array: T[]): T[] {
    return array.slice(1);
  }

  /**
   * All but last
   */
  static init<T>(array: T[]): T[] {
    return array.slice(0, -1);
  }
}
