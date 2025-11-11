// URL utility functions

/**
 * Build a profile URL from a wallet address
 */
export function buildProfileUrl(address: string): string {
  return `/profile/${address.toLowerCase()}`;
}

/**
 * Build a full profile URL with domain
 */
export function buildFullProfileUrl(address: string, baseUrl: string): string {
  return `${baseUrl}${buildProfileUrl(address)}`;
}

/**
 * Extract slug from profile URL
 */
export function extractSlugFromUrl(url: string): string | null {
  const match = url.match(/\/profile\/([^/]+)/);
  return match ? match[1] : null;
}

