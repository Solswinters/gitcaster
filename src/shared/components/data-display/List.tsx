/**
 * List Component
 *
 * Versatile list component with support for ordered, unordered, and description lists
 *
 * @module shared/components/data-display/List
 */

'use client';

import React, { ReactNode } from 'react';

export interface ListProps {
  children: ReactNode;
  variant?: 'unordered' | 'ordered' | 'none';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  styleType?: 'disc' | 'circle' | 'square' | 'decimal' | 'none';
  className?: string;
}

const spacingClasses = {
  none: 'space-y-0',
  sm: 'space-y-1',
  md: 'space-y-2',
  lg: 'space-y-4',
};

const styleTypeClasses = {
  disc: 'list-disc',
  circle: 'list-circle',
  square: 'list-square',
  decimal: 'list-decimal',
  none: 'list-none',
};

export function List({
  children,
  variant = 'unordered',
  spacing = 'md',
  styleType,
  className = '',
}: ListProps) {
  const defaultStyleType = variant === 'ordered' ? 'decimal' : variant === 'unordered' ? 'disc' : 'none';
  const actualStyleType = styleType || defaultStyleType;

  const classes = [
    styleTypeClasses[actualStyleType],
    spacingClasses[spacing],
    actualStyleType !== 'none' && 'pl-5',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const Component = variant === 'ordered' ? 'ol' : 'ul';

  return <Component className={classes}>{children}</Component>;
}

export interface ListItemProps {
  children: ReactNode;
  className?: string;
}

export function ListItem({ children, className = '' }: ListItemProps) {
  return <li className={className}>{children}</li>;
}

export interface DescriptionListProps {
  items: Array<{ term: ReactNode; description: ReactNode }>;
  layout?: 'stacked' | 'horizontal';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function DescriptionList({
  items,
  layout = 'stacked',
  spacing = 'md',
  className = '',
}: DescriptionListProps) {
  const classes = [
    layout === 'horizontal' ? 'grid grid-cols-3 gap-4' : '',
    spacing !== 'none' && layout === 'stacked' ? spacingClasses[spacing] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <dl className={classes}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <dt className={`font-semibold ${layout === 'horizontal' ? 'col-span-1' : ''}`}>
            {item.term}
          </dt>
          <dd className={`text-gray-600 ${layout === 'horizontal' ? 'col-span-2' : 'mb-2'}`}>
            {item.description}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

