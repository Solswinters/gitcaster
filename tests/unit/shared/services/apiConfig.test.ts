import {
  defaultAPIConfig,
  githubAPIConfig,
  talentAPIConfig,
  createAPIConfig,
} from '@/shared/services/apiConfig';

describe('API Config', () => {
  describe('defaultAPIConfig', () => {
    it('has required properties', () => {
      expect(defaultAPIConfig.baseURL).toBeDefined();
      expect(defaultAPIConfig.timeout).toBe(30000);
      expect(defaultAPIConfig.headers).toBeDefined();
      expect(defaultAPIConfig.headers['Content-Type']).toBe('application/json');
    });

    it('has retry configuration', () => {
      expect(defaultAPIConfig.retryAttempts).toBe(3);
      expect(defaultAPIConfig.retryDelay).toBe(1000);
    });
  });

  describe('githubAPIConfig', () => {
    it('has GitHub-specific configuration', () => {
      expect(githubAPIConfig.baseURL).toBe('https://api.github.com');
      expect(githubAPIConfig.headers).toBeDefined();
      expect(githubAPIConfig.headers?.['Accept']).toContain('application/vnd.github');
    });
  });

  describe('talentAPIConfig', () => {
    it('has Talent Protocol-specific configuration', () => {
      expect(talentAPIConfig.baseURL).toBeDefined();
      expect(talentAPIConfig.headers).toBeDefined();
    });
  });

  describe('createAPIConfig', () => {
    it('returns default config with no overrides', () => {
      const config = createAPIConfig();

      expect(config.baseURL).toBe(defaultAPIConfig.baseURL);
      expect(config.timeout).toBe(defaultAPIConfig.timeout);
    });

    it('merges overrides', () => {
      const config = createAPIConfig({
        baseURL: 'https://custom.api.com',
        timeout: 5000,
      });

      expect(config.baseURL).toBe('https://custom.api.com');
      expect(config.timeout).toBe(5000);
      // Other properties should be preserved
      expect(config.headers).toBeDefined();
    });

    it('merges headers correctly', () => {
      const config = createAPIConfig({
        headers: {
          'X-Custom-Header': 'value',
        },
      });

      expect(config.headers['Content-Type']).toBe('application/json');
      expect(config.headers['X-Custom-Header']).toBe('value');
    });

    it('overrides default headers', () => {
      const config = createAPIConfig({
        headers: {
          'Content-Type': 'application/xml',
        },
      });

      expect(config.headers['Content-Type']).toBe('application/xml');
    });
  });
});

