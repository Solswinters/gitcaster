/**
 * KeyValue Component
 *
 * Display key-value pairs in a clean, structured format
 *
 * @module shared/components/data-display/KeyValue
 */

'use client';

import React, { ReactNode } from 'react';

export interface KeyValuePair {
  key: string;
  value: ReactNode;
  icon?: ReactNode;
}

export interface KeyValueProps {
  pairs: KeyValuePair[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  spacing?: 'sm' | 'md' | 'lg';
  keyWidth?: 'auto' | 'sm' | 'md' | 'lg';
  divider?: boolean;
  className?: string;
}

const spacingClasses = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

const keyWidthClasses = {
  auto: 'min-w-0',
  sm: 'min-w-[100px]',
  md: 'min-w-[150px]',
  lg: 'min-w-[200px]',
};

export function KeyValue({
  pairs,
  layout = 'vertical',
  spacing = 'md',
  keyWidth = 'auto',
  divider = false,
  className = '',
}: KeyValueProps) {
  const containerClasses = [
    layout === 'grid' ? 'grid grid-cols-2' : 'flex flex-col',
    spacingClasses[spacing],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {pairs.map((pair, index) => (
        <React.Fragment key={index}>
          <KeyValueItem
            keyLabel={pair.key}
            value={pair.value}
            icon={pair.icon}
            layout={layout}
            keyWidth={keyWidth}
          />
          {divider && index < pairs.length - 1 && (
            <div className="border-b border-gray-200" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

interface KeyValueItemProps {
  keyLabel: string;
  value: ReactNode;
  icon?: ReactNode;
  layout: 'vertical' | 'horizontal' | 'grid';
  keyWidth: 'auto' | 'sm' | 'md' | 'lg';
}

function KeyValueItem({ keyLabel, value, icon, layout, keyWidth }: KeyValueItemProps) {
  if (layout === 'grid') {
    return (
      <>
        <div className="flex items-center gap-2 font-medium text-gray-700">
          {icon && <span className="text-gray-500">{icon}</span>}
          {keyLabel}
        </div>
        <div className="text-gray-900">{value}</div>
      </>
    );
  }

  const itemClasses = layout === 'horizontal' ? 'flex items-start gap-4' : 'flex flex-col gap-1';

  return (
    <div className={itemClasses}>
      <div className={`flex items-center gap-2 font-medium text-gray-700 ${keyWidthClasses[keyWidth]}`}>
        {icon && <span className="text-gray-500">{icon}</span>}
        {keyLabel}
      </div>
      <div className="text-gray-900 flex-1">{value}</div>
    </div>
  );
}

export interface KeyValueCardProps {
  title?: string;
  pairs: KeyValuePair[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  className?: string;
}

export function KeyValueCard({ title, pairs, layout = 'vertical', className = '' }: KeyValueCardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <KeyValue pairs={pairs} layout={layout} divider />
    </div>
  );
}

