'use client'

import React from 'react'
import { cn } from '@/shared/utils'

export interface QuickAction {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  disabled?: boolean
  badge?: string | number
}

export interface QuickActionsProps {
  actions: QuickAction[]
  columns?: 2 | 3 | 4
  className?: string
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  columns = 3,
  className,
}) => {
  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', columnClasses[columns], className)}>
      {actions.map((action) => {
        const Component = action.href ? 'a' : 'button'
        const props = action.href
          ? { href: action.href }
          : { onClick: action.onClick, type: 'button' as const }

        return (
          <Component
            key={action.id}
            {...props}
            disabled={action.disabled}
            className={cn(
              'relative flex flex-col items-center justify-center p-6 bg-white rounded-lg border-2 border-gray-200',
              'hover:border-blue-500 hover:shadow-md transition-all',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              action.disabled && 'opacity-50 cursor-not-allowed hover:border-gray-200 hover:shadow-none'
            )}
          >
            {action.badge && (
              <span className="absolute top-2 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {action.badge}
              </span>
            )}
            
            {action.icon && (
              <div className="mb-3 text-3xl">{action.icon}</div>
            )}
            
            <span className="text-sm font-medium text-gray-900 text-center">
              {action.label}
            </span>
          </Component>
        )
      })}
    </div>
  )
}

export default QuickActions

