/**
 * Structured logging system with log levels and contexts
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  metadata?: Record<string, any>;
}

interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  pretty: boolean;
}

class StructuredLogger {
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: this.parseLogLevel(process.env.LOG_LEVEL) || LogLevel.INFO,
      enableConsole: process.env.NODE_ENV !== 'test',
      enableFile: process.env.NODE_ENV === 'production',
      pretty: process.env.NODE_ENV === 'development',
      ...config,
    };
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    const logContext = {
      ...context,
    };

    if (error) {
      logContext.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    this.log(LogLevel.ERROR, message, logContext);
  }

  /**
   * Log fatal error
   */
  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    const logContext = {
      ...context,
    };

    if (error) {
      logContext.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    this.log(LogLevel.FATAL, message, logContext);
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (level < this.config.level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      message,
      context,
    };

    // Add to buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > 1000) {
      this.logBuffer.shift();
    }

    // Output to console
    if (this.config.enableConsole) {
      this.writeToConsole(entry, level);
    }

    // In production, send to logging service
    if (this.config.enableFile && process.env.NODE_ENV === 'production') {
      this.writeToService(entry);
    }
  }

  /**
   * Write to console
   */
  private writeToConsole(entry: LogEntry, level: LogLevel): void {
    if (this.config.pretty) {
      // Pretty print for development
      const color = this.getLevelColor(level);
      const levelStr = `[${entry.level}]`.padEnd(8);
      console.log(`${color}${levelStr}\x1b[0m ${entry.message}`);
      
      if (entry.context) {
        console.log('  Context:', entry.context);
      }
      
      if (entry.context?.error) {
        console.error('  Error:', entry.context.error);
      }
    } else {
      // JSON format for production
      console.log(JSON.stringify(entry));
    }
  }

  /**
   * Get ANSI color code for log level
   */
  private getLevelColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return '\x1b[36m'; // Cyan
      case LogLevel.INFO:
        return '\x1b[32m'; // Green
      case LogLevel.WARN:
        return '\x1b[33m'; // Yellow
      case LogLevel.ERROR:
        return '\x1b[31m'; // Red
      case LogLevel.FATAL:
        return '\x1b[35m'; // Magenta
      default:
        return '\x1b[0m'; // Reset
    }
  }

  /**
   * Write to logging service
   */
  private writeToService(entry: LogEntry): void {
    // TODO: Integrate with logging service (Datadog, CloudWatch, etc.)
    // For now, just ensure it's in JSON format
    const formatted = JSON.stringify(entry);
    
    // In a real implementation, this would send to a logging service
    // Example: datadogLogger.log(formatted);
  }

  /**
   * Parse log level from string
   */
  private parseLogLevel(level?: string): LogLevel | undefined {
    if (!level) return undefined;
    
    const levelUpper = level.toUpperCase();
    if (levelUpper in LogLevel) {
      return LogLevel[levelUpper as keyof typeof LogLevel] as LogLevel;
    }
    
    return undefined;
  }

  /**
   * Create child logger with additional context
   */
  createChild(context: Record<string, any>): ChildLogger {
    return new ChildLogger(this, context);
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  /**
   * Clear log buffer
   */
  clearBuffer(): void {
    this.logBuffer = [];
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }
}

/**
 * Child logger with additional context
 */
class ChildLogger {
  constructor(
    private parent: StructuredLogger,
    private context: Record<string, any>
  ) {}

  debug(message: string, additionalContext?: Record<string, any>): void {
    this.parent.debug(message, { ...this.context, ...additionalContext });
  }

  info(message: string, additionalContext?: Record<string, any>): void {
    this.parent.info(message, { ...this.context, ...additionalContext });
  }

  warn(message: string, additionalContext?: Record<string, any>): void {
    this.parent.warn(message, { ...this.context, ...additionalContext });
  }

  error(message: string, error?: Error, additionalContext?: Record<string, any>): void {
    this.parent.error(message, error, { ...this.context, ...additionalContext });
  }

  fatal(message: string, error?: Error, additionalContext?: Record<string, any>): void {
    this.parent.fatal(message, error, { ...this.context, ...additionalContext });
  }
}

// Global logger instance
export const logger = new StructuredLogger();

// Export for testing
export { StructuredLogger };

