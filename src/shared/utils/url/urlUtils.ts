/**
 * URL Utilities
 * 
 * Helper functions for URL manipulation
 */

/**
 * Build URL with query parameters
 */
export function buildUrl(base: string, params: Record<string, any>): string {
  const url = new URL(base);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, String(v)));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  });

  return url.toString();
}

/**
 * Parse query string to object
 */
export function parseQuery(search: string): Record<string, string | string[]> {
  const params = new URLSearchParams(search);
  const result: Record<string, string | string[]> = {};

  params.forEach((value, key) => {
    const existing = result[key];
    if (existing) {
      result[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      result[key] = value;
    }
  });

  return result;
}

/**
 * Get query parameter value
 */
export function getQueryParam(search: string, key: string): string | null {
  const params = new URLSearchParams(search);
  return params.get(key);
}

/**
 * Remove query parameters from URL
 */
export function removeQueryParams(url: string, keys: string[]): string {
  const urlObj = new URL(url);
  keys.forEach(key => urlObj.searchParams.delete(key));
  return urlObj.toString();
}

/**
 * Update query parameters
 */
export function updateQueryParams(
  url: string,
  updates: Record<string, string | null>
): string {
  const urlObj = new URL(url);
  
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null) {
      urlObj.searchParams.delete(key);
    } else {
      urlObj.searchParams.set(key, value);
    }
  });

  return urlObj.toString();
}

/**
 * Get domain from URL
 */
export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

/**
 * Get path from URL
 */
export function getPath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return '';
  }
}

/**
 * Check if URL is absolute
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Check if URL is relative
 */
export function isRelativeUrl(url: string): boolean {
  return !isAbsoluteUrl(url);
}

/**
 * Join URL paths
 */
export function joinPaths(...paths: string[]): string {
  return paths
    .map((path, index) => {
      if (index === 0) return path.replace(/\/$/, '');
      if (index === paths.length - 1) return path.replace(/^\//, '');
      return path.replace(/^\/|\/$/g, '');
    })
    .filter(Boolean)
    .join('/');
}

/**
 * Normalize URL (remove trailing slash, ensure protocol)
 */
export function normalizeUrl(url: string): string {
  let normalized = url.trim();
  
  // Add protocol if missing
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }
  
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '');
  
  return normalized;
}

/**
 * Check if two URLs are same origin
 */
export function isSameOrigin(url1: string, url2: string): boolean {
  try {
    const u1 = new URL(url1);
    const u2 = new URL(url2);
    return u1.origin === u2.origin;
  } catch {
    return false;
  }
}

/**
 * Encode URI component safely
 */
export function encodeParam(value: string): string {
  return encodeURIComponent(value);
}

/**
 * Decode URI component safely
 */
export function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Get file extension from URL
 */
export function getFileExtension(url: string): string {
  const path = getPath(url);
  const match = path.match(/\.([^.]+)$/);
  return match ? match[1] : '';
}

/**
 * Check if URL points to image
 */
export function isImageUrl(url: string): boolean {
  const ext = getFileExtension(url).toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
}

/**
 * Create shareable URL for social media
 */
export function createShareUrl(platform: 'twitter' | 'facebook' | 'linkedin', options: {
  url: string;
  text?: string;
  hashtags?: string[];
}): string {
  const { url, text, hashtags } = options;
  
  switch (platform) {
    case 'twitter':
      return buildUrl('https://twitter.com/intent/tweet', {
        url,
        text,
        hashtags: hashtags?.join(','),
      });
    case 'facebook':
      return buildUrl('https://www.facebook.com/sharer/sharer.php', { u: url });
    case 'linkedin':
      return buildUrl('https://www.linkedin.com/sharing/share-offsite', { url });
    default:
      return url;
  }
}

