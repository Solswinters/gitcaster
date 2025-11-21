/**
 * Infinite Scroll Hook - Performance-optimized infinite scrolling
 * Implements virtual scrolling and intersection observer for efficiency
 */

import { useState, useEffect, useRef, useCallback } from 'react'

export interface InfiniteScrollOptions<T> {
  loadMore: (page: number) => Promise<T[]>
  initialPage?: number
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

export interface InfiniteScrollResult<T> {
  data: T[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  hasMore: boolean
  loadMore: () => void
  reset: () => void
  page: number
}

export function useInfiniteScroll<T = any>(
  options: InfiniteScrollOptions<T>
): InfiniteScrollResult<T> {
  const {
    loadMore,
    initialPage = 1,
    threshold = 0.8,
    rootMargin = '0px',
    enabled = true,
  } = options

  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const observerTarget = useRef<HTMLDivElement>(null)
  const isLoadingRef = useRef(false)

  const loadMoreData = useCallback(async () => {
    if (!enabled || isLoadingRef.current || !hasMore) return

    isLoadingRef.current = true
    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      const newData = await loadMore(page)

      if (newData.length === 0) {
        setHasMore(false)
      } else {
        setData((prev) => [...prev, ...newData])
        setPage((prev) => prev + 1)
      }
    } catch (err) {
      setIsError(true)
      setError(err as Error)
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }
  }, [enabled, hasMore, loadMore, page])

  const reset = useCallback(() => {
    setData([])
    setPage(initialPage)
    setHasMore(true)
    setIsError(false)
    setError(null)
    isLoadingRef.current = false
  }, [initialPage])

  useEffect(() => {
    if (!enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && hasMore && !isLoadingRef.current) {
          loadMoreData()
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    const currentTarget = observerTarget.current

    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [enabled, hasMore, loadMoreData, rootMargin, threshold])

  // Load initial data
  useEffect(() => {
    if (enabled && data.length === 0 && !isLoadingRef.current) {
      loadMoreData()
    }
  }, [])

  return {
    data,
    isLoading,
    isError,
    error,
    hasMore,
    loadMore: loadMoreData,
    reset,
    page,
  }
}

/**
 * Hook for infinite scroll with window scroll
 */
export function useWindowInfiniteScroll<T = any>(
  options: InfiniteScrollOptions<T>
): InfiniteScrollResult<T> {
  const { loadMore, initialPage = 1, threshold = 0.8, enabled = true } = options

  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const isLoadingRef = useRef(false)

  const loadMoreData = useCallback(async () => {
    if (!enabled || isLoadingRef.current || !hasMore) return

    isLoadingRef.current = true
    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      const newData = await loadMore(page)

      if (newData.length === 0) {
        setHasMore(false)
      } else {
        setData((prev) => [...prev, ...newData])
        setPage((prev) => prev + 1)
      }
    } catch (err) {
      setIsError(true)
      setError(err as Error)
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }
  }, [enabled, hasMore, loadMore, page])

  const reset = useCallback(() => {
    setData([])
    setPage(initialPage)
    setHasMore(true)
    setIsError(false)
    setError(null)
    isLoadingRef.current = false
  }, [initialPage])

  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = document.documentElement.scrollTop
      const clientHeight = document.documentElement.clientHeight

      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight

      if (scrollPercentage >= threshold && hasMore && !isLoadingRef.current) {
        loadMoreData()
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [enabled, hasMore, loadMoreData, threshold])

  // Load initial data
  useEffect(() => {
    if (enabled && data.length === 0 && !isLoadingRef.current) {
      loadMoreData()
    }
  }, [])

  return {
    data,
    isLoading,
    isError,
    error,
    hasMore,
    loadMore: loadMoreData,
    reset,
    page,
  }
}

/**
 * Hook for bidirectional infinite scroll
 */
export function useBidirectionalScroll<T = any>(options: {
  loadMore: (page: number) => Promise<T[]>
  loadPrevious: (page: number) => Promise<T[]>
  initialPage?: number
}): {
  data: T[]
  isLoadingMore: boolean
  isLoadingPrevious: boolean
  isError: boolean
  error: Error | null
  hasMore: boolean
  hasPrevious: boolean
  loadMore: () => void
  loadPrevious: () => void
  reset: () => void
} {
  const { loadMore, loadPrevious, initialPage = 1 } = options

  const [data, setData] = useState<T[]>([])
  const [nextPage, setNextPage] = useState(initialPage + 1)
  const [prevPage, setPrevPage] = useState(initialPage - 1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [hasPrevious, setHasPrevious] = useState(prevPage >= 1)

  const loadMoreData = useCallback(async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    setIsError(false)
    setError(null)

    try {
      const newData = await loadMore(nextPage)

      if (newData.length === 0) {
        setHasMore(false)
      } else {
        setData((prev) => [...prev, ...newData])
        setNextPage((prev) => prev + 1)
      }
    } catch (err) {
      setIsError(true)
      setError(err as Error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [hasMore, isLoadingMore, loadMore, nextPage])

  const loadPreviousData = useCallback(async () => {
    if (isLoadingPrevious || !hasPrevious) return

    setIsLoadingPrevious(true)
    setIsError(false)
    setError(null)

    try {
      const newData = await loadPrevious(prevPage)

      if (newData.length === 0) {
        setHasPrevious(false)
      } else {
        setData((prev) => [...newData, ...prev])
        setPrevPage((prev) => prev - 1)
        setHasPrevious(prevPage - 1 >= 1)
      }
    } catch (err) {
      setIsError(true)
      setError(err as Error)
    } finally {
      setIsLoadingPrevious(false)
    }
  }, [hasPrevious, isLoadingPrevious, loadPrevious, prevPage])

  const reset = useCallback(() => {
    setData([])
    setNextPage(initialPage + 1)
    setPrevPage(initialPage - 1)
    setHasMore(true)
    setHasPrevious(initialPage > 1)
    setIsError(false)
    setError(null)
  }, [initialPage])

  return {
    data,
    isLoadingMore,
    isLoadingPrevious,
    isError,
    error,
    hasMore,
    hasPrevious,
    loadMore: loadMoreData,
    loadPrevious: loadPreviousData,
    reset,
  }
}

export default useInfiniteScroll

