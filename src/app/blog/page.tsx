import { Metadata } from "next"
import { TrendingUp } from "lucide-react"
import { getAllUnifiedPosts, getUnifiedTags } from "@/lib/blog-service"
import { BlogCard } from "@/components/blog-card"
import { BlogSearchBar } from "@/components/blog-search-bar"
import { getBrandMetadata, getBrandName, getBrandTagline } from "@/config/brand"

const brandMetadata = getBrandMetadata()

export const metadata: Metadata = {
  title: `Blog | ${brandMetadata.title}`,
  description: brandMetadata.description,
  keywords: brandMetadata.keywords,
  openGraph: {
    title: `Blog | ${brandMetadata.title}`,
    description: brandMetadata.description,
    type: "website",
  },
}

export default async function BlogPage() {
  const posts = await getAllUnifiedPosts()
  const tags = await getUnifiedTags()
  const featuredPosts = posts.filter(post => post.featured)
  const regularPosts = posts.filter(post => !post.featured)

  const brandName = getBrandName()
  const brandTagline = getBrandTagline()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6">
              <span className="block">Explore</span>
              <span className="block bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
                {brandName} Blog
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              {brandTagline} - {brandMetadata.description}
            </p>

            {/* Search and Filter Bar */}
            <div className="max-w-2xl mx-auto">
              <BlogSearchBar />
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {posts.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Total Articles
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {featuredPosts.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Featured
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {tags.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Topics
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Weekly
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Updates
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Tags */}
      <section className="py-12 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Popular Topics
            </h2>
            <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex flex-wrap gap-3">
            {tags.slice(0, 10).map((tag) => (
              <button
                key={tag.tag}
                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 rounded-full text-sm font-medium transition-colors focus-ring"
              >
                {tag.tag}
                <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                  {tag.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-12">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {featuredPosts.map((post) => (
                <BlogCard key={post.slug} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-12">
            All Articles
          </h2>

          {regularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No articles found. Check back soon for new content!
              </p>
            </div>
          )}

          {/* Load More Button */}
          {posts.length > 9 && (
            <div className="mt-12 text-center">
              <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 focus-ring">
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}