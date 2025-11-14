/**
 * Tag Component
 *
 * Compact element for labels, categories, and metadata
 *
 * @module shared/components/data-display/Tag
 */

'use client';

import React, { ReactNode } from 'react';

export interface TagProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  icon?: ReactNode;
  className?: string;
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  primary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  success: 'bg-green-100 text-green-800 hover:bg-green-200',
  warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  error: 'bg-red-100 text-red-800 hover:bg-red-200',
  info: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-base px-3 py-1',
};

export function Tag({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  icon,
  className = '',
}: TagProps) {
  const classes = [
    'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {icon && <span className="inline-flex">{icon}</span>}
      <span>{children}</span>
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center ml-1 hover:opacity-70 focus:outline-none"
          aria-label="Remove tag"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

export interface TagGroupProps {
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  wrap?: boolean;
  className?: string;
}

const spacingClasses = {
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-3',
};

export function TagGroup({
  children,
  spacing = 'md',
  wrap = true,
  className = '',
}: TagGroupProps) {
  const classes = [
    'flex items-center',
    spacingClasses[spacing],
    wrap && 'flex-wrap',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}

