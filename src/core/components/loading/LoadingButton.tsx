/**
 * Button with loading state
 */

'use client';

import { Spinner } from './Spinner';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function LoadingButton({
  isLoading = false,
  loadingText,
  children,
  disabled,
  className = '',
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center gap-2 ${className}`}
    >
      {isLoading && <Spinner size="sm" />}
      <span className={isLoading ? 'opacity-0' : ''}>
        {isLoading && loadingText ? loadingText : children}
      </span>
    </button>
  );
}

