import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Tag } from "lucide-react"
import { getUnifiedPostsByTag, getUnifiedTags } from "@/lib/blog-service"
import { BlogCard } from "@/components/blog-card"

interface TagPageProps {
  params: {
    tag: string
  }
}

export async function generateStaticParams() {
  const tags = await getUnifiedTags()
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag.tag.toLowerCase()),
  }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const decodedTag = decodeURIComponent(params.tag)
  const posts = await getUnifiedPostsByTag(decodedTag)

  if (posts.length === 0) {
    return {
      title: "Tag Not Found",
    }
  }

  const tagName = posts[0]?.tags.find(t => t.toLowerCase() === decodedTag.toLowerCase()) || decodedTag

  return {
    title: `${tagName} Articles | BlogMe`,
    description: `Explore ${posts.length} articles tagged with "${tagName}". Discover insights and tutorials on this topic.`,
    openGraph: {
      title: `${tagName} Articles | BlogMe`,
      description: `Explore ${posts.length} articles tagged with "${tagName}".`,
      type: "website",
    },
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const decodedTag = decodeURIComponent(params.tag)
  const posts = await getUnifiedPostsByTag(decodedTag)

  if (posts.length === 0) {
    notFound()
  }

  // Find the original case-sensitive tag name
  const tagName = posts[0]?.tags.find(t => t.toLowerCase() === decodedTag.toLowerCase()) || decodedTag

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
              <Tag className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold font-serif text-gray-900 dark:text-gray-100">
                {tagName}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
                {posts.length} {posts.length === 1 ? 'article' : 'articles'} tagged with &quot;{tagName}&quot;
              </p>
            </div>
          </div>

          {/* Tag info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Discover our collection of articles about <strong>{tagName}</strong>.
              From beginner tutorials to advanced insights, explore everything related to this topic.
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

      {/* Related Tags */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-8">
            Related Tags
          </h2>

          <div className="flex flex-wrap gap-3">
            {/* Get all unique tags from the posts, excluding the current tag */}
            {Array.from(new Set(
              posts.flatMap(post => post.tags)
                .filter(tag => tag.toLowerCase() !== decodedTag.toLowerCase())
            )).slice(0, 10).map((relatedTag) => (
              <Link
                key={relatedTag}
                href={`/tags/${encodeURIComponent(relatedTag.toLowerCase())}`}
                className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 focus-ring"
              >
                <Tag className="w-3 h-3 mr-2 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {relatedTag}
                </span>
              </Link>
            ))}
          </div>

          {/* Back to all tags */}
          <div className="mt-12 text-center">
            <Link
              href="/tags"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 focus-ring"
            >
              Explore All Tags
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}