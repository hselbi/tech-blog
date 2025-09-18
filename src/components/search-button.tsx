"use client"

import { Search } from "lucide-react"

interface SearchButtonProps {
  onClick?: () => void
  className?: string
}

function SearchButton({ onClick, className = "" }: SearchButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 focus-ring ${className}`}
    >
      <Search className="w-5 h-5 mr-2" />
      Search Articles
    </button>
  )
}

export default SearchButton
export { SearchButton }