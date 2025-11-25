import { Loader2 } from 'lucide-react';

import { cn } from '@/core/utils/cn';

interface InlineLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * InlineLoader utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of InlineLoader.
 */
export function InlineLoader({ size = 'md', className }: InlineLoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size], className)} />
  );
}

