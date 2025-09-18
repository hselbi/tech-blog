import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { BlogPost, BlogPostMeta } from '@/types/blog'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export function getAllPostSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames
      .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))
      .map((name) => name.replace(/\.(mdx|md)$/, ''))
  } catch (error) {
    console.warn('Posts directory not found, returning empty array')
    return []
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const realSlug = slug.replace(/\.mdx?$/, '')
    const fullPath = path.join(postsDirectory, `${realSlug}.mdx`)

    let fileContents: string
    try {
      fileContents = fs.readFileSync(fullPath, 'utf8')
    } catch {
      // Try .md extension if .mdx doesn't exist
      const mdPath = path.join(postsDirectory, `${realSlug}.md`)
      fileContents = fs.readFileSync(mdPath, 'utf8')
    }

    const { data, content } = matter(fileContents)
    const readingTimeResult = readingTime(content)

    return {
      slug: realSlug,
      title: data.title || 'Untitled',
      description: data.description || '',
      content,
      date: data.date || new Date().toISOString(),
      readingTime: readingTimeResult,
      tags: data.tags || [],
      category: data.category,
      author: data.author || { name: 'Anonymous' },
      coverImage: data.coverImage,
      featured: data.featured || false,
      published: data.published !== false,
      updated: data.updated,
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

export function getAllPosts(): BlogPostMeta[] {
  const slugs = getAllPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null && post.published !== false)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      readingTime: post.readingTime,
      tags: post.tags,
      category: post.category,
      author: post.author,
      coverImage: post.coverImage,
      featured: post.featured,
      published: post.published,
      updated: post.updated,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
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