/**
 * NotificationItem Component
 *
 * Display a single notification
 *
 * @module features/notifications/components/NotificationItem
 */

'use client';

import React from 'react';
import { Badge } from '@/shared/components/ui';

export interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  read?: boolean;
  timestamp: string;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

export function NotificationItem({
  id,
  title,
  message,
  type = 'info',
  read = false,
  timestamp,
  onRead,
  onDelete,
  onClick,
  className = '',
}: NotificationItemProps) {
  const typeColors = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  const handleClick = () => {
    if (!read && onRead) {
      onRead(id);
    }
    onClick?.(id);
  };

  return (
    <div
      className={`p-4 border-b border-gray-200 ${
        !read ? 'bg-blue-50' : 'bg-white'
      } hover:bg-gray-50 transition-colors ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{title}</h4>
            {!read && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
          </div>
          <p className="text-sm text-gray-700 mb-2">{message}</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={typeColors[type]}>
              {type}
            </Badge>
            <span className="text-xs text-gray-500">{timestamp}</span>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          {!read && onRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRead(id);
              }}
              className="p-1 text-gray-400 hover:text-blue-600"
              title="Mark as read"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="p-1 text-gray-400 hover:text-red-600"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

