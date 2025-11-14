/**
 * Banner Component
 *
 * Display important announcements and messages across the top of the page
 *
 * @module shared/components/feedback/Banner
 */

'use client';

import React, { ReactNode, useState } from 'react';

export interface BannerProps {
  children: ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const variantStyles = {
  info: 'bg-blue-50 border-blue-200 text-blue-900',
  success: 'bg-green-50 border-green-200 text-green-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  error: 'bg-red-50 border-red-200 text-red-900',
};

export function Banner({
  children,
  variant = 'info',
  dismissible = false,
  onDismiss,
  action,
  className = '',
}: BannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div
      className={`${variantStyles[variant]} border-b px-4 py-3 ${className}`}
      role="alert"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="text-sm">{children}</div>
        </div>

        <div className="flex items-center gap-2">
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium hover:underline whitespace-nowrap"
            >
              {action.label}
            </button>
          )}

          {dismissible && (
            <button
              onClick={handleDismiss}
              className="hover:opacity-70 p-1"
              aria-label="Dismiss banner"
            >
              <svg
                className="w-4 h-4"
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
        </div>
      </div>
    </div>
  );
}

