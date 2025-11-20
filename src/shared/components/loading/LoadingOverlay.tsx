/**
 * LoadingOverlay Component - Full-page loading overlay
 */

import React from 'react'
import { Spinner } from './Spinner'

export interface LoadingOverlayProps {
  isLoading: boolean
  text?: string
  opacity?: number
  blur?: boolean
  children?: React.ReactNode
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text = 'Loading...',
  opacity = 0.75,
  blur = false,
  children,
}) => {
  if (!isLoading) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {children && <div className={blur ? 'blur-sm' : 'opacity-50'}>{children}</div>}
      <div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white"
        style={{ opacity }}
      >
        <Spinner size="lg" />
        {text && <p className="mt-4 text-sm text-gray-600">{text}</p>}
      </div>
    </div>
  )
}

/**
 * Full Page Loading - Covers entire viewport
 */
export const FullPageLoading: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <Spinner size="xl" />
      {text && <p className="mt-4 text-lg text-gray-600">{text}</p>}
    </div>
  )
}

export default LoadingOverlay

