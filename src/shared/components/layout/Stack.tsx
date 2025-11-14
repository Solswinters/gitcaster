/**
 * Stack Component
 *
 * Vertical or horizontal stack layout with consistent spacing
 *
 * @module shared/components/layout/Stack
 */

'use client';

import React, { ReactNode } from 'react';

export interface StackProps {
  children: ReactNode;
  direction?: 'vertical' | 'horizontal';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  divider?: ReactNode;
  className?: string;
}

const spacingClasses = {
  vertical: {
    none: 'space-y-0',
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
    '2xl': 'space-y-12',
  },
  horizontal: {
    none: 'space-x-0',
    xs: 'space-x-1',
    sm: 'space-x-2',
    md: 'space-x-4',
    lg: 'space-x-6',
    xl: 'space-x-8',
    '2xl': 'space-x-12',
  },
};

const alignClasses = {
  vertical: {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  },
  horizontal: {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    stretch: 'justify-stretch',
  },
};

export function Stack({
  children,
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  divider,
  className = '',
}: StackProps) {
  const isVertical = direction === 'vertical';
  
  const classes = [
    'flex',
    isVertical ? 'flex-col' : 'flex-row',
    spacingClasses[direction][spacing],
    alignClasses[direction][align],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (divider) {
    const childrenArray = React.Children.toArray(children);
    return (
      <div className={classes}>
        {childrenArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < childrenArray.length - 1 && (
              <div className={isVertical ? 'w-full' : 'h-full'}>{divider}</div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return <div className={classes}>{children}</div>;
}

// VStack - Vertical Stack shorthand
export interface VStackProps extends Omit<StackProps, 'direction'> {}

export function VStack(props: VStackProps) {
  return <Stack {...props} direction="vertical" />;
}

// HStack - Horizontal Stack shorthand
export interface HStackProps extends Omit<StackProps, 'direction'> {}

export function HStack(props: HStackProps) {
  return <Stack {...props} direction="horizontal" />;
}

