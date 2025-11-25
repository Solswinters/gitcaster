import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/core/utils/cn';

/**
 * Card utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Card.
 */
export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="article"
      className={cn(
        'rounded-xl border border-gray-200 hover:border-gray-300 bg-white shadow-sm hover:shadow-md transition-all duration-200',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

/**
 * CardHeader utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of CardHeader.
 */
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

/**
 * CardTitle utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of CardTitle.
 */
export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

/**
 * CardContent utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of CardContent.
 */
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

