/**
 * Object manipulation utility functions
 * Provides reusable object operations
 */

export class ObjectUtils {
  /**
   * Deep clone an object
   */
  static clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Deep merge two objects
   */
  static merge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
    const result = { ...target };

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (this.isObject(sourceValue) && this.isObject(targetValue)) {
          result[key] = this.merge(targetValue as any, sourceValue as any);
        } else {
          result[key] = sourceValue as any;
        }
      }
    }

    return result;
  }

  /**
   * Check if value is an object
   */
  static isObject(value: any): value is Record<string, any> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  /**
   * Check if object is empty
   */
  static isEmpty(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
  }

  /**
   * Get nested property value
   */
  static get<T>(obj: any, path: string, defaultValue?: T): T | undefined {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return defaultValue;
      }
    }

    return result;
  }

  /**
   * Set nested property value
   */
  static set(obj: any, path: string, value: any): any {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    let current = obj;

    for (const key of keys) {
      if (!(key in current) || !this.isObject(current[key])) {
        current[key] = {};
      }
      current = current[key];
    }

    current[lastKey] = value;
    return obj;
  }

  /**
   * Delete nested property
   */
  static unset(obj: any, path: string): boolean {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    let current = obj;

    for (const key of keys) {
      if (!(key in current)) {
        return false;
      }
      current = current[key];
    }

    return delete current[lastKey];
  }

  /**
   * Check if object has nested property
   */
  static has(obj: any, path: string): boolean {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (!(key in current)) {
        return false;
      }
      current = current[key];
    }

    return true;
  }

  /**
   * Pick specified keys from object
   */
  static pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;

    keys.forEach((key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });

    return result;
  }

  /**
   * Omit specified keys from object
   */
  static omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };

    keys.forEach((key) => {
      delete result[key];
    });

    return result;
  }

  /**
   * Get all keys (including nested)
   */
  static flatKeys(obj: Record<string, any>, prefix: string = ''): string[] {
    const keys: string[] = [];

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (this.isObject(obj[key])) {
          keys.push(...this.flatKeys(obj[key], fullKey));
        } else {
          keys.push(fullKey);
        }
      }
    }

    return keys;
  }

  /**
   * Flatten nested object
   */
  static flatten(obj: Record<string, any>, prefix: string = ''): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (this.isObject(obj[key])) {
          Object.assign(result, this.flatten(obj[key], fullKey));
        } else {
          result[fullKey] = obj[key];
        }
      }
    }

    return result;
  }

  /**
   * Unflatten object
   */
  static unflatten(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        this.set(result, key, obj[key]);
      }
    }

    return result;
  }

  /**
   * Map object values
   */
  static mapValues<T extends Record<string, any>, R>(
    obj: T,
    fn: (value: T[keyof T], key: keyof T) => R,
  ): Record<keyof T, R> {
    const result = {} as Record<keyof T, R>;

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = fn(obj[key], key);
      }
    }

    return result;
  }

  /**
   * Map object keys
   */
  static mapKeys<T extends Record<string, any>>(obj: T, fn: (key: keyof T) => string): Record<string, T[keyof T]> {
    const result: Record<string, T[keyof T]> = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[fn(key)] = obj[key];
      }
    }

    return result;
  }

  /**
   * Filter object by predicate
   */
  static filter<T extends Record<string, any>>(
    obj: T,
    predicate: (value: T[keyof T], key: keyof T) => boolean,
  ): Partial<T> {
    const result: Partial<T> = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (predicate(obj[key], key)) {
          result[key] = obj[key];
        }
      }
    }

    return result;
  }

  /**
   * Invert object (swap keys and values)
   */
  static invert<T extends Record<string, string | number>>(obj: T): Record<string, keyof T> {
    const result: Record<string, keyof T> = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[obj[key]] = key;
      }
    }

    return result;
  }

  /**
   * Group array of objects by key
   */
  static groupBy<T extends Record<string, any>>(array: T[], key: keyof T): Record<string, T[]> {
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
   * Index array of objects by key
   */
  static indexBy<T extends Record<string, any>>(array: T[], key: keyof T): Record<string, T> {
    return array.reduce(
      (acc, item) => {
        acc[String(item[key])] = item;
        return acc;
      },
      {} as Record<string, T>,
    );
  }

  /**
   * Deep equal comparison
   */
  static isEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (obj1 == null || obj2 == null) return false;

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return obj1 === obj2;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!this.isEqual(obj1[key], obj2[key])) return false;
    }

    return true;
  }

  /**
   * Difference between two objects
   */
  static difference<T extends Record<string, any>>(obj1: T, obj2: T): Partial<T> {
    const result: Partial<T> = {};

    for (const key in obj1) {
      if (obj1.hasOwnProperty(key)) {
        if (!this.isEqual(obj1[key], obj2[key])) {
          result[key] = obj1[key];
        }
      }
    }

    return result;
  }

  /**
   * Convert object to query string
   */
  static toQueryString(obj: Record<string, any>): string {
    return Object.entries(obj)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
  }

  /**
   * Parse query string to object
   */
  static fromQueryString(queryString: string): Record<string, string> {
    const result: Record<string, string> = {};

    const params = new URLSearchParams(queryString);

    params.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  }

  /**
   * Rename object keys
   */
  static renameKeys<T extends Record<string, any>>(obj: T, keyMap: Record<string, string>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = keyMap[key] || key;
        result[newKey] = obj[key];
      }
    }

    return result;
  }

  /**
   * Get object size (number of keys)
   */
  static size(obj: Record<string, any>): number {
    return Object.keys(obj).length;
  }

  /**
   * Get all values
   */
  static values<T extends Record<string, any>>(obj: T): T[keyof T][] {
    return Object.values(obj);
  }

  /**
   * Get all entries
   */
  static entries<T extends Record<string, any>>(obj: T): [keyof T, T[keyof T]][] {
    return Object.entries(obj) as [keyof T, T[keyof T]][];
  }

  /**
   * From entries
   */
  static fromEntries<K extends string | number | symbol, V>(entries: [K, V][]): Record<K, V> {
    return Object.fromEntries(entries) as Record<K, V>;
  }

  /**
   * Compact object (remove falsy values)
   */
  static compact(obj: Record<string, any>): Record<string, any> {
    return this.filter(obj, (value) => Boolean(value));
  }

  /**
   * Default values for object
   */
  static defaults<T extends Record<string, any>>(obj: T, defaultValues: Partial<T>): T {
    const result = { ...defaultValues, ...obj };
    return result as T;
  }

  /**
   * Transform object
   */
  static transform<T extends Record<string, any>, R>(
    obj: T,
    fn: (result: R, value: T[keyof T], key: keyof T) => R,
    initialValue: R,
  ): R {
    let result = initialValue;

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result = fn(result, obj[key], key);
      }
    }

    return result;
  }

  /**
   * Freeze object deeply
   */
  static deepFreeze<T extends Record<string, any>>(obj: T): Readonly<T> {
    Object.freeze(obj);

    Object.keys(obj).forEach((key) => {
      if (this.isObject(obj[key])) {
        this.deepFreeze(obj[key]);
      }
    });

    return obj;
  }

  /**
   * Clone with modifications
   */
  static cloneWith<T extends Record<string, any>>(obj: T, modifications: Partial<T>): T {
    return this.merge(this.clone(obj), modifications);
  }
}

