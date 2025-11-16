/**
 * Skeleton loader component for loading states
 */

'use client';

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function SkeletonLoader({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rectangular',
}: SkeletonLoaderProps) {
  const baseClass = 'animate-pulse bg-muted';
  
  const variantClass = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  }[variant];

  return (
    <div
      className={`${baseClass} ${variantClass} ${className}`}
      style={{ width, height }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

