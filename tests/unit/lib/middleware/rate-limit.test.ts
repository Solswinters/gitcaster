import { createRateLimiter, rateLimitPresets, getRateLimiterInstance } from '@/lib/middleware/rate-limit';

describe('Rate Limiter', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Clear rate limiter state
    const limiter = getRateLimiterInstance();
    (limiter as any).store = {};

    mockReq = {
      headers: {},
      connection: { remoteAddress: '127.0.0.1' },
    };

    mockRes = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  afterAll(() => {
    // Cleanup
    getRateLimiterInstance().destroy();
  });

  describe('Basic rate limiting', () => {
    it('should allow requests within limit', () => {
      const middleware = createRateLimiter({
        windowMs: 60000,
        maxRequests: 5,
      });

      // First request
      middleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 5);
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 4);
    });

    it('should block requests exceeding limit', () => {
      const middleware = createRateLimiter({
        windowMs: 60000,
        maxRequests: 2,
      });

      // First two requests should pass
      middleware(mockReq, mockRes, mockNext);
      middleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(2);

      // Third request should be blocked
      mockNext.mockClear();
      middleware(mockReq, mockRes, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: expect.objectContaining({
          code: 'RATE_LIMIT_EXCEEDED',
        }),
      });
    });

    it('should set correct rate limit headers', () => {
      const middleware = createRateLimiter({
        windowMs: 60000,
        maxRequests: 10,
      });

      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 10);
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 9);
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', expect.any(Number));
    });

    it('should set Retry-After header when rate limited', () => {
      const middleware = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
      });

      // First request passes
      middleware(mockReq, mockRes, mockNext);

      // Second request blocked
      middleware(mockReq, mockRes, mockNext);
      expect(mockRes.setHeader).toHaveBeenCalledWith('Retry-After', expect.any(Number));
    });
  });

  describe('Custom key generator', () => {
    it('should use custom key generator', () => {
      const middleware = createRateLimiter({
        windowMs: 60000,
        maxRequests: 2,
        keyGenerator: (req) => req.headers['x-api-key'] || 'default',
      });

      const req1 = { ...mockReq, headers: { 'x-api-key': 'key1' } };
      const req2 = { ...mockReq, headers: { 'x-api-key': 'key2' } };

      // Each key should have its own limit
      middleware(req1, mockRes, mockNext);
      middleware(req1, mockRes, mockNext);
      middleware(req2, mockRes, mockNext);
      middleware(req2, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(4);

      // Third request with key1 should be blocked
      mockNext.mockClear();
      middleware(req1, mockRes, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Custom handler', () => {
    it('should use custom handler when rate limit exceeded', () => {
      const customHandler = jest.fn();
      
      const middleware = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
        handler: customHandler,
      });

      middleware(mockReq, mockRes, mockNext);
      middleware(mockReq, mockRes, mockNext);

      expect(customHandler).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('Skip function', () => {
    it('should skip rate limiting when skip returns true', () => {
      const middleware = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
        skip: (req) => req.headers['x-skip'] === 'true',
      });

      const skippedReq = { ...mockReq, headers: { 'x-skip': 'true' } };

      // Should allow unlimited requests when skipped
      middleware(skippedReq, mockRes, mockNext);
      middleware(skippedReq, mockRes, mockNext);
      middleware(skippedReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(3);
    });
  });

  describe('IP address detection', () => {
    it('should use x-forwarded-for header', () => {
      const middleware = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
      });

      const req1 = { ...mockReq, headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' } };
      const req2 = { ...mockReq, headers: { 'x-forwarded-for': '9.10.11.12' } };

      middleware(req1, mockRes, mockNext);
      middleware(req2, mockRes, mockNext);

      // Different IPs should have separate limits
      expect(mockNext).toHaveBeenCalledTimes(2);
    });

    it('should use x-real-ip header as fallback', () => {
      const middleware = createRateLimiter({
        windowMs: 60000,
        maxRequests: 1,
      });

      const req = { 
        ...mockReq, 
        headers: { 'x-real-ip': '1.2.3.4' },
        connection: { remoteAddress: undefined },
      };

      middleware(req, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Rate limit presets', () => {
    it('should have strict preset', () => {
      expect(rateLimitPresets.strict).toEqual({
        windowMs: 15 * 60 * 1000,
        maxRequests: 5,
      });
    });

    it('should have standard preset', () => {
      expect(rateLimitPresets.standard).toEqual({
        windowMs: 60 * 1000,
        maxRequests: 60,
      });
    });

    it('should have relaxed preset', () => {
      expect(rateLimitPresets.relaxed).toEqual({
        windowMs: 60 * 1000,
        maxRequests: 120,
      });
    });

    it('should have sensitive preset', () => {
      expect(rateLimitPresets.sensitive).toEqual({
        windowMs: 60 * 60 * 1000,
        maxRequests: 10,
      });
    });
  });

  describe('Rate limiter instance methods', () => {
    it('should reset rate limit for a key', () => {
      const limiter = getRateLimiterInstance();
      const key = 'test-key';

      limiter.check(key, { windowMs: 60000, maxRequests: 5 });
      expect(limiter.getCount(key)).toBe(1);

      limiter.reset(key);
      expect(limiter.getCount(key)).toBe(0);
    });

    it('should get count for a key', () => {
      const limiter = getRateLimiterInstance();
      const key = 'test-key-2';

      expect(limiter.getCount(key)).toBe(0);

      limiter.check(key, { windowMs: 60000, maxRequests: 5 });
      expect(limiter.getCount(key)).toBe(1);

      limiter.check(key, { windowMs: 60000, maxRequests: 5 });
      expect(limiter.getCount(key)).toBe(2);
    });
  });
});

