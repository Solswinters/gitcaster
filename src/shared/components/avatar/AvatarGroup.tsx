/**
 * Avatar Group Component - Display multiple avatars in a group
 */

import React from 'react'
import { Avatar, AvatarProps } from './Avatar'

export interface AvatarGroupProps {
  avatars: Array<Omit<AvatarProps, 'size'>>
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 5,
  size = 'md',
  className = '',
}) => {
  const displayAvatars = avatars.slice(0, max)
  const remaining = Math.max(0, avatars.length - max)

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {displayAvatars.map((avatar, index) => (
        <div key={index} className="ring-2 ring-white">
          <Avatar {...avatar} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`
            flex items-center justify-center rounded-full
            bg-gray-200 text-xs font-medium text-gray-600 ring-2 ring-white
            ${size === 'xs' && 'h-6 w-6'}
            ${size === 'sm' && 'h-8 w-8'}
            ${size === 'md' && 'h-10 w-10'}
            ${size === 'lg' && 'h-12 w-12'}
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}

export default AvatarGroup

