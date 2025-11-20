/**
 * Error Boundary Component - Catch and handle React errors gracefully
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode)
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetOnPropsChange?: any[]
}

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console
    console.error('Error caught by boundary:', error, errorInfo)

    // Update state with error info
    this.setState({
      errorInfo,
    })

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, you might want to log to an error reporting service
    // e.g., Sentry, LogRocket, etc.
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetOnPropsChange } = this.props
    const { hasError } = this.state

    // Reset error boundary when specified props change
    if (hasError && resetOnPropsChange) {
      const hasPropsChanged = resetOnPropsChange.some((prop, index) => {
        return prop !== prevProps.resetOnPropsChange?.[index]
      })

      if (hasPropsChanged) {
        this.resetErrorBoundary()
      }
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state
    const { children, fallback } = this.props

    if (hasError && error) {
      // Custom fallback UI
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error, errorInfo!)
        }
        return fallback
      }

      // Default fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Oops! Something went wrong
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                We're sorry for the inconvenience. Please try refreshing the page.
              </p>
            </div>

            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error Details</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p className="font-mono">{error.message}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={this.resetErrorBoundary}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Reload Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && errorInfo && (
              <details className="mt-4 rounded-md bg-gray-100 p-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-900">
                  Component Stack
                </summary>
                <pre className="mt-2 overflow-auto text-xs text-gray-700">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return children
  }
}

/**
 * Higher-order component to wrap components with ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

/**
 * Async Error Boundary for handling async errors
 */
export class AsyncErrorBoundary extends ErrorBoundary {
  componentDidMount(): void {
    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  componentWillUnmount(): void {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    event.preventDefault()

    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))

    this.setState({
      hasError: true,
      error,
      errorInfo: {
        componentStack: 'Unhandled Promise Rejection',
      } as ErrorInfo,
    })

    if (this.props.onError) {
      this.props.onError(error, { componentStack: '' } as ErrorInfo)
    }
  }
}

export default ErrorBoundary

