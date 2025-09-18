import { Metadata } from "next"
import Link from "next/link"
import { Tag, Hash, TrendingUp } from "lucide-react"
import { getUnifiedTags, getUnifiedCategories } from "@/lib/blog-service"
import { SearchButton } from "@/components/search-button"

export const metadata: Metadata = {
  title: "Tags | BlogMe",
  description: "Browse articles by tags and categories. Discover content organized by topics, technologies, and themes.",
  openGraph: {
    title: "Tags | BlogMe",
    description: "Browse articles by tags and categories.",
    type: "website",
  },
}

export default async function TagsPage() {
  const tags = await getUnifiedTags()
  const categories = await getUnifiedCategories()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
                <Tag className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6">
              Explore by Topics
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Discover articles organized by tags and categories. Find exactly what you&apos;re looking for.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {tags.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Tags
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {categories.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Categories
                </div>
              </div>
              <div className="text-center md:col-span-1 col-span-2">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {tags.reduce((sum, tag) => sum + tag.count, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Total Articles
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 sm:py-24 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-12">
              <Hash className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3" />
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100">
                Categories
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.category}
                  href={`/category/${encodeURIComponent(category.category.toLowerCase())}`}
                  className="group block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-soft hover:shadow-medium border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                      <Hash className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {category.count}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {category.category}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {category.count} {category.count === 1 ? 'article' : 'articles'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tags Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-12">
            <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3" />
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100">
              Popular Tags
            </h2>
          </div>

          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {tags.map((tag) => (
                <Link
                  key={tag.tag}
                  href={`/tags/${encodeURIComponent(tag.tag.toLowerCase())}`}
                  className="group inline-flex items-center px-4 py-3 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    fontSize: `${Math.max(0.875, Math.min(1.25, 0.875 + (tag.count * 0.1)))}rem`
                  }}
                >
                  <Tag className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                    {tag.tag}
                  </span>
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full group-hover:bg-primary-100 dark:group-hover:bg-primary-800 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                    {tag.count}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No tags found. Check back when articles are published!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Use our search to find specific articles or browse all our content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-xl shadow-large hover:shadow-xl transition-all duration-300 focus-ring"
            >
              Browse All Articles
            </Link>
            <SearchButton />
          </div>
        </div>
      </section>
    </div>
  )
}