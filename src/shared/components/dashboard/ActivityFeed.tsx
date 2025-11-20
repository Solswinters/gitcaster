'use client'

import React from 'react'
import { cn } from '@/shared/utils'

export interface ActivityItem {
  id: string
  type: 'commit' | 'pr' | 'issue' | 'star' | 'fork' | 'release' | 'follow'
  title: string
  description?: string
  timestamp: Date
  actor?: {
    name: string
    avatar?: string
  }
  metadata?: Record<string, any>
}

export interface ActivityFeedProps {
  items: ActivityItem[]
  loading?: boolean
  emptyMessage?: string
  maxItems?: number
  className?: string
}

const activityIcons: Record<ActivityItem['type'], string> = {
  commit: '📝',
  pr: '🔀',
  issue: '🐛',
  star: '⭐',
  fork: '🍴',
  release: '🚀',
  follow: '👥',
}

const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  items,
  loading = false,
  emptyMessage = 'No recent activity',
  maxItems = 10,
  className,
}) => {
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-3 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  const displayItems = items.slice(0, maxItems)

  return (
    <div className={cn('space-y-6', className)}>
      {displayItems.map((item) => (
        <div key={item.id} className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {item.actor?.avatar ? (
              <img
                src={item.actor.avatar}
                alt={item.actor.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                {activityIcons[item.type]}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.title}
                </p>
                {item.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="mt-1 flex items-center space-x-2 text-xs text-gray-400">
                  {item.actor && (
                    <>
                      <span>{item.actor.name}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{formatRelativeTime(item.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActivityFeed

