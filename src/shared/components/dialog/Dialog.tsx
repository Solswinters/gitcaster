import React, { useEffect, useCallback, useRef } from 'react';

import { createPortal } from 'react-dom';

import { useComponentBase } from '../../hooks/useComponentBase';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'centered' | 'side' | 'fullscreen';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  backdropClassName?: string;
  animated?: boolean;
  persistent?: boolean; // If true, cannot be closed by backdrop click or escape
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  variant = 'default',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  backdropClassName = '',
  animated = true,
  persistent = false,
}) => {
  const { theme } = useComponentBase();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap
  useEffect(() => {
    if (open && dialogRef.current) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      dialogRef.current.focus();

      return () => {
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [open]);

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape && open && !persistent) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, closeOnEscape, onClose, persistent]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && closeOnBackdropClick && !persistent) {
        onClose();
      }
    },
    [closeOnBackdropClick, onClose, persistent],
  );

  const getSizeStyles = () => {
    switch (size) {
      case 'xs':
        return 'max-w-xs';
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case 'full':
        return 'max-w-full w-full h-full';
      default:
        return 'max-w-md';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'centered':
        return 'flex items-center justify-center p-4';
      case 'side':
        return 'flex items-start justify-end'; // Slide from right
      case 'fullscreen':
        return 'flex items-stretch justify-center';
      case 'default':
      default:
        return 'flex items-start justify-center pt-16 pb-4 px-4';
    }
  };

  const getDialogPositionStyles = () => {
    if (variant === 'side') {
      return 'h-full rounded-none max-w-md w-full'; // Side panel
    }
    if (variant === 'fullscreen') {
      return 'h-full w-full rounded-none'; // Fullscreen
    }
    return `${getSizeStyles()} w-full rounded-lg`; // Normal centered dialog
  };

  const getAnimationStyles = () => {
    if (!animated) return '';

    if (variant === 'side') {
      return open
        ? 'transform transition-transform duration-300 ease-out translate-x-0'
        : 'transform transition-transform duration-300 ease-in translate-x-full';
    }

    return open
      ? 'transform transition-all duration-300 ease-out opacity-100 scale-100'
      : 'transform transition-all duration-300 ease-in opacity-0 scale-95';
  };

  if (!open && !animated) return null;

  const dialogContent = (
    <div
      className={`dialog-backdrop fixed inset-0 z-50 ${getVariantStyles()} ${
        open ? 'opacity-100' : 'opacity-0'
      } ${animated ? 'transition-opacity duration-300' : ''} ${backdropClassName}`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(2px)',
      }}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={`dialog bg-white dark:bg-gray-900 shadow-2xl ${getDialogPositionStyles()} ${getAnimationStyles()} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={`dialog-header flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 ${headerClassName}`}
          >
            {title && (
              <h2 id="dialog-title" className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                className="dialog-close-button text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={`dialog-body p-4 overflow-y-auto text-gray-700 dark:text-gray-300 ${bodyClassName}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={`dialog-footer flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 ${footerClassName}`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Render in a portal to ensure it's on top of everything
  return createPortal(dialogContent, document.body);
};

export default Dialog;
