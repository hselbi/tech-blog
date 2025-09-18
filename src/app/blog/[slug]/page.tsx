import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Tag, User, ArrowLeft } from "lucide-react"
import { getUnifiedPostBySlug, getAllUnifiedPostSlugs, getUnifiedRelatedPosts } from "@/lib/blog-service"
import { generateTableOfContents } from "@/lib/mdx"
import { formatDate } from "@/lib/utils"
import { generateBlogPostStructuredData } from "@/lib/structured-data"
import { TableOfContents } from "@/components/table-of-contents"
import { BlogCard } from "@/components/blog-card"
import { ReadingProgress } from "@/components/reading-progress"
import { SocialShare } from "@/components/social-share"
import mdxComponents from "@/components/mdx-components"
import type { Metadata } from "next"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = await getAllUnifiedPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getUnifiedPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | BlogMe`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [post.author.name],
      tags: post.tags,
      images: post.coverImage ? [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getUnifiedPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const tableOfContents = generateTableOfContents(post.content)
  const relatedPosts = await getUnifiedRelatedPosts(post.slug, 3)
  const structuredData = generateBlogPostStructuredData(post)

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Reading Progress */}
      <ReadingProgress />

      {/* Page Content */}
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          {/* Category & Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {post.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                {post.category}
              </span>
            )}
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {post.description}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
            {/* Author */}
            <div className="flex items-center space-x-3">
              {post.author.avatar ? (
                <div className="relative w-10 h-10">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{post.author.name}</p>
                {post.author.bio && <p className="text-sm">{post.author.bio}</p>}
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <time dateTime={post.date} className="font-medium">
                {formatDate(post.date)}
              </time>
            </div>

            {/* Reading Time */}
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{post.readingTime.text}</span>
            </div>

            {/* Share Button */}
            <SocialShare
              url={`/blog/${post.slug}`}
              title={post.title}
              description={post.description}
            />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative h-64 sm:h-96 lg:h-[500px] bg-gray-100 dark:bg-gray-800">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Table of Contents - Desktop */}
          {tableOfContents.length > 0 && (
            <aside className="hidden lg:block lg:col-span-3">
              <TableOfContents items={tableOfContents} />
            </aside>
          )}

          {/* Article Content */}
          <article className={`prose-custom max-w-none ${tableOfContents.length > 0 ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
            <MDXRemote source={post.content} components={mdxComponents} />
          </article>
        </div>

        {/* Table of Contents - Mobile */}
        {tableOfContents.length > 0 && (
          <div className="lg:hidden mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <TableOfContents items={tableOfContents} />
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 sm:mt-24">
            <h2 className="text-3xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </section>
        )}

        {/* Author Bio */}
        {post.author.bio && (
          <section className="mt-16 sm:mt-24 p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <div className="flex items-start space-x-4">
              {post.author.avatar ? (
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  About {post.author.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {post.author.bio}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
    </>
  )
}