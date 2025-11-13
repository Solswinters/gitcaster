import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface ErrorDisplayProps {
  /**
   * The error message to display
   */
  message: string;
  
  /**
   * Optional error title
   */
  title?: string;
  
  /**
   * Display variant
   * - 'inline': Small inline alert (replaces InlineError)
   * - 'alert': Standard alert box (replaces ErrorAlert)
   * - 'banner': Full-width banner (replaces ErrorBanner)
   * - 'card': Card-style error display (replaces ErrorCard)
   * - 'page': Full-page error (replaces FallbackUI)
   */
  variant?: 'inline' | 'alert' | 'banner' | 'card' | 'page';
  
  /**
   * Error severity
   */
  severity?: 'error' | 'warning';
  
  /**
   * Retry callback
   */
  onRetry?: () => void;
  
  /**
   * Close/dismiss callback
   */
  onClose?: () => void;
  
  /**
   * Additional details to show
   */
  details?: string;
  
  /**
   * Custom icon
   */
  icon?: React.ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Unified Error Display Component
 * 
 * Replaces multiple legacy error components:
 * - ErrorAlert, ErrorBanner, ErrorCard, InlineError, FallbackUI
 * 
 * @example
 * // Simple inline error
 * <ErrorDisplay message="Invalid email" variant="inline" />
 * 
 * @example
 * // Card with retry
 * <ErrorDisplay 
 *   message="Failed to load data"
 *   variant="card"
 *   onRetry={handleRetry}
 * />
 * 
 * @example
 * // Full page error
 * <ErrorDisplay 
 *   message="Page not found"
 *   variant="page"
 *   title="404"
 * />
 */
export function ErrorDisplay({
  message,
  title,
  variant = 'alert',
  severity = 'error',
  onRetry,
  onClose,
  details,
  icon,
  className,
}: ErrorDisplayProps) {
  // Inline variant - compact error message
  if (variant === 'inline') {
    return (
      <Alert
        variant={severity}
        className={className}
        onClose={onClose}
      >
        <p className="text-sm">{message}</p>
      </Alert>
    );
  }

  // Banner variant - full-width notification
  if (variant === 'banner') {
    return (
      <div className={`w-full border-l-4 ${severity === 'error' ? 'border-red-600 bg-red-50' : 'border-yellow-600 bg-yellow-50'} ${className || ''}`}>
        <Alert
          variant={severity}
          title={title}
          onClose={onClose}
          icon={icon}
          className="border-0"
        >
          <p className="text-sm">{message}</p>
          {details && (
            <p className="text-xs mt-2 opacity-75">{details}</p>
          )}
        </Alert>
      </div>
    );
  }

  // Card variant - standalone error card
  if (variant === 'card') {
    return (
      <Card variant="bordered" className={className}>
        <div className="flex flex-col items-center text-center py-4">
          {icon && <div className="mb-4">{icon}</div>}
          {title && (
            <h3 className={`text-lg font-semibold mb-2 ${severity === 'error' ? 'text-red-900' : 'text-yellow-900'}`}>
              {title}
            </h3>
          )}
          <p className={`mb-4 ${severity === 'error' ? 'text-red-700' : 'text-yellow-700'}`}>
            {message}
          </p>
          {details && (
            <p className="text-sm text-gray-600 mb-4">{details}</p>
          )}
          <div className="flex gap-2">
            {onRetry && (
              <Button onClick={onRetry} variant="primary" size="sm">
                Try Again
              </Button>
            )}
            {onClose && (
              <Button onClick={onClose} variant="ghost" size="sm">
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Page variant - full page error
  if (variant === 'page') {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] px-4 ${className || ''}`}>
        {icon && <div className="mb-6">{icon}</div>}
        {title && (
          <h1 className={`text-4xl font-bold mb-4 ${severity === 'error' ? 'text-red-900' : 'text-yellow-900'}`}>
            {title}
          </h1>
        )}
        <p className={`text-xl mb-6 text-center max-w-md ${severity === 'error' ? 'text-red-700' : 'text-yellow-700'}`}>
          {message}
        </p>
        {details && (
          <p className="text-sm text-gray-600 mb-6 text-center max-w-lg">
            {details}
          </p>
        )}
        <div className="flex gap-3">
          {onRetry && (
            <Button onClick={onRetry} variant="primary">
              Try Again
            </Button>
          )}
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Go Back
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default: Alert variant
  return (
    <Alert
      variant={severity}
      title={title}
      onClose={onClose}
      icon={icon}
      className={className}
    >
      <p>{message}</p>
      {details && (
        <p className="text-sm mt-2 opacity-75">{details}</p>
      )}
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-3">
          Try Again
        </Button>
      )}
    </Alert>
  );
}

// Convenience components for specific use cases
export function InlineError(props: Omit<ErrorDisplayProps, 'variant'>) {
  return <ErrorDisplay {...props} variant="inline" />;
}

export function ErrorBanner(props: Omit<ErrorDisplayProps, 'variant'>) {
  return <ErrorDisplay {...props} variant="banner" />;
}

export function ErrorCard(props: Omit<ErrorDisplayProps, 'variant'>) {
  return <ErrorDisplay {...props} variant="card" />;
}

export function PageError(props: Omit<ErrorDisplayProps, 'variant'>) {
  return <ErrorDisplay {...props} variant="page" />;
}

