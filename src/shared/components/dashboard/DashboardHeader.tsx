'use client'

import React from 'react'
import { cn } from '@/shared/utils'

export interface DashboardHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
  className?: string
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  actions,
  breadcrumbs,
  className,
}) => {
  return (
    <div className={cn('space-y-4 pb-8', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-gray-700 transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          {description && (
            <p className="text-gray-500 max-w-2xl">{description}</p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardHeader

