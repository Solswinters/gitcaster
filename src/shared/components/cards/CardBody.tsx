/**
 * CardBody Component - Card body section
 */

import React from 'react'

export interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`mt-4 ${className}`}>{children}</div>
}

export default CardBody

