/**
 * Divider Component
 * 
 * Visual separator with optional text
 */

import { ReactNode } from 'react';
import { cn } from '@/core/utils/cn';

interface DividerProps {
  children?: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({
  children,
  orientation = 'horizontal',
  className,
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'w-px bg-gray-200 self-stretch',
          className
        )}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (children) {
    return (
      <div className={cn('flex items-center', className)} role="separator">
        <div className="flex-1 border-t border-gray-200" />
        <span className="px-4 text-sm text-gray-500">{children}</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>
    );
  }

  return (
    <hr
      className={cn('border-t border-gray-200', className)}
      role="separator"
      aria-orientation="horizontal"
    />
  );
}

