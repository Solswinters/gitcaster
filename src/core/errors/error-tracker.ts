/**
 * Error tracking utility
 */

export interface ErrorTrackingOptions {
  user?: {
    id: string;
    email?: string;
    username?: string;
  };
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

export class ErrorTracker {
  private static enabled = process.env.NODE_ENV === 'production';

  static capture(error: Error, options?: ErrorTrackingOptions): void {
    if (!this.enabled) {
      console.error('[ErrorTracker]', error, options);
      return;
    }

    // TODO: Integrate with Sentry or other error tracking service
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      user: options?.user,
      tags: options?.tags,
      extra: options?.extra,
      timestamp: new Date().toISOString(),
    };

    // Log for now
    console.error('[ErrorTracker]', JSON.stringify(errorData, null, 2));
  }

  static captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', options?: ErrorTrackingOptions): void {
    if (!this.enabled) {
      console.log(`[ErrorTracker] ${level.toUpperCase()}:`, message, options);
      return;
    }

    // TODO: Integrate with error tracking service
    const logData = {
      message,
      level,
      user: options?.user,
      tags: options?.tags,
      extra: options?.extra,
      timestamp: new Date().toISOString(),
    };

    console.log('[ErrorTracker]', JSON.stringify(logData, null, 2));
  }

  static setUser(user: ErrorTrackingOptions['user']): void {
    // TODO: Set user context for error tracking service
    console.log('[ErrorTracker] Set user:', user);
  }

  static clearUser(): void {
    // TODO: Clear user context for error tracking service
    console.log('[ErrorTracker] Clear user');
  }
}

