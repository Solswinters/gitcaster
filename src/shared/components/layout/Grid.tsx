/**
 * Grid Component
 *
 * Responsive grid layout system with flexible columns
 *
 * @module shared/components/layout/Grid
 */

'use client';

import React, { ReactNode } from 'react';

export interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 6 | 12;
  };
  className?: string;
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const colClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const responsiveColClasses = {
  sm: {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
    6: 'sm:grid-cols-6',
    12: 'sm:grid-cols-12',
  },
  md: {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    6: 'md:grid-cols-6',
    12: 'md:grid-cols-12',
  },
  lg: {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    6: 'lg:grid-cols-6',
    12: 'lg:grid-cols-12',
  },
  xl: {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    6: 'xl:grid-cols-6',
    12: 'xl:grid-cols-12',
  },
};

export function Grid({
  children,
  cols = 1,
  gap = 'md',
  responsive,
  className = '',
}: GridProps) {
  const classes = [
    'grid',
    colClasses[cols],
    gapClasses[gap],
    responsive?.sm && responsiveColClasses.sm[responsive.sm],
    responsive?.md && responsiveColClasses.md[responsive.md],
    responsive?.lg && responsiveColClasses.lg[responsive.lg],
    responsive?.xl && responsiveColClasses.xl[responsive.xl],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}

export interface GridItemProps {
  children: ReactNode;
  colSpan?: 1 | 2 | 3 | 4 | 6 | 12 | 'full';
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const colSpanClasses = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  6: 'col-span-6',
  12: 'col-span-12',
  full: 'col-span-full',
};

const rowSpanClasses = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
  4: 'row-span-4',
  5: 'row-span-5',
  6: 'row-span-6',
};

export function GridItem({
  children,
  colSpan,
  rowSpan,
  className = '',
}: GridItemProps) {
  const classes = [
    colSpan && colSpanClasses[colSpan],
    rowSpan && rowSpanClasses[rowSpan],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}

