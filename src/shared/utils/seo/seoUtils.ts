/**
 * SEO Utilities
 *
 * Utilities for SEO optimization
 *
 * @module shared/utils/seo/seoUtils
 */

export interface MetaTags {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  robots?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

/**
 * Generate meta tags for SEO
 */
export function generateMetaTags(tags: MetaTags): Record<string, string> {
  const meta: Record<string, string> = {};

  if (tags.title) meta.title = tags.title;
  if (tags.description) meta.description = tags.description;
  if (tags.keywords) meta.keywords = tags.keywords.join(', ');
  if (tags.author) meta.author = tags.author;
  if (tags.robots) meta.robots = tags.robots;

  // Open Graph
  if (tags.ogTitle) meta['og:title'] = tags.ogTitle;
  if (tags.ogDescription) meta['og:description'] = tags.ogDescription;
  if (tags.ogImage) meta['og:image'] = tags.ogImage;
  if (tags.ogUrl) meta['og:url'] = tags.ogUrl;
  if (tags.ogType) meta['og:type'] = tags.ogType;

  // Twitter Card
  if (tags.twitterCard) meta['twitter:card'] = tags.twitterCard;
  if (tags.twitterSite) meta['twitter:site'] = tags.twitterSite;
  if (tags.twitterCreator) meta['twitter:creator'] = tags.twitterCreator;

  return meta;
}

/**
 * Generate JSON-LD structured data
 */
export function generateStructuredData(type: string, data: Record<string, any>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  });
}

/**
 * Create SEO-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text for meta descriptions
 */
export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string, baseUrl: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string, count: number = 10): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3);

  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([word]) => word);
}

