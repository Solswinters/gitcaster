import { ReactNode } from 'react';
import { Loader, LoaderVariant, LoaderSize } from './Loader';
import { cn } from '@/core/utils/cn';

interface LoadingContainerProps {
  /**
   * Whether to show loading state
   */
  loading: boolean;
  /**
   * Content to show when not loading
   */
  children: ReactNode;
  /**
   * Loading indicator variant
   */
  variant?: LoaderVariant;
  /**
   * Size of loading indicator
   */
  size?: LoaderSize;
  /**
   * Loading message
   */
  message?: string;
  /**
   * Minimum height for the loading container
   */
  minHeight?: string;
  /**
   * Whether to show as overlay over content
   */
  overlay?: boolean;
  className?: string;
}

/**
 * Container that shows loading state or content
 */
export function LoadingContainer({
  loading,
  children,
  variant = 'spinner',
  size = 'md',
  message,
  minHeight = '200px',
  overlay = false,
  className,
}: LoadingContainerProps) {
  if (overlay && loading) {
    return (
      <div className={cn('relative', className)}>
        {children}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
          <Loader variant={variant} size={size} />
          {message && (
            <p className="mt-4 text-sm text-gray-600">{message}</p>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div 
        className={cn('flex flex-col items-center justify-center', className)}
        style={{ minHeight }}
      >
        <Loader variant={variant} size={size} />
        {message && (
          <p className="mt-4 text-sm text-gray-600">{message}</p>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

interface LoadingScreenProps {
  /**
   * Loading message
   */
  message?: string;
  /**
   * Variant of loader
   */
  variant?: LoaderVariant;
  /**
   * Size of loader
   */
  size?: LoaderSize;
}

/**
 * Full-screen loading indicator
 */
export function LoadingScreen({ 
  message = 'Loading...', 
  variant = 'spinner',
  size = 'lg'
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col items-center justify-center z-50">
      <Loader variant={variant} size={size} />
      <p className="mt-6 text-gray-600 text-lg">{message}</p>
    </div>
  );
}

interface LoadingBackdropProps {
  /**
   * Whether backdrop is visible
   */
  show: boolean;
  /**
   * Loading message
   */
  message?: string;
  /**
   * Variant of loader
   */
  variant?: LoaderVariant;
  /**
   * Whether backdrop is transparent
   */
  transparent?: boolean;
}

/**
 * Full-screen backdrop with loading indicator
 */
export function LoadingBackdrop({ 
  show, 
  message,
  variant = 'spinner',
  transparent = false 
}: LoadingBackdropProps) {
  if (!show) return null;

  return (
    <div 
      className={cn(
        'fixed inset-0 flex flex-col items-center justify-center z-50',
        transparent ? 'bg-black/20' : 'bg-white/95'
      )}
    >
      <Loader variant={variant} size="lg" />
      {message && (
        <p className="mt-6 text-gray-800 text-lg font-medium">{message}</p>
      )}
    </div>
  );
}

interface InlineLoaderProps {
  /**
   * Loading message to show inline
   */
  message?: string;
  /**
   * Size of the loader
   */
  size?: LoaderSize;
  /**
   * Variant of loader
   */
  variant?: LoaderVariant;
  className?: string;
}

/**
 * Inline loading indicator with optional message
 */
export function InlineLoader({ 
  message = 'Loading...', 
  size = 'sm',
  variant = 'dots',
  className 
}: InlineLoaderProps) {
  return (
    <span className={cn('inline-flex items-center space-x-2', className)}>
      <Loader variant={variant} size={size} />
      <span className="text-sm text-gray-600">{message}</span>
    </span>
  );
}

