import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Hash } from "lucide-react"
import { getUnifiedPostsByCategory, getUnifiedCategories } from "@/lib/blog-service"
import { BlogCard } from "@/components/blog-card"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateStaticParams() {
  const categories = await getUnifiedCategories()
  return categories.map((category) => ({
    category: encodeURIComponent(category.category.toLowerCase()),
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  const posts = await getUnifiedPostsByCategory(decodedCategory)

  if (posts.length === 0) {
    return {
      title: "Category Not Found",
    }
  }

  const categoryName = posts[0]?.category || decodedCategory

  return {
    title: `${categoryName} Articles | BlogMe`,
    description: `Explore ${posts.length} articles in the "${categoryName}" category. Discover comprehensive content on this topic.`,
    openGraph: {
      title: `${categoryName} Articles | BlogMe`,
      description: `Explore ${posts.length} articles in the "${categoryName}" category.`,
      type: "website",
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  const posts = await getUnifiedPostsByCategory(decodedCategory)

  if (posts.length === 0) {
    notFound()
  }

  // Find the original case-sensitive category name
  const categoryName = posts[0]?.category || decodedCategory

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Back Link */}
          <Link
            href="/tags"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Tags
          </Link>

          <div className="flex items-center mb-6">
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full mr-4">
              <Hash className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold font-serif text-gray-900 dark:text-gray-100">
                {categoryName}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
                {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this category
              </p>
            </div>
          </div>

          {/* Category info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Explore our comprehensive collection of <strong>{categoryName}</strong> articles.
              This category contains curated content covering various aspects and topics within this domain.
            </p>
          </div>
        </div>
      </div>

      {/* Articles */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-8">
            Other Categories
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(await getUnifiedCategories())
              .filter(cat => cat.category.toLowerCase() !== decodedCategory.toLowerCase())
              .slice(0, 8)
              .map((category) => (
                <Link
                  key={category.category}
                  href={`/category/${encodeURIComponent(category.category.toLowerCase())}`}
                  className="group block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-soft hover:shadow-medium border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 focus-ring"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                      <Hash className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {category.count}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {category.category}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {category.count} {category.count === 1 ? 'article' : 'articles'}
                  </p>
                </Link>
              ))}
          </div>

          {/* Back to all categories */}
          <div className="mt-12 text-center">
            <Link
              href="/tags"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 focus-ring"
            >
              Explore All Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}