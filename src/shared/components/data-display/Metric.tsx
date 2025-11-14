/**
 * Metric Component
 *
 * Display key metrics and KPIs with optional trend indicators
 *
 * @module shared/components/data-display/Metric
 */

'use client';

import React, { ReactNode } from 'react';

export interface MetricProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'number' | 'currency' | 'percentage';
  icon?: ReactNode;
  className?: string;
}

const trendColors = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-600',
};

const trendIcons = {
  up: '↑',
  down: '↓',
  neutral: '→',
};

export function Metric({
  label,
  value,
  change,
  trend,
  format = 'number',
  icon,
  className = '',
}: MetricProps) {
  const formattedValue = formatValue(value, format);
  const trendColor = trend ? trendColors[trend] : 'text-gray-600';
  const trendIcon = trend ? trendIcons[trend] : null;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{formattedValue}</p>
          {(change !== undefined || trend) && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trendColor}`}>
              {trendIcon && <span>{trendIcon}</span>}
              {change !== undefined && (
                <span>{change > 0 ? '+' : ''}{change}%</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="text-gray-400 text-2xl">{icon}</div>
        )}
      </div>
    </div>
  );
}

function formatValue(value: string | number, format: 'number' | 'currency' | 'percentage'): string {
  if (typeof value === 'string') return value;

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    case 'percentage':
      return `${value}%`;
    case 'number':
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
}

export interface MetricGroupProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

export function MetricGroup({ children, columns = 3, className = '' }: MetricGroupProps) {
  const classes = [
    'grid gap-4',
    columnClasses[columns],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}

