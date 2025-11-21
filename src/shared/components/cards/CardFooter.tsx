/**
 * CardFooter Component - Card footer section
 */

import React from 'react'

export interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return <div className={`mt-4 border-t border-gray-200 pt-4 ${className}`}>{children}</div>
}

export default CardFooter

