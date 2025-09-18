"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Clock, Tag } from "lucide-react"
import { BlogSearch, highlightSearchTerm } from "@/lib/search"
import { debounce } from "@/lib/utils"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize component
  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem("blog-search-history")
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
        const data = await response.json()
        setResults(data.results || [])
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)
  ).current

  // Handle search input change
  const handleSearch = (value: string) => {
    setQuery(value)
    setIsLoading(true)
    debouncedSearch(value)
  }

  // Handle result selection
  const handleResultClick = (slug: string) => {
    // Add to search history
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5)
    setSearchHistory(newHistory)
    localStorage.setItem("blog-search-history", JSON.stringify(newHistory))

    router.push(`/blog/${slug}`)
    onClose()
  }

  // Handle history item click
  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery)
    handleSearch(historyQuery)
  }

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("blog-search-history")
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-[10vh]">
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-lg"
            />
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {/* Loading */}
            {isLoading && (
              <div className="px-6 py-8 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Searching...</p>
              </div>
            )}

            {/* Results */}
            {!isLoading && query && results.length > 0 && (
              <div className="py-2">
                <div className="px-6 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Search Results ({results.length})
                </div>
                {results.map((result) => (
                  <button
                    key={result.slug}
                    onClick={() => handleResultClick(result.slug)}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <h3
                      className="font-medium text-gray-900 dark:text-gray-100 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                      dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(result.title, query)
                      }}
                    />
                    <p
                      className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(result.description, query)
                      }}
                    />
                    {result.tags.length > 0 && (
                      <div className="flex items-center mt-2 space-x-2">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {result.tags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {!isLoading && query && results.length === 0 && (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No articles found for &quot;{query}&quot;
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Try searching with different keywords
                </p>
              </div>
            )}

            {/* Search history */}
            {!query && searchHistory.length > 0 && (
              <div className="py-2">
                <div className="flex items-center justify-between px-6 py-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    Clear
                  </button>
                </div>
                {searchHistory.map((historyItem, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(historyItem)}
                    className="w-full px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center"
                  >
                    <Clock className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">{historyItem}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!query && searchHistory.length === 0 && (
              <div className="px-6 py-8 text-center">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  Start typing to search articles
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Search by title, content, tags, or author
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>Press ESC to close</span>
              </div>
              <span>Powered by Fuse.js</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}