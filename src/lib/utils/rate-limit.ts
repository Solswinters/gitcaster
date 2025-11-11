// Rate limiting utility for API protection

interface RateLimitConfig {
  interval: number; // in milliseconds
  maxRequests: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if request is allowed for given identifier
   * @param identifier - Unique identifier (e.g., IP address, user ID)
   * @returns Boolean indicating if request is allowed
   */
  check(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Filter out old requests outside the interval
    const recentRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.config.interval
    );
    
    if (recentRequests.length >= this.config.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    return true;
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

export { RateLimiter, type RateLimitConfig };

