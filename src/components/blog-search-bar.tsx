"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"

interface BlogSearchBarProps {
  onSearch?: (query: string) => void
  onFilterToggle?: () => void
}

function BlogSearchBar({ onSearch, onFilterToggle }: BlogSearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch?.(value)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search articles..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <button
        onClick={onFilterToggle}
        className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors focus-ring"
      >
        <Filter className="w-5 h-5 mr-2" />
        Filter
      </button>
    </div>
  )
}

export default BlogSearchBar
export { BlogSearchBar }