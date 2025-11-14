import {
  generateMetaTags,
  generateStructuredData,
  createSlug,
  truncateDescription,
  generateCanonicalUrl,
  extractKeywords,
} from '@/shared/utils/seo/seoUtils';

describe('SEO Utils', () => {
  describe('generateMetaTags', () => {
    it('generates basic meta tags', () => {
      const result = generateMetaTags({
        title: 'Test Page',
        description: 'Test description',
      });

      expect(result.title).toBe('Test Page');
      expect(result.description).toBe('Test description');
    });

    it('generates Open Graph tags', () => {
      const result = generateMetaTags({
        ogTitle: 'OG Title',
        ogDescription: 'OG Description',
        ogImage: 'https://example.com/image.jpg',
        ogUrl: 'https://example.com',
      });

      expect(result['og:title']).toBe('OG Title');
      expect(result['og:description']).toBe('OG Description');
      expect(result['og:image']).toBe('https://example.com/image.jpg');
      expect(result['og:url']).toBe('https://example.com');
    });

    it('generates Twitter Card tags', () => {
      const result = generateMetaTags({
        twitterCard: 'summary_large_image',
        twitterSite: '@site',
        twitterCreator: '@creator',
      });

      expect(result['twitter:card']).toBe('summary_large_image');
      expect(result['twitter:site']).toBe('@site');
      expect(result['twitter:creator']).toBe('@creator');
    });

    it('generates keywords from array', () => {
      const result = generateMetaTags({
        keywords: ['web', 'development', 'react'],
      });

      expect(result.keywords).toBe('web, development, react');
    });
  });

  describe('generateStructuredData', () => {
    it('generates JSON-LD structured data', () => {
      const result = generateStructuredData('Person', {
        name: 'John Doe',
        email: 'john@example.com',
      });

      const parsed = JSON.parse(result);
      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('Person');
      expect(parsed.name).toBe('John Doe');
    });
  });

  describe('createSlug', () => {
    it('creates slug from text', () => {
      expect(createSlug('Hello World')).toBe('hello-world');
      expect(createSlug('This is a Test!')).toBe('this-is-a-test');
    });

    it('handles special characters', () => {
      expect(createSlug('Hello & World!')).toBe('hello-world');
      expect(createSlug('Test@123#456')).toBe('test123456');
    });

    it('handles multiple spaces and dashes', () => {
      expect(createSlug('Hello   World')).toBe('hello-world');
      expect(createSlug('test---slug')).toBe('test-slug');
    });

    it('trims leading and trailing dashes', () => {
      expect(createSlug('-test-')).toBe('test');
      expect(createSlug('---hello---')).toBe('hello');
    });
  });

  describe('truncateDescription', () => {
    it('truncates long text', () => {
      const longText = 'a'.repeat(200);
      const result = truncateDescription(longText);

      expect(result.length).toBeLessThanOrEqual(160);
      expect(result.endsWith('...')).toBe(true);
    });

    it('does not truncate short text', () => {
      const shortText = 'Short description';
      expect(truncateDescription(shortText)).toBe(shortText);
    });

    it('respects custom max length', () => {
      const text = 'a'.repeat(100);
      const result = truncateDescription(text, 50);

      expect(result.length).toBeLessThanOrEqual(50);
    });
  });

  describe('generateCanonicalUrl', () => {
    it('generates canonical URL', () => {
      const result = generateCanonicalUrl('/about', 'https://example.com');
      expect(result).toBe('https://example.com/about');
    });

    it('handles trailing slash in base URL', () => {
      const result = generateCanonicalUrl('/about', 'https://example.com/');
      expect(result).toBe('https://example.com/about');
    });

    it('handles missing leading slash in path', () => {
      const result = generateCanonicalUrl('about', 'https://example.com');
      expect(result).toBe('https://example.com/about');
    });
  });

  describe('extractKeywords', () => {
    it('extracts keywords from text', () => {
      const text =
        'react development is great for building web applications with react components';
      const keywords = extractKeywords(text, 3);

      expect(keywords).toContain('react');
      expect(keywords.length).toBeLessThanOrEqual(3);
    });

    it('filters out short words', () => {
      const text = 'the cat and dog run fast';
      const keywords = extractKeywords(text);

      expect(keywords).not.toContain('the');
      expect(keywords).not.toContain('and');
    });

    it('sorts by frequency', () => {
      const text = 'test test test word word other';
      const keywords = extractKeywords(text);

      expect(keywords[0]).toBe('test');
    });
  });
});

