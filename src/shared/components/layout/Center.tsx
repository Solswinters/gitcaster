/**
 * Center Component
 *
 * Centers content horizontally and vertically
 *
 * @module shared/components/layout/Center
 */

'use client';

import React, { ReactNode } from 'react';

export interface CenterProps {
  children: ReactNode;
  inline?: boolean;
  axis?: 'both' | 'horizontal' | 'vertical';
  className?: string;
}

export function Center({
  children,
  inline = false,
  axis = 'both',
  className = '',
}: CenterProps) {
  const getClasses = () => {
    const baseClasses = [inline ? 'inline-flex' : 'flex'];

    switch (axis) {
      case 'both':
        return [...baseClasses, 'items-center', 'justify-center'];
      case 'horizontal':
        return [...baseClasses, 'justify-center'];
      case 'vertical':
        return [...baseClasses, 'items-center'];
      default:
        return baseClasses;
    }
  };

  const classes = [...getClasses(), className].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
}

