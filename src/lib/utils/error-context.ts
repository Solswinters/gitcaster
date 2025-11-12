/**
 * Error context for tracking where errors occur
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: Date;
  additionalData?: Record<string, unknown>;
}

/**
 * Enhanced error with context
 */
export class ContextError extends Error {
  public context: ErrorContext;

  constructor(message: string, context: ErrorContext = {}) {
    super(message);
    this.name = 'ContextError';
    this.context = {
      ...context,
      timestamp: context.timestamp || new Date(),
    };
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ContextError);
    }
  }
}

/**
 * Create a context error from an existing error
 */
export function addErrorContext(error: unknown, context: ErrorContext): ContextError {
  const message = error instanceof Error ? error.message : String(error);
  const contextError = new ContextError(message, context);
  
  // Preserve original stack trace if available
  if (error instanceof Error && error.stack) {
    contextError.stack = error.stack;
  }
  
  return contextError;
}

