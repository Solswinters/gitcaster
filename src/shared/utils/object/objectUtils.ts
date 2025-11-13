/**
 * Object Utilities
 * 
 * Helper functions for working with objects
 */

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Pick specific keys from object
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omit specific keys from object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

/**
 * Get value by path
 */
export function get<T = any>(
  obj: any,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result?.[key] === undefined) {
      return defaultValue;
    }
    result = result[key];
  }

  return result;
}

/**
 * Set value by path
 */
export function set<T extends object>(
  obj: T,
  path: string,
  value: any
): T {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj as any;

  for (const key of keys) {
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
  return obj;
}

/**
 * Merge objects deeply
 */
export function deepMerge<T extends object>(...objects: Partial<T>[]): T {
  const result = {} as T;

  objects.forEach(obj => {
    Object.keys(obj).forEach(key => {
      const value = obj[key as keyof T];
      const existing = result[key as keyof T];

      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        existing &&
        typeof existing === 'object' &&
        !Array.isArray(existing)
      ) {
        result[key as keyof T] = deepMerge(existing, value) as T[keyof T];
      } else {
        result[key as keyof T] = value as T[keyof T];
      }
    });
  });

  return result;
}

/**
 * Flatten nested object
 */
export function flatten(
  obj: Record<string, any>,
  prefix = ''
): Record<string, any> {
  const flattened: Record<string, any> = {};

  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flatten(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  });

  return flattened;
}

/**
 * Unflatten object
 */
export function unflatten(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  Object.keys(obj).forEach(key => {
    set(result, key, obj[key]);
  });

  return result;
}

/**
 * Invert object (swap keys and values)
 */
export function invert(obj: Record<string, any>): Record<string, string> {
  const inverted: Record<string, string> = {};
  Object.keys(obj).forEach(key => {
    inverted[obj[key]] = key;
  });
  return inverted;
}

/**
 * Map object values
 */
export function mapValues<T, U>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => U
): Record<string, U> {
  const result: Record<string, U> = {};
  Object.keys(obj).forEach(key => {
    result[key] = fn(obj[key], key);
  });
  return result;
}

/**
 * Map object keys
 */
export function mapKeys<T>(
  obj: Record<string, T>,
  fn: (key: string, value: T) => string
): Record<string, T> {
  const result: Record<string, T> = {};
  Object.keys(obj).forEach(key => {
    result[fn(key, obj[key])] = obj[key];
  });
  return result;
}

/**
 * Filter object by predicate
 */
export function filter<T>(
  obj: Record<string, T>,
  predicate: (value: T, key: string) => boolean
): Record<string, T> {
  const result: Record<string, T> = {};
  Object.keys(obj).forEach(key => {
    if (predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Check if objects are deeply equal
 */
export function isEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object' ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every(key => isEqual(obj1[key], obj2[key]));
}

/**
 * Get object keys with type safety
 */
export function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * Get object values with type safety
 */
export function values<T extends object>(obj: T): Array<T[keyof T]> {
  return Object.values(obj);
}

/**
 * Get object entries with type safety
 */
export function entries<T extends object>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * From entries with type safety
 */
export function fromEntries<K extends string | number | symbol, V>(
  entries: Array<[K, V]>
): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}

/**
 * Has own property
 */
export function has<T extends object>(obj: T, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Delete undefined values
 */
export function compact<T extends object>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Delete null and undefined values
 */
export function compactNullable<T extends object>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Freeze object deeply
 */
export function deepFreeze<T>(obj: T): T {
  Object.freeze(obj);

  if (obj && typeof obj === 'object') {
    Object.getOwnPropertyNames(obj).forEach(prop => {
      const value = (obj as any)[prop];
      if (value && typeof value === 'object') {
        deepFreeze(value);
      }
    });
  }

  return obj;
}

/**
 * Serialize object to query string
 */
export function toQueryString(obj: Record<string, any>): string {
  const params = new URLSearchParams();
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, String(v)));
      } else {
        params.set(key, String(value));
      }
    }
  });

  return params.toString();
}

/**
 * Parse query string to object
 */
export function fromQueryString(queryString: string): Record<string, any> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, any> = {};

  params.forEach((value, key) => {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  });

  return result;
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Safe JSON stringify
 */
export function safeJsonStringify(
  obj: any,
  fallback: string = '{}'
): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return fallback;
  }
}

