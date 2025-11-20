'use client'

import React from 'react'
import { cn } from '@/shared/utils'

export interface ChartContainerProps {
  title: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode
  loading?: boolean
  error?: string
  className?: string
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  children,
  actions,
  loading = false,
  error,
  className,
}) => {
  return (
    <div className={cn('bg-white rounded-lg shadow', className)}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 font-medium">Error loading chart</p>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default ChartContainer

