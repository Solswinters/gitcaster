/**
 * Logging Utility
 * 
 * Centralized logging with different log levels and formatting
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const level = entry.level.padEnd(5);
    const context = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    
    return `[${timestamp}] ${level} ${entry.message}${context}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
    };

    // In production, you might want to send logs to a service
    if (this.isProduction) {
      // TODO: Send to logging service (e.g., Sentry, LogRocket, etc.)
      if (level === LogLevel.ERROR) {
        console.error(this.formatMessage(entry), error);
      }
    } else {
      // Development logging
      const formatted = this.formatMessage(entry);
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formatted);
          break;
        case LogLevel.INFO:
          console.info(formatted);
          break;
        case LogLevel.WARN:
          console.warn(formatted);
          break;
        case LogLevel.ERROR:
          console.error(formatted, error);
          break;
      }
    }
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Log API request
   */
  apiRequest(method: string, url: string, context?: Record<string, any>) {
    this.info(`API Request: ${method} ${url}`, context);
  }

  /**
   * Log API response
   */
  apiResponse(method: string, url: string, status: number, duration: number) {
    this.info(`API Response: ${method} ${url} ${status} (${duration}ms)`);
  }

  /**
   * Log API error
   */
  apiError(method: string, url: string, error: Error, context?: Record<string, any>) {
    this.error(`API Error: ${method} ${url}`, error, context);
  }

  /**
   * Log user action
   */
  userAction(action: string, context?: Record<string, any>) {
    this.info(`User Action: ${action}`, context);
  }

  /**
   * Log performance metric
   */
  performance(metric: string, value: number, unit: string = 'ms') {
    this.info(`Performance: ${metric} = ${value}${unit}`);
  }
}

export const logger = new Logger();

