/**
 * Centralized logging utility
 * Provides structured logging with different log levels
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private logs: LogEntry[] = []

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context)
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context)
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context)
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context, error)
  }

  /**
   * Core logging function
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }

    // Store log entry
    this.logs.push(entry)

    // Keep only last 1000 logs in memory
    if (this.logs.length > 1000) {
      this.logs.shift()
    }

    // Console output
    this.outputToConsole(entry)

    // Send to logging service in production
    if (!this.isDevelopment) {
      this.sendToLoggingService(entry)
    }
  }

  /**
   * Output log to console with formatting
   */
  private outputToConsole(entry: LogEntry) {
    const emoji = {
      [LogLevel.DEBUG]: '🔍',
      [LogLevel.INFO]: 'ℹ️',
      [LogLevel.WARN]: '⚠️',
      [LogLevel.ERROR]: '❌',
    }

    const color = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
    }

    const reset = '\x1b[0m'

    console.log(
      `${emoji[entry.level]} ${color[entry.level]}[${entry.level.toUpperCase()}]${reset} ${entry.message}`
    )

    if (entry.context) {
      console.log('  Context:', entry.context)
    }

    if (entry.error) {
      console.error('  Error:', entry.error)
      if (entry.error.stack) {
        console.error('  Stack:', entry.error.stack)
      }
    }
  }

  /**
   * Send log to external logging service
   */
  private sendToLoggingService(entry: LogEntry) {
    // TODO: Send to logging service (e.g., Sentry, LogRocket, Datadog)
    // Example: logService.send(entry)
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  /**
   * Clear all logs
   */
  clear() {
    this.logs = []
  }
}

export const logger = new Logger()

