/**
 * Analytics Charts Component
 *
 * Reusable chart components for analytics
 *
 * @module features/analytics/components/AnalyticsCharts
 */

'use client';

import React from 'react';
import { StatCard } from '@/shared/components/data-display';

export interface AnalyticsMetric {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
}

export interface AnalyticsChartsProps {
  metrics: AnalyticsMetric[];
  className?: string;
}

export function AnalyticsCharts({ metrics, className = '' }: AnalyticsChartsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {metrics.map((metric, index) => (
        <StatCard
          key={index}
          label={metric.label}
          value={metric.value}
          change={metric.change}
          changeLabel={metric.changeLabel}
        />
      ))}
    </div>
  );
}

