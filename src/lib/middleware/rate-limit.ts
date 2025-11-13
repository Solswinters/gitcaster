/**
 * Rate limiting middleware
 * Protects API routes from abuse
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: any) => string; // Custom key generator
  handler?: (req: any, res: any) => void; // Custom handler for rate limit exceeded
  skip?: (req: any) => boolean; // Skip rate limiting for certain requests
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Check if request should be rate limited
   */
  check(key: string, config: RateLimitConfig): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const entry = this.store[key];

    // No entry or expired entry
    if (!entry || now > entry.resetTime) {
      this.store[key] = {
        count: 1,
        resetTime: now + config.windowMs,
      };

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs,
      };
    }

    // Entry exists and not expired
    if (entry.count < config.maxRequests) {
      entry.count++;
      return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime,
      };
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    delete this.store[key];
  }

  /**
   * Get current count for a key
   */
  getCount(key: string): number {
    const entry = this.store[key];
    if (!entry || Date.now() > entry.resetTime) {
      return 0;
    }
    return entry.count;
  }

  /**
   * Destroy rate limiter and cleanup
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store = {};
  }
}

// Global rate limiter instance
const globalRateLimiter = new RateLimiter();

/**
 * Create rate limit middleware
 */
export function createRateLimiter(config: RateLimitConfig) {
  return function rateLimitMiddleware(req: any, res: any, next?: () => void) {
    // Skip if configured
    if (config.skip && config.skip(req)) {
      return next?.();
    }

    // Generate key (default: IP address)
    const key = config.keyGenerator 
      ? config.keyGenerator(req) 
      : getClientIp(req);

    // Check rate limit
    const result = globalRateLimiter.check(key, config);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', config.maxRequests);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));

    if (!result.allowed) {
      // Rate limit exceeded
      if (config.handler) {
        return config.handler(req, res);
      }

      res.setHeader('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000));
      return res.status(429).json({
        error: {
          message: 'Too many requests, please try again later',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        },
      });
    }

    // Continue
    return next?.();
  };
}

/**
 * Get client IP address
 */
function getClientIp(req: any): string {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

/**
 * Preset rate limit configurations
 */
export const rateLimitPresets = {
  // Strict limit for authentication endpoints
  strict: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },

  // Standard limit for most API endpoints
  standard: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
  },

  // Relaxed limit for read-only endpoints
  relaxed: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 120,
  },

  // Very strict for sensitive operations
  sensitive: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
  },
};

/**
 * Create rate limiter with preset
 */
export function createRateLimiterWithPreset(
  preset: keyof typeof rateLimitPresets,
  overrides?: Partial<RateLimitConfig>
) {
  return createRateLimiter({
    ...rateLimitPresets[preset],
    ...overrides,
  });
}

/**
 * Get rate limiter instance (for testing)
 */
export function getRateLimiterInstance(): RateLimiter {
  return globalRateLimiter;
}

