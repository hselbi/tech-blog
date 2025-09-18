"use client"

import { useState, useEffect } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100

      setProgress(Math.min(Math.max(scrollPercent, 0), 100))
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    updateProgress() // Initial calculation

    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress indicator (visible on scroll) */}
      <div
        className={`fixed bottom-8 right-8 z-40 transition-all duration-300 ${
          progress > 10 && progress < 95
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="relative w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-large border border-gray-200 dark:border-gray-700 flex items-center justify-center">
          {/* Background circle */}
          <svg className="absolute inset-0 w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(14 165 233)" />
                <stop offset="100%" stopColor="rgb(212 70 239)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Progress text */}
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </>
  )
}