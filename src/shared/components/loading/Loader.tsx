import { cn } from '@/lib/utils/cn';

export type LoaderVariant = 'spinner' | 'dots' | 'ring' | 'bounce' | 'pulse' | 'wave';
export type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  className?: string;
  color?: string;
}

/**
 * Unified loading component with multiple variants
 * @param variant - Type of loading animation
 * @param size - Size of the loader
 * @param className - Additional CSS classes
 * @param color - Color class for the loader (defaults to blue-600)
 */
export function Loader({ 
  variant = 'spinner', 
  size = 'md', 
  className,
  color = 'text-blue-600'
}: LoaderProps) {
  const sizeMap = {
    sm: { spinner: 'h-4 w-4', dot: 'w-1.5 h-1.5', ring: 24 },
    md: { spinner: 'h-8 w-8', dot: 'w-2 h-2', ring: 40 },
    lg: { spinner: 'h-12 w-12', dot: 'w-3 h-3', ring: 56 },
  };

  if (variant === 'spinner') {
    return (
      <svg
        className={cn('animate-spin', sizeMap[size].spinner, color, className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-1', className)}>
        {[0, 150, 300].map((delay, i) => (
          <div
            key={i}
            className={cn(sizeMap[size].dot, 'bg-current rounded-full animate-bounce', color)}
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'ring') {
    return (
      <div
        className={cn('animate-spin rounded-full border-4 border-gray-200', className)}
        style={{
          width: sizeMap[size].ring,
          height: sizeMap[size].ring,
          borderTopColor: 'currentColor',
        }}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === 'bounce') {
    return (
      <div className={cn('flex space-x-2', className)}>
        {[0, 100, 200].map((delay, i) => (
          <div
            key={i}
            className={cn(sizeMap[size].dot, 'bg-current rounded-full animate-bounce', color)}
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <span className={cn('inline-flex space-x-1', className)}>
        {[0, 200, 400].map((delay, i) => (
          <span
            key={i}
            className={cn(sizeMap[size].dot, 'bg-current rounded-full animate-pulse', color)}
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={cn('flex items-end space-x-1 h-8', className)}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn('w-1 bg-current rounded-t', color)}
            style={{
              animation: 'wave 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        <style jsx>{`
          @keyframes wave {
            0%, 60%, 100% {
              height: 0.5rem;
            }
            30% {
              height: 2rem;
            }
          }
        `}</style>
      </div>
    );
  }

  return null;
}

