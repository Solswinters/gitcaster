'use client'

import React from 'react'
import { cn } from '@/shared/utils'

export interface DashboardGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className,
}) => {
  return (
    <div
      className={cn(
        'grid w-full',
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

export default DashboardGrid

