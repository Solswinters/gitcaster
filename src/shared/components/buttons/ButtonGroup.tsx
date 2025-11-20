/**
 * ButtonGroup Component - Group buttons together
 */

import React from 'react'

export interface ButtonGroupProps {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  className = '',
}) => {
  const groupClasses = `
    inline-flex
    ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'}
    ${className}
  `.trim()

  return <div className={groupClasses}>{children}</div>
}

export default ButtonGroup

