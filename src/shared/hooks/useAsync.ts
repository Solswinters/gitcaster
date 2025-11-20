/**
 * useAsync Hook - Handle async operations with loading and error states
 */

import { useState, useEffect, useCallback } from 'react'

export interface AsyncState<T> {
  loading: boolean
  error: Error | null
  data: T | null
}

export interface UseAsyncOptions {
  immediate?: boolean
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseAsyncOptions = {}
): AsyncState<T> & { execute: () => Promise<void>; reset: () => void } {
  const { immediate = true } = options

  const [state, setState] = useState<AsyncState<T>>({
    loading: immediate,
    error: null,
    data: null,
  })

  // Execute async function
  const execute = useCallback(async () => {
    setState({ loading: true, error: null, data: null })

    try {
      const result = await asyncFunction()
      setState({ loading: false, error: null, data: result })
    } catch (error) {
      setState({ loading: false, error: error as Error, data: null })
    }
  }, [asyncFunction])

  // Reset state
  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null })
  }, [])

  // Execute on mount if immediate is true
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, dependencies)

  return {
    ...state,
    execute,
    reset,
  }
}

export default useAsync
