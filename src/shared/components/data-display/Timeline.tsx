/**
 * Timeline Component
 *
 * Display events in chronological order
 *
 * @module shared/components/data-display/Timeline
 */

'use client';

import React, { ReactNode } from 'react';

export interface TimelineItem {
  id: string;
  title: string;
  description?: ReactNode;
  timestamp: string;
  icon?: ReactNode;
  status?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

export interface TimelineProps {
  items: TimelineItem[];
  variant?: 'left' | 'right' | 'alternate';
  className?: string;
}

const statusColors = {
  default: 'bg-gray-400',
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

export function Timeline({ items, variant = 'left', className = '' }: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      {/* Timeline items */}
      <div className="space-y-8">
        {items.map((item, index) => (
          <TimelineItemComponent
            key={item.id}
            item={item}
            variant={variant}
            isAlternate={variant === 'alternate' && index % 2 === 1}
          />
        ))}
      </div>
    </div>
  );
}

interface TimelineItemComponentProps {
  item: TimelineItem;
  variant: 'left' | 'right' | 'alternate';
  isAlternate: boolean;
}

function TimelineItemComponent({ item, variant, isAlternate }: TimelineItemComponentProps) {
  const status = item.status || 'default';
  const dotColor = statusColors[status];

  const itemClasses = [
    'relative pl-12',
    variant === 'right' && 'text-right pr-12 pl-0',
    isAlternate && 'text-right pr-12 pl-0',
  ]
    .filter(Boolean)
    .join(' ');

  const dotPosition = variant === 'right' || isAlternate ? 'right-[-2px]' : 'left-[11px]';

  return (
    <div className={itemClasses}>
      {/* Dot */}
      <div
        className={`absolute ${dotPosition} top-0 w-4 h-4 rounded-full border-4 border-white ${dotColor}`}
        style={{ transform: 'translateX(-50%)' }}
      >
        {item.icon && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
            {item.icon}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h4 className="font-semibold text-gray-900">{item.title}</h4>
          <time className="text-sm text-gray-500 whitespace-nowrap">{item.timestamp}</time>
        </div>
        {item.description && (
          <div className="text-sm text-gray-600">{item.description}</div>
        )}
      </div>
    </div>
  );
}

export interface TimelineVerticalProps {
  items: TimelineItem[];
  className?: string;
}

export function TimelineVertical({ items, className = '' }: TimelineVerticalProps) {
  return <Timeline items={items} variant="left" className={className} />;
}

export function TimelineAlternate({ items, className = '' }: TimelineVerticalProps) {
  return <Timeline items={items} variant="alternate" className={className} />;
}

