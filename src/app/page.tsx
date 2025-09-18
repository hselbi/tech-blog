import Link from "next/link"
import { ArrowRight, TrendingUp } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { BlogCard } from "@/components/blog-card"
import { NewsletterForm } from "@/components/newsletter-form"
import { getAllUnifiedPosts, getUnifiedFeaturedPosts } from "@/lib/blog-service"

export default async function Home() {
  const featuredPosts = await getUnifiedFeaturedPosts()
  const allPosts = await getAllUnifiedPosts()
  const recentPosts = allPosts.slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Featured Articles
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Hand-picked articles covering the latest in web development
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium group"
              >
                View all
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <BlogCard key={post.slug} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Section */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Latest Articles
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Fresh insights and tutorials from the world of development
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium group"
            >
              View all
              <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {/* CTA for more posts */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-xl shadow-large hover:shadow-xl transition-all duration-300 focus-ring group"
            >
              <TrendingUp className="mr-2 w-5 h-5" />
              Explore All Articles
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-3xl p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Get the latest articles and insights delivered directly to your inbox.
              No spam, just quality content about web development.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  )
}
