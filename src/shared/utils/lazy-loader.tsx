/**
 * Lazy Loader - Component lazy loading with suspense and error boundaries
 * Performance optimization for code splitting and faster initial load
 */

import React, { Suspense, ComponentType, lazy, LazyExoticComponent } from 'react';

export interface LazyLoadOptions {
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  preload?: boolean;
  delay?: number;
}

export interface LazyLoadedComponent<T = any> {
  Component: LazyExoticComponent<ComponentType<T>>;
  preload: () => void;
}

/**
 * Create a lazy-loaded component with suspense and error handling
 */
export function lazyLoad<T = any>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  options: LazyLoadOptions = {}
): LazyLoadedComponent<T> {
  const LazyComponent = lazy(importFunc);

  const preload = () => {
    importFunc();
  };

  // Preload if requested
  if (options.preload) {
    if (options.delay) {
      setTimeout(preload, options.delay);
    } else {
      preload();
    }
  }

  return {
    Component: LazyComponent,
    preload,
  };
}

/**
 * Wrapper component with suspense and error boundary
 */
export function LazyWrapper({
  children,
  fallback,
  errorFallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const errorHandler = () => {
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return <>{errorFallback || <DefaultErrorFallback />}</>;
  }

  return (
    <Suspense fallback={fallback || <DefaultFallback />}>{children}</Suspense>
  );
}

/**
 * Default loading fallback
 */
function DefaultFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

/**
 * Default error fallback
 */
function DefaultErrorFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-red-500 font-semibold mb-2">Failed to load component</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

/**
 * Higher-order component for lazy loading
 */
export function withLazyLoad<T extends object>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  options: LazyLoadOptions = {}
) {
  const { Component, preload } = lazyLoad(importFunc, options);

  return function LazyLoadedComponent(props: T) {
    return (
      <LazyWrapper
        fallback={options.fallback}
        errorFallback={options.errorFallback}
      >
        <Component {...props} />
      </LazyWrapper>
    );
  };
}

/**
 * Preload multiple components
 */
export function preloadComponents(
  components: Array<{ preload: () => void }>
): void {
  components.forEach((component) => component.preload());
}

/**
 * Lazy load on interaction (hover, click, etc.)
 */
export function lazyLoadOnInteraction<T = any>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  event: 'hover' | 'click' = 'hover'
) {
  const { Component, preload } = lazyLoad(importFunc);

  return function InteractiveLazyComponent(props: T) {
    const [shouldLoad, setShouldLoad] = React.useState(false);

    const handleInteraction = () => {
      if (!shouldLoad) {
        setShouldLoad(true);
        preload();
      }
    };

    const interactionProps =
      event === 'hover'
        ? { onMouseEnter: handleInteraction }
        : { onClick: handleInteraction };

    return (
      <div {...interactionProps}>
        {shouldLoad ? (
          <LazyWrapper>
            <Component {...props} />
          </LazyWrapper>
        ) : (
          <div className="lazy-placeholder">Hover to load</div>
        )}
      </div>
    );
  };
}

/**
 * Lazy load on viewport visibility
 */
export function lazyLoadOnVisible<T = any>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  rootMargin = '50px'
) {
  const { Component, preload } = lazyLoad(importFunc);

  return function VisibleLazyComponent(props: T) {
    const [isVisible, setIsVisible] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            preload();
            observer.disconnect();
          }
        },
        { rootMargin }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, [isVisible]);

    return (
      <div ref={ref}>
        {isVisible ? (
          <LazyWrapper>
            <Component {...props} />
          </LazyWrapper>
        ) : (
          <div className="lazy-placeholder h-32"></div>
        )}
      </div>
    );
  };
}

export default {
  lazyLoad,
  LazyWrapper,
  withLazyLoad,
  preloadComponents,
  lazyLoadOnInteraction,
  lazyLoadOnVisible,
};

