import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Tag, User } from "lucide-react"
import { BlogPostMeta } from "@/types/blog"
import { formatDate } from "@/lib/utils"

interface BlogCardProps {
  post: BlogPostMeta
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const cardClasses = featured
    ? "group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-large hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
    : "group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-200 dark:border-gray-700"

  const imageClasses = featured ? "h-64 sm:h-80" : "h-48"

  return (
    <article className={cardClasses}>
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Cover Image */}
        {post.coverImage && (
          <div className={`relative ${imageClasses} bg-gray-200 dark:bg-gray-700`}>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFhhemlgCNohCrNjjsqIwdsBFUjVQTq1nDqq0o4Qk6qK2+pX1nUNFQBLIHNdPQOQhJBYdSjXsMQdNpEKSzYR1bsJQUmZzK0KzaJyKRUBUjm6rjKAKqe3Rr1rr+6/H2kuJkjNjHfP+DmTJhKyKRqK8eFtAR2UBNADKJHIxp+Wc8TsEa1yOaB//9k="
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {post.featured && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-500 text-white">
                  Featured
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={featured ? "p-6 sm:p-8" : "p-6"}>
          {/* Category & Tags */}
          <div className="flex items-center gap-2 mb-3">
            {post.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                {post.category}
              </span>
            )}
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className={`font-serif font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-3 ${
            featured ? "text-2xl sm:text-3xl leading-tight" : "text-xl leading-tight"
          }`}>
            {post.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
            {post.description}
          </p>

          {/* Meta information */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              {/* Author */}
              <div className="flex items-center space-x-2">
                {post.author.avatar ? (
                  <div className="relative w-6 h-6">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="font-medium">{post.author.name}</span>
              </div>

              {/* Date */}
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
            </div>

            {/* Reading time */}
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime.text}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}