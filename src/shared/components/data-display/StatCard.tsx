/**
 * StatCard Component
 *
 * Display statistics with optional trend indicators
 *
 * @module shared/components/data-display/StatCard
 */

'use client';

import React from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon,
  loading = false,
  className = '',
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const hasChange = change !== undefined;

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {hasChange && (
          <div className="flex items-center">
            <span
              className={`text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? '↑' : '↓'} {Math.abs(change)}%
            </span>
            {changeLabel && (
              <span className="ml-2 text-xs text-gray-500">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

