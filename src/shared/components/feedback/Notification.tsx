/**
 * Notification Component
 *
 * Display notifications and alerts with various styles
 *
 * @module shared/components/feedback/Notification
 */

'use client';

import React, { ReactNode, useEffect, useState } from 'react';

export interface NotificationProps {
  title: string;
  message?: ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
  className?: string;
}

const variantStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-400',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-400',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-400',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-400',
  },
};

const defaultIcons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export function Notification({
  title,
  message,
  variant = 'info',
  icon,
  action,
  onClose,
  autoClose = false,
  autoCloseDuration = 5000,
  className = '',
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const styles = variantStyles[variant];
  const displayIcon = icon || defaultIcons[variant];

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDuration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.bg} ${styles.border} border rounded-lg p-4 shadow-sm ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {displayIcon && (
          <div className={`flex-shrink-0 ${styles.icon} text-xl`}>
            {displayIcon}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold ${styles.text} mb-1`}>{title}</h4>
          {message && (
            <div className={`text-sm ${styles.text} opacity-90`}>{message}</div>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className={`mt-2 text-sm font-medium ${styles.text} hover:underline`}
            >
              {action.label}
            </button>
          )}
        </div>

        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className={`flex-shrink-0 ${styles.text} hover:opacity-70`}
            aria-label="Close notification"
          >
            <svg
              className="w-5 h-5"
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
  );
}

export interface NotificationStackProps {
  children: ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

export function NotificationStack({
  children,
  position = 'top-right',
  className = '',
}: NotificationStackProps) {
  const classes = [
    'fixed z-50 flex flex-col gap-4 max-w-md',
    positionClasses[position],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}

