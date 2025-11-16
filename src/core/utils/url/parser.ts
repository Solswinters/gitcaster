/**
 * URL parsing utilities
 */

export function getQueryParams(url: string): Record<string, string> {
  const urlObj = new URL(url);
  const params: Record<string, string> = {};
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

export function addQueryParams(url: string, params: Record<string, string>): string {
  const urlObj = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });
  return urlObj.toString();
}

export function removeQueryParams(url: string, keys: string[]): string {
  const urlObj = new URL(url);
  keys.forEach((key) => {
    urlObj.searchParams.delete(key);
  });
  return urlObj.toString();
}

export function getDomain(url: string): string {
  const urlObj = new URL(url);
  return urlObj.hostname;
}

export function getPath(url: string): string {
  const urlObj = new URL(url);
  return urlObj.pathname;
}

