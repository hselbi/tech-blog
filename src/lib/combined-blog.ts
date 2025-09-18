import { BlogPost, BlogPostMeta } from '@/types/blog'
import { getAllPosts as getFilePosts, getPostBySlug as getFilePostBySlug } from './blog'
import { articles } from './auth'
import readingTime from 'reading-time'

// Convert database article to BlogPost format
function convertArticleToBlogPost(article: typeof articles[0]): BlogPost {
  const readingTimeResult = readingTime(article.content)

  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    content: article.content,
    date: article.createdAt,
    readingTime: readingTimeResult,
    tags: article.tags,
    category: article.category,
    author: article.author,
    coverImage: article.coverImage,
    featured: article.featured,
    published: article.status === 'published',
    updated: article.updatedAt !== article.createdAt ? article.updatedAt : undefined,
  }
}

// Convert database article to BlogPostMeta format
function convertArticleToBlogPostMeta(article: typeof articles[0]): BlogPostMeta {
  const readingTimeResult = readingTime(article.content)

  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    date: article.createdAt,
    readingTime: readingTimeResult,
    tags: article.tags,
    category: article.category,
    author: article.author,
    coverImage: article.coverImage,
    featured: article.featured,
    published: article.status === 'published',
    updated: article.updatedAt !== article.createdAt ? article.updatedAt : undefined,
  }
}

export function getAllPosts(): BlogPostMeta[] {
  // Get file-based posts
  const filePosts = getFilePosts()

  // Get published user articles
  const userArticles = articles
    .filter(article => article.status === 'published')
    .map(convertArticleToBlogPostMeta)

  // Combine and sort by date
  const allPosts = [...filePosts, ...userArticles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return allPosts
}

export function getPostBySlug(slug: string): BlogPost | null {
  // First try to find in user articles
  const userArticle = articles.find(article =>
    article.slug === slug && article.status === 'published'
  )

  if (userArticle) {
    return convertArticleToBlogPost(userArticle)
  }

  // Fall back to file-based posts
  return getFilePostBySlug(slug)
}

export function getFeaturedPosts(): BlogPostMeta[] {
  return getAllPosts().filter((post) => post.featured)
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.some((postTag) =>
      postTag.toLowerCase() === tag.toLowerCase()
    )
  )
}

export function getPostsByCategory(category: string): BlogPostMeta[] {
  return getAllPosts().filter((post) =>
    post.category?.toLowerCase() === category.toLowerCase()
  )
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts()
  const tagCounts: Record<string, number> = {}

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getAllCategories(): { category: string; count: number }[] {
  const posts = getAllPosts()
  const categoryCounts: Record<string, number> = {}

  posts.forEach((post) => {
    if (post.category) {
      categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1
    }
  })

  return Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
}

export function getRelatedPosts(slug: string, limit: number = 3): BlogPostMeta[] {
  const currentPost = getPostBySlug(slug)
  if (!currentPost) return []

  const allPosts = getAllPosts().filter((post) => post.slug !== slug)

  // Score posts based on shared tags and category
  const scoredPosts = allPosts.map((post) => {
    let score = 0

    // Points for shared tags
    const sharedTags = post.tags.filter((tag) =>
      currentPost.tags.includes(tag)
    )
    score += sharedTags.length * 2

    // Points for same category
    if (post.category && post.category === currentPost.category) {
      score += 3
    }

    return { ...post, score }
  })

  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map(post => post.slug)
}