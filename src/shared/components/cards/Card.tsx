/**
 * Card Component - Basic card container
 */

import React from 'react'

export interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  className?: string
  onClick?: () => void
}

const variantClasses = {
  default: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-md',
  outlined: 'bg-transparent border-2 border-gray-300',
  ghost: 'bg-gray-50',
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  onClick,
}) => {
  const cardClasses = `
    rounded-lg transition-all
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${hover ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''}
    ${className}
  `.trim()

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  )
}

export default Card

