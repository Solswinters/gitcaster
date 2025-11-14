/**
 * Drawer Component
 *
 * Slide-out drawer for sidebars and panels
 *
 * @module shared/components/overlays/Drawer
 */

'use client';

import React, { useEffect } from 'react';
import { useKeyPress } from '@/shared/hooks';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'top' | 'bottom';
  title?: string;
  children: React.ReactNode;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  position = 'right',
  title,
  children,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
}: DrawerProps) {
  useKeyPress('Escape', () => {
    if (closeOnEscape && isOpen) {
      onClose();
    }
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const positionClasses = {
    left: 'top-0 left-0 h-full w-80',
    right: 'top-0 right-0 h-full w-80',
    top: 'top-0 left-0 w-full h-80',
    bottom: 'bottom-0 left-0 w-full h-80',
  };

  const slideClasses = {
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    top: isOpen ? 'translate-y-0' : '-translate-y-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed ${positionClasses[position]} bg-white shadow-xl z-50 transform transition-transform duration-300 ${slideClasses[position]} ${className}`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close drawer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100% - 80px)' }}>
          {children}
        </div>
      </div>
    </>
  );
}

