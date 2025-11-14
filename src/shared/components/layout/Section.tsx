/**
 * Section Component
 *
 * Page section with consistent spacing and optional background
 *
 * @module shared/components/layout/Section
 */

'use client';

import React, { ReactNode } from 'react';
import { Container } from './Container';

export interface SectionProps {
  children: ReactNode;
  variant?: 'default' | 'alt' | 'dark' | 'primary';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  contained?: boolean;
  fullWidth?: boolean;
  className?: string;
  id?: string;
}

const variantClasses = {
  default: 'bg-white',
  alt: 'bg-gray-50',
  dark: 'bg-gray-900 text-white',
  primary: 'bg-blue-600 text-white',
};

const paddingClasses = {
  none: 'py-0',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
};

export function Section({
  children,
  variant = 'default',
  padding = 'md',
  contained = true,
  fullWidth = false,
  className = '',
  id,
}: SectionProps) {
  const classes = [
    variantClasses[variant],
    paddingClasses[padding],
    fullWidth && 'w-full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = contained ? (
    <Container>{children}</Container>
  ) : (
    children
  );

  return (
    <section id={id} className={classes}>
      {content}
    </section>
  );
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function SectionHeader({
  title,
  subtitle,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const classes = [alignClasses[align], 'mb-8', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
    </div>
  );
}

