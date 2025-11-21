import React, { useState, useEffect, useCallback } from 'react';
import { useComponentBase } from '../../hooks/useComponentBase';

export interface AlertProps {
  title?: string | React.ReactNode;
  message: string | React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  severity?: 'low' | 'medium' | 'high'; // Visual emphasis level
  icon?: React.ReactNode;
  onClose?: () => void;
  dismissible?: boolean;
  dismissAfter?: number; // Auto-dismiss after X milliseconds
  actions?: React.ReactNode; // Action buttons
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  messageClassName?: string;
  showIcon?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  message,
  variant = 'info',
  severity = 'medium',
  icon,
  onClose,
  dismissible = false,
  dismissAfter,
  actions,
  className = '',
  iconClassName = '',
  titleClassName = '',
  messageClassName = '',
  showIcon = true,
}) => {
  const { theme } = useComponentBase();
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (dismissAfter && dismissAfter > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, dismissAfter);

      return () => clearTimeout(timer);
    }
  }, [dismissAfter]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300); // Match animation duration
  }, [onClose]);

  if (!visible) return null;

  const getVariantStyles = () => {
    const baseStyles = 'rounded-lg border';

    switch (variant) {
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200`;
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200`;
    }
  };

  const getSeverityStyles = () => {
    switch (severity) {
      case 'low':
        return 'border-l-2';
      case 'high':
        return 'border-l-8';
      case 'medium':
      default:
        return 'border-l-4';
    }
  };

  const getDefaultIcon = () => {
    switch (variant) {
      case 'info':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`alert p-4 flex items-start gap-3 ${getVariantStyles()} ${getSeverityStyles()} ${
        isExiting ? 'animate-fade-out' : 'animate-fade-in'
      } ${className}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Icon */}
      {showIcon && (
        <div className={`alert-icon flex-shrink-0 mt-0.5 ${iconClassName}`}>{icon || getDefaultIcon()}</div>
      )}

      {/* Content */}
      <div className="alert-content flex-1 min-w-0">
        {title && (
          <div className={`alert-title font-semibold mb-1 ${titleClassName}`}>
            {title}
          </div>
        )}
        <div className={`alert-message text-sm ${messageClassName}`}>{message}</div>

        {/* Actions */}
        {actions && <div className="alert-actions mt-3 flex items-center gap-2">{actions}</div>}
      </div>

      {/* Close button */}
      {dismissible && (
        <button
          type="button"
          className="alert-close flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
          onClick={handleClose}
          aria-label="Close alert"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
