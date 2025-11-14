/**
 * Flex Component
 *
 * Flexbox layout component with comprehensive alignment options
 *
 * @module shared/components/layout/Flex
 */

'use client';

import React, { ReactNode } from 'react';

export interface FlexProps {
  children: ReactNode;
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const directionClasses = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  col: 'flex-col',
  'col-reverse': 'flex-col-reverse',
};

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const wrapClasses = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
};

const gapClasses = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

export function Flex({
  children,
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  wrap = 'nowrap',
  gap = 'none',
  className = '',
}: FlexProps) {
  const classes = [
    'flex',
    directionClasses[direction],
    alignClasses[align],
    justifyClasses[justify],
    wrapClasses[wrap],
    gapClasses[gap],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}

export interface FlexItemProps {
  children: ReactNode;
  grow?: 0 | 1;
  shrink?: 0 | 1;
  basis?: 'auto' | 'full' | '1/2' | '1/3' | '1/4';
  className?: string;
}

const growClasses = {
  0: 'flex-grow-0',
  1: 'flex-grow',
};

const shrinkClasses = {
  0: 'flex-shrink-0',
  1: 'flex-shrink',
};

const basisClasses = {
  auto: 'flex-auto',
  full: 'flex-1',
  '1/2': 'basis-1/2',
  '1/3': 'basis-1/3',
  '1/4': 'basis-1/4',
};

export function FlexItem({
  children,
  grow,
  shrink,
  basis,
  className = '',
}: FlexItemProps) {
  const classes = [
    grow !== undefined && growClasses[grow],
    shrink !== undefined && shrinkClasses[shrink],
    basis && basisClasses[basis],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}

