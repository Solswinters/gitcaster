/**
 * JSON Utilities
 *
 * Utilities for JSON parsing and manipulation
 *
 * @module shared/utils/json/jsonUtils
 */

/**
 * Safely parse JSON string
 */
export function safeJsonParse<T = any>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Pretty print JSON
 */
export function prettyJson(obj: any, spaces: number = 2): string {
  return JSON.stringify(obj, null, spaces);
}

/**
 * Stringify with error handling
 */
export function safeJsonStringify(obj: any, fallback: string = '{}'): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return fallback;
  }
}

/**
 * Deep clone object using JSON
 */
export function jsonClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if string is valid JSON
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove undefined and null values from object
 */
export function cleanJson(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (_, value) => (value == null ? undefined : value)));
}

/**
 * Flatten nested object
 */
export function flattenJson(obj: any, prefix: string = ''): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, flattenJson(obj[key], newKey));
    } else {
      result[newKey] = obj[key];
    }
  }

  return result;
}

/**
 * Unflatten object
 */
export function unflattenJson(obj: Record<string, any>): any {
  const result: any = {};

  for (const key in obj) {
    const parts = key.split('.');
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = obj[key];
  }

  return result;
}

/**
 * Compare two JSON objects for equality
 */
export function jsonEquals(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Get value from nested object using path
 */
export function getJsonPath(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Set value in nested object using path
 */
export function setJsonPath(obj: any, path: string, value: any): void {
  const parts = path.split('.');
  const last = parts.pop()!;
  const target = parts.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[last] = value;
}

