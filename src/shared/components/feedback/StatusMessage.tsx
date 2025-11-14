/**
 * Status Message Component
 *
 * Display status messages with icons and actions
 *
 * @module shared/components/feedback/StatusMessage
 */

'use client';

import React, { ReactNode } from 'react';

export interface StatusMessageProps {
  title: string;
  message?: ReactNode;
  status: 'success' | 'error' | 'warning' | 'info' | 'loading';
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  fullPage?: boolean;
  className?: string;
}

const statusConfig = {
  success: {
    icon: '✓',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  error: {
    icon: '✕',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  warning: {
    icon: '⚠',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  info: {
    icon: 'ℹ',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  loading: {
    icon: '⟳',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
};

export function StatusMessage({
  title,
  message,
  status,
  icon,
  action,
  fullPage = false,
  className = '',
}: StatusMessageProps) {
  const config = statusConfig[status];
  const displayIcon = icon || config.icon;

  const content = (
    <div
      className={`text-center ${config.bgColor} ${config.borderColor} border rounded-lg p-8 ${className}`}
    >
      {displayIcon && (
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${config.bgColor} ${config.color} text-3xl mb-4`}>
          {status === 'loading' ? (
            <div className="animate-spin">{displayIcon}</div>
          ) : (
            displayIcon
          )}
        </div>
      )}

      <h3 className={`text-2xl font-semibold ${config.color} mb-2`}>{title}</h3>

      {message && (
        <div className="text-gray-600 mb-6 max-w-md mx-auto">{message}</div>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            status === 'error'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : status === 'success'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {action.label}
        </button>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">{content}</div>
      </div>
    );
  }

  return content;
}

// Specialized status message components
export interface SuccessMessageProps extends Omit<StatusMessageProps, 'status'> {}

export function SuccessMessage(props: SuccessMessageProps) {
  return <StatusMessage {...props} status="success" />;
}

export interface ErrorMessageProps extends Omit<StatusMessageProps, 'status'> {}

export function ErrorMessage(props: ErrorMessageProps) {
  return <StatusMessage {...props} status="error" />;
}

export interface LoadingMessageProps extends Omit<StatusMessageProps, 'status'> {}

export function LoadingMessage(props: LoadingMessageProps) {
  return <StatusMessage {...props} status="loading" />;
}

