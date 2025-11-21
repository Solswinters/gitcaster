/**
 * Avatar Component - User avatar with fallback
 */

import React from 'react'

export interface AvatarProps {
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'square'
  fallback?: string
  status?: 'online' | 'offline' | 'away' | 'busy'
  className?: string
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
  '2xl': 'h-20 w-20 text-2xl',
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  shape = 'circle',
  fallback,
  status,
  className = '',
}) => {
  const [imgError, setImgError] = React.useState(false)

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg'

  const avatarClasses = `
    relative inline-flex items-center justify-center
    ${sizeClasses[size]}
    ${shapeClass}
    bg-gray-200 text-gray-600 font-medium
    overflow-hidden
    ${className}
  `.trim()

  const getFallbackText = () => {
    if (fallback) return fallback
    if (alt) {
      return alt
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return '?'
  }

  return (
    <div className="relative inline-block">
      <div className={avatarClasses}>
        {src && !imgError ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{getFallbackText()}</span>
        )}
      </div>
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            block h-3 w-3 rounded-full
            border-2 border-white
            ${statusColors[status]}
          `}
        />
      )}
    </div>
  )
}

export default Avatar

