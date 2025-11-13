'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchSuggestion {
  type: 'skill' | 'location' | 'user'
  value: string
  category?: string
  displayName?: string
  avatarUrl?: string
  count?: number
}

interface SearchBarProps {
  onSearch: (query: string) => void
  initialQuery?: string
  placeholder?: string
  autoFocus?: boolean
}

export function SearchBar({ onSearch, initialQuery = '', placeholder = 'Search developers...', autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        })

        if (response.ok) {
          const data = await response.json()
          const allSuggestions = [
            ...(data.suggestions.skills || []),
            ...(data.suggestions.locations || []),
            ...(data.suggestions.users || []),
          ]
          setSuggestions(allSuggestions)
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounce)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    onSearch(query)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.value)
    setShowSuggestions(false)
    onSearch(suggestion.value)
  }

  const handleClear = () => {
    setQuery('')
    setSuggestions([])
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="pl-10 pr-20 h-12 text-lg"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <Button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            size="sm"
          >
            Search
          </Button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.value}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              {suggestion.type === 'user' && suggestion.avatarUrl && (
                <img
                  src={suggestion.avatarUrl}
                  alt={suggestion.displayName || suggestion.value}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="flex-1">
                <div className="font-medium">{suggestion.value}</div>
                {suggestion.displayName && (
                  <div className="text-sm text-gray-500">{suggestion.displayName}</div>
                )}
                {suggestion.category && (
                  <div className="text-xs text-gray-400 capitalize">{suggestion.category}</div>
                )}
              </div>
              {suggestion.count && (
                <div className="text-sm text-gray-500">{suggestion.count} results</div>
              )}
              <div className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded capitalize">
                {suggestion.type}
              </div>
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="absolute z-50 w-full mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-center text-gray-500">
          Loading suggestions...
        </div>
      )}
    </div>
  )
}

