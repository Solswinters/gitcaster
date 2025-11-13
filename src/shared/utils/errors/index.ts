/**
 * Error Handling System
 * 
 * Comprehensive error handling utilities for the application
 */

// Error service and core types
export {
  ErrorService,
  AppError,
  ErrorCode,
  handleError,
  createError,
  isAppError,
  isAbortError,
  isNetworkError,
  isTimeoutError,
} from './ErrorService';

// Error recovery strategies
export {
  retry,
  withTimeout,
  withFallback,
  firstSuccess,
  CircuitBreaker,
  safe,
  withAbort,
  debounceErrors,
} from './ErrorRecovery';

export type { RetryOptions } from './ErrorRecovery';

