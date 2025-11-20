'use client'

import React from 'react'
import { cn } from '@/shared/utils'

export interface StatCardProps {
  label: string
  value: string | number
  change?: {
    value: number
    trend: 'up' | 'down' | 'neutral'
  }
  icon?: React.ReactNode
  description?: string
  loading?: boolean
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  icon,
  description,
  loading = false,
  className,
}) => {
  if (loading) {
    return (
      <div className={cn('bg-white rounded-lg shadow p-6 animate-pulse', className)}>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    )
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  }

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  }

  return (
    <div className={cn('bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          
          {change && (
            <div className={cn('mt-2 flex items-center text-sm', trendColors[change.trend])}>
              <span className="mr-1">{trendIcons[change.trend]}</span>
              <span className="font-medium">{Math.abs(change.value)}%</span>
              <span className="ml-1 text-gray-600">vs last period</span>
            </div>
          )}
          
          {description && (
            <p className="mt-2 text-sm text-gray-500">{description}</p>
          )}
        </div>
        
        {icon && (
          <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard

