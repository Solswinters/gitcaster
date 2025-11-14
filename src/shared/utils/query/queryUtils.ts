/**
 * Query String Utilities
 *
 * Utilities for working with URL query strings
 *
 * @module shared/utils/query/queryUtils
 */

/**
 * Parse query string to object
 */
export function parseQueryString(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Add query parameters to URL
 */
export function addQueryParams(url: string, params: Record<string, any>): string {
  const [baseUrl, existingQuery] = url.split('?');
  const existingParams = existingQuery ? parseQueryString(`?${existingQuery}`) : {};
  const mergedParams = { ...existingParams, ...params };
  return baseUrl + buildQueryString(mergedParams);
}

/**
 * Remove query parameters from URL
 */
export function removeQueryParams(url: string, keys: string[]): string {
  const [baseUrl, existingQuery] = url.split('?');
  if (!existingQuery) return baseUrl;

  const params = parseQueryString(`?${existingQuery}`);
  keys.forEach((key) => delete params[key]);

  return baseUrl + buildQueryString(params);
}

/**
 * Get query parameter value
 */
export function getQueryParam(search: string, key: string): string | null {
  const params = new URLSearchParams(search);
  return params.get(key);
}

/**
 * Check if query parameter exists
 */
export function hasQueryParam(search: string, key: string): boolean {
  const params = new URLSearchParams(search);
  return params.has(key);
}

/**
 * Update single query parameter
 */
export function updateQueryParam(url: string, key: string, value: string): string {
  return addQueryParams(url, { [key]: value });
}

/**
 * Parse array from query string (e.g., ?ids=1,2,3)
 */
export function parseQueryArray(search: string, key: string, separator: string = ','): string[] {
  const value = getQueryParam(search, key);
  return value ? value.split(separator).filter(Boolean) : [];
}

/**
 * Build query string with array values
 */
export function buildQueryArray(key: string, values: string[], separator: string = ','): string {
  if (values.length === 0) return '';
  return `${key}=${values.join(separator)}`;
}

