'use client'

import { useState } from 'react'
import { SearchBar } from './SearchBar'
import { SearchFilters, SearchFiltersState } from './SearchFilters'
import { SearchResults } from './SearchResults'
import { Button } from '@/components/ui/button'
import { Filter, X, ArrowUp } from 'lucide-react'
import { useScrollToTop } from '@/hooks/useInfiniteScroll'

interface MobileSearchViewProps {
  results: any
  filters: SearchFiltersState
  onSearch: (query: string) => void
  onFiltersChange: (filters: SearchFiltersState) => void
  onPageChange: (page: number) => void
  isLoading: boolean
}

export function MobileSearchView({
  results,
  filters,
  onSearch,
  onFiltersChange,
  onPageChange,
  isLoading,
}: MobileSearchViewProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { scrollToTop } = useScrollToTop()

  // Show scroll-to-top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4 space-y-3">
          <SearchBar onSearch={onSearch} placeholder="Search developers..." />
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {Object.values(filters).filter(v => 
                Array.isArray(v) ? v.length > 0 : v !== null && v !== '' && v !== false
              ).length > 0 && (
                <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded-full text-xs">
                  {Object.values(filters).filter(v => 
                    Array.isArray(v) ? v.length > 0 : v !== null && v !== '' && v !== false
                  ).length}
                </span>
              )}
            </Button>

            {results && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {results.pagination.totalCount} results
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
          <div
            className="absolute inset-x-0 bottom-0 bg-white dark:bg-gray-800 rounded-t-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <SearchFilters filters={filters} onChange={onFiltersChange} />
            </div>
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <Button
                className="w-full"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="p-4">
        {results && (
          <SearchResults
            profiles={results.profiles}
            pagination={results.pagination}
            isLoading={isLoading}
            onPageChange={onPageChange}
          />
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => scrollToTop()}
          className="fixed bottom-20 right-4 z-30 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}

import { useEffect } from 'react'

