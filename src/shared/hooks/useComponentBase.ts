/**
 * Base Component Hook - Common functionality for component reusability
 * Refactored to provide consistent patterns across components
 */

import { useState, useEffect, useCallback, useRef } from 'react'

export interface ComponentBaseConfig {
  enableLogging?: boolean
  trackPerformance?: boolean
  autoCleanup?: boolean
}

export interface ComponentState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useComponentBase<T = any>(
  componentName: string,
  config: ComponentBaseConfig = {}
) {
  const { enableLogging = false, trackPerformance = false, autoCleanup = true } = config

  const [state, setState] = useState<ComponentState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const mounted = useRef(true)
  const startTime = useRef<number>(0)

  // Lifecycle logging
  useEffect(() => {
    if (enableLogging) {
      console.log(`[${componentName}] Mounted`)
    }

    if (trackPerformance) {
      startTime.current = performance.now()
    }

    return () => {
      mounted.current = false

      if (enableLogging) {
        console.log(`[${componentName}] Unmounted`)
      }

      if (trackPerformance && startTime.current > 0) {
        const duration = performance.now() - startTime.current
        console.log(`[${componentName}] Lifetime: ${duration.toFixed(2)}ms`)
      }
    }
  }, [componentName, enableLogging, trackPerformance])

  /**
   * Safe state update (only if component is still mounted)
   */
  const safeSetState = useCallback((updater: Partial<ComponentState<T>>) => {
    if (mounted.current) {
      setState(prev => ({ ...prev, ...updater }))
    }
  }, [])

  /**
   * Set loading state
   */
  const setLoading = useCallback(
    (loading: boolean) => {
      safeSetState({ loading })
    },
    [safeSetState]
  )

  /**
   * Set error state
   */
  const setError = useCallback(
    (error: Error | null) => {
      safeSetState({ error, loading: false })
      if (error && enableLogging) {
        console.error(`[${componentName}] Error:`, error)
      }
    },
    [safeSetState, enableLogging, componentName]
  )

  /**
   * Set data state
   */
  const setData = useCallback(
    (data: T | null) => {
      safeSetState({ data, loading: false, error: null })
    },
    [safeSetState]
  )

  /**
   * Reset state
   */
  const resetState = useCallback(() => {
    safeSetState({ data: null, loading: false, error: null })
  }, [safeSetState])

  /**
   * Execute async operation with error handling
   */
  const executeAsync = useCallback(
    async <R>(
      operation: () => Promise<R>,
      onSuccess?: (result: R) => void,
      onError?: (error: Error) => void
    ): Promise<R | null> => {
      setLoading(true)

      try {
        const result = await operation()

        if (!mounted.current) return null

        if (onSuccess) {
          onSuccess(result)
        }

        setLoading(false)
        return result
      } catch (error) {
        if (!mounted.current) return null

        const err = error instanceof Error ? error : new Error(String(error))
        setError(err)

        if (onError) {
          onError(err)
        }

        return null
      }
    },
    [setLoading, setError]
  )

  /**
   * Log message (if logging enabled)
   */
  const log = useCallback(
    (message: string, ...args: any[]) => {
      if (enableLogging) {
        console.log(`[${componentName}]`, message, ...args)
      }
    },
    [enableLogging, componentName]
  )

  /**
   * Check if component is mounted
   */
  const isMounted = useCallback(() => mounted.current, [])

  return {
    state,
    loading: state.loading,
    error: state.error,
    data: state.data,
    setLoading,
    setError,
    setData,
    resetState,
    executeAsync,
    log,
    isMounted,
  }
}

export default useComponentBase

