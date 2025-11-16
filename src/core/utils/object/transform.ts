/**
 * Object transformation utilities
 */

export function mapKeys<T extends object>(
  obj: T,
  fn: (key: string) => string
): Record<string, any> {
  return Object.keys(obj).reduce((result, key) => {
    result[fn(key)] = obj[key as keyof T];
    return result;
  }, {} as Record<string, any>);
}

export function mapValues<T extends object>(
  obj: T,
  fn: (value: any, key: string) => any
): Record<string, any> {
  return Object.keys(obj).reduce((result, key) => {
    result[key] = fn(obj[key as keyof T], key);
    return result;
  }, {} as Record<string, any>);
}

export function invert(obj: Record<string, string>): Record<string, string> {
  return Object.keys(obj).reduce((result, key) => {
    result[obj[key]] = key;
    return result;
  }, {} as Record<string, string>);
}

export function fromEntries<T = any>(entries: [string, T][]): Record<string, T> {
  return entries.reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {} as Record<string, T>);
}

