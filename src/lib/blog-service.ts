import { BlogPost, BlogPostMeta } from '@/types/blog'
import { NotionBlogPost, NotionBlogPostMeta } from '@/types/notion'
import {
  getAllPosts as getMdxPosts,
  getPostBySlug as getMdxPostBySlug,
  getFeaturedPosts as getMdxFeaturedPosts,
  getPostsByTag as getMdxPostsByTag,
  getPostsByCategory as getMdxPostsByCategory,
  getAllTags as getMdxTags,
  getAllCategories as getMdxCategories,
  getRelatedPosts as getMdxRelatedPosts
} from './blog'
import {
  getAllUserNotionPosts,
  getNotionPostBySlug,
  getNotionFeaturedPosts,
  getNotionPostsByTag,
  getNotionPostsByCategory,
  getNotionTags,
  getNotionCategories,
  isNotionConfigured
} from './notion'
// User articles are now stored in Notion database and accessed through the unified blog service

// Unified types that can handle both MDX and Notion posts
export type UnifiedBlogPost = BlogPost | NotionBlogPost
export type UnifiedBlogPostMeta = BlogPostMeta | NotionBlogPostMeta

// Check if Notion CMS is enabled
function isNotionEnabled(): boolean {
  return process.env.ENABLE_NOTION_CMS === 'true' && isNotionConfigured()
}

// User articles are now handled through the Notion integration
// Published user articles will appear automatically through getNotionPosts()

// Get all posts from both sources with caching and ISR support
export async function getAllUnifiedPosts(): Promise<UnifiedBlogPostMeta[]> {
  // Check cache validity
  const now = Date.now()
  const cacheAge = now - unifiedPostsCache.timestamp
  if (unifiedPostsCache.data && cacheAge < CACHE_TTL) {
    return unifiedPostsCache.data
  }

  const mdxPosts = getMdxPosts()
  const notionPosts = isNotionEnabled() ? await getAllUserNotionPosts() : []

  // Combine and sort by date - aggregates published articles from all user databases
  const allPosts = [...mdxPosts, ...notionPosts]
  const sortedPosts = allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Update cache
  unifiedPostsCache = { data: sortedPosts, timestamp: now }

  return sortedPosts
}


// Get post by slug from both sources with fallback
export async function getUnifiedPostBySlug(slug: string): Promise<UnifiedBlogPost | null> {
  try {
    // Try MDX first (faster, local)
    const mdxPost = getMdxPostBySlug(slug)
    if (mdxPost) {
      return { ...mdxPost, source: 'mdx' as const }
    }

    // Try Notion if enabled (includes user articles)
    if (isNotionEnabled()) {
      try {
        const notionPost = await getNotionPostBySlug(slug)
        if (notionPost) {
          return notionPost
        }
      } catch (notionError) {
        console.error('Error fetching Notion post, falling back:', notionError)
        // Continue to return null if both sources fail
      }
    }

    return null
  } catch (error) {
    console.error('Error in getUnifiedPostBySlug:', error)
    return null
  }
}

// Get featured posts from both sources with fallback
export async function getUnifiedFeaturedPosts(): Promise<UnifiedBlogPostMeta[]> {
  try {
    const mdxFeatured = getMdxFeaturedPosts()
    let notionFeatured: UnifiedBlogPostMeta[] = []

    // Try Notion with fallback (includes user articles)
    if (isNotionEnabled()) {
      try {
        notionFeatured = await getNotionFeaturedPosts()
      } catch (notionError) {
        console.error('Error fetching Notion featured posts, using MDX only:', notionError)
      }
    }

    const allFeatured = [...mdxFeatured, ...notionFeatured]
    return allFeatured.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error in getUnifiedFeaturedPosts, falling back to MDX:', error)
    return getMdxFeaturedPosts()
  }
}

// Get posts by tag from both sources with fallback
export async function getUnifiedPostsByTag(tag: string): Promise<UnifiedBlogPostMeta[]> {
  try {
    const mdxPosts = getMdxPostsByTag(tag)
    let notionPosts: UnifiedBlogPostMeta[] = []

    // Try Notion with fallback (includes user articles)
    if (isNotionEnabled()) {
      try {
        notionPosts = await getNotionPostsByTag(tag)
      } catch (notionError) {
        console.error('Error fetching Notion posts by tag, using MDX only:', notionError)
      }
    }

    const allPosts = [...mdxPosts, ...notionPosts]
    return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error in getUnifiedPostsByTag, falling back to MDX:', error)
    return getMdxPostsByTag(tag)
  }
}

// Get posts by category from both sources with fallback
export async function getUnifiedPostsByCategory(category: string): Promise<UnifiedBlogPostMeta[]> {
  try {
    const mdxPosts = getMdxPostsByCategory(category)
    let notionPosts: UnifiedBlogPostMeta[] = []

    // Try Notion with fallback (includes user articles)
    if (isNotionEnabled()) {
      try {
        notionPosts = await getNotionPostsByCategory(category)
      } catch (notionError) {
        console.error('Error fetching Notion posts by category, using MDX only:', notionError)
      }
    }

    const allPosts = [...mdxPosts, ...notionPosts]
    return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error in getUnifiedPostsByCategory, falling back to MDX:', error)
    return getMdxPostsByCategory(category)
  }
}

// Get all tags from both sources with caching and fallback
export async function getUnifiedTags(): Promise<{ tag: string; count: number }[]> {
  try {
    // Check cache validity
    const now = Date.now()
    const cacheAge = now - unifiedTagsCache.timestamp
    if (unifiedTagsCache.data && cacheAge < CACHE_TTL) {
      return unifiedTagsCache.data
    }

    const mdxTags = getMdxTags()
    let notionTags: { tag: string; count: number }[] = []

    // Try Notion with fallback (includes user articles)
    if (isNotionEnabled()) {
      try {
        notionTags = await getNotionTags()
      } catch (notionError) {
        console.error('Error fetching Notion tags, using MDX only:', notionError)
      }
    }

    // Merge tag counts
    const tagCounts: Record<string, number> = {}

    mdxTags.forEach(({ tag, count }) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + count
    })

    notionTags.forEach(({ tag, count }) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + count
    })

    const sortedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)

    // Update cache
    unifiedTagsCache = { data: sortedTags, timestamp: now }

    return sortedTags
  } catch (error) {
    console.error('Error in getUnifiedTags, falling back to MDX:', error)
    return getMdxTags()
  }
}

// Get all categories from both sources with caching and fallback
export async function getUnifiedCategories(): Promise<{ category: string; count: number }[]> {
  try {
    // Check cache validity
    const now = Date.now()
    const cacheAge = now - unifiedCategoriesCache.timestamp
    if (unifiedCategoriesCache.data && cacheAge < CACHE_TTL) {
      return unifiedCategoriesCache.data
    }

    const mdxCategories = getMdxCategories()
    let notionCategories: { category: string; count: number }[] = []

    // Try Notion with fallback (includes user articles)
    if (isNotionEnabled()) {
      try {
        notionCategories = await getNotionCategories()
      } catch (notionError) {
        console.error('Error fetching Notion categories, using MDX only:', notionError)
      }
    }

    // Merge category counts
    const categoryCounts: Record<string, number> = {}

    mdxCategories.forEach(({ category, count }) => {
      categoryCounts[category] = (categoryCounts[category] || 0) + count
    })

    notionCategories.forEach(({ category, count }) => {
      categoryCounts[category] = (categoryCounts[category] || 0) + count
    })

    const sortedCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)

    // Update cache
    unifiedCategoriesCache = { data: sortedCategories, timestamp: now }

    return sortedCategories
  } catch (error) {
    console.error('Error in getUnifiedCategories, falling back to MDX:', error)
    return getMdxCategories()
  }
}

// Get related posts (unified version)
export async function getUnifiedRelatedPosts(slug: string, limit: number = 3): Promise<UnifiedBlogPostMeta[]> {
  const allPosts = await getAllUnifiedPosts()
  const currentPost = allPosts.find(post => post.slug === slug)

  if (!currentPost) return []

  const otherPosts = allPosts.filter(post => post.slug !== slug)

  // Score posts based on shared tags and category
  const scoredPosts = otherPosts.map(post => {
    let score = 0

    // Points for shared tags
    const sharedTags = post.tags.filter(tag =>
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
    .sort((a, b) => (b as any).score - (a as any).score)
    .slice(0, limit)
}

// Get all post slugs for static generation
export async function getAllUnifiedPostSlugs(): Promise<string[]> {
  const allPosts = await getAllUnifiedPosts()
  return allPosts.map(post => post.slug)
}

// Content source helpers
export function getPostSource(post: UnifiedBlogPost | UnifiedBlogPostMeta): 'mdx' | 'notion' {
  return 'source' in post ? post.source : 'mdx'
}

export function isNotionPost(post: UnifiedBlogPost | UnifiedBlogPostMeta): post is NotionBlogPost | NotionBlogPostMeta {
  return getPostSource(post) === 'notion'
}

export function isMdxPost(post: UnifiedBlogPost | UnifiedBlogPostMeta): post is BlogPost | BlogPostMeta {
  return getPostSource(post) === 'mdx'
}

// Cache for unified posts
let unifiedPostsCache: { data: UnifiedBlogPostMeta[] | null; timestamp: number } = { data: null, timestamp: 0 }
let unifiedTagsCache: { data: { tag: string; count: number }[] | null; timestamp: number } = { data: null, timestamp: 0 }
let unifiedCategoriesCache: { data: { category: string; count: number }[] | null; timestamp: number } = { data: null, timestamp: 0 }

const CACHE_TTL = 60 * 1000 // 1 minute cache

// Cache invalidation helper
export function invalidateCache() {
  unifiedPostsCache = { data: null, timestamp: 0 }
  unifiedTagsCache = { data: null, timestamp: 0 }
  unifiedCategoriesCache = { data: null, timestamp: 0 }
  console.log('Unified blog cache invalidated')
}