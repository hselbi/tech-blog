"use client"

import { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"
import { TableOfContentsItem } from "@/types/blog"

interface TableOfContentsProps {
  items: TableOfContentsItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      }
    )

    // Observe all headings
    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
      if (item.children) {
        item.children.forEach((child) => {
          const childElement = document.getElementById(child.id)
          if (childElement) {
            observer.observe(childElement)
          }
        })
      }
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const renderTocItem = (item: TableOfContentsItem, level: number = 0) => {
    const isActive = activeId === item.id
    const hasChildren = item.children && item.children.length > 0

    return (
      <li key={item.id} className={level > 0 ? "ml-4" : ""}>
        <button
          onClick={() => scrollToHeading(item.id)}
          className={`group flex items-start w-full text-left py-2 px-3 rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
            isActive
              ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 font-medium"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          }`}
        >
          <span
            className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 mr-3 transition-colors ${
              isActive
                ? "bg-primary-600 dark:bg-primary-400"
                : "bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500"
            }`}
          />
          <span className="text-sm leading-relaxed">{item.title}</span>
        </button>

        {hasChildren && (
          <ul className="mt-1 space-y-1">
            {item.children!.map((child) => renderTocItem(child, level + 1))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <nav className="sticky top-24 space-y-2">
      <div className="flex items-center space-x-2 px-3 py-2 mb-4">
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wider">
          Table of Contents
        </h2>
      </div>
      <ul className="space-y-1 max-h-screen overflow-y-auto">
        {items.map((item) => renderTocItem(item))}
      </ul>
    </nav>
  )
}