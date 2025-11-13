/**
 * Error Boundary Higher-Order Component
 * 
 * HOC for wrapping components with error boundaries
 */

'use client';

import { Component, ComponentType, ReactNode } from 'react';
import { ErrorDisplay } from '@/shared/components/error/ErrorDisplay';
import { logger } from '../logger/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface WithErrorBoundaryOptions {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

/**
 * HOC to wrap component with error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
) {
  return class extends Component<P, ErrorBoundaryState> {
    constructor(props: P) {
      super(props);
      this.state = {
        hasError: false,
        error: null,
      };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return {
        hasError: true,
        error,
      };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      logger.error('Error caught by boundary', error, {
        componentStack: errorInfo.componentStack,
      });

      options.onError?.(error, errorInfo);
    }

    componentDidUpdate(prevProps: P) {
      if (options.resetOnPropsChange && prevProps !== this.props) {
        if (this.state.hasError) {
          this.setState({ hasError: false, error: null });
        }
      }
    }

    render() {
      if (this.state.hasError) {
        if (options.fallback) {
          return options.fallback;
        }

        return (
          <ErrorDisplay
            variant="card"
            title="Something went wrong"
            message={this.state.error?.message || 'An unexpected error occurred'}
            onRetry={() => this.setState({ hasError: false, error: null })}
          />
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}

