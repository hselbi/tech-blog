import Fuse from 'fuse.js'
import { BlogPostMeta, SearchResult } from '@/types/blog'

export class BlogSearch {
  private fuse: Fuse<BlogPostMeta>

  constructor(posts: BlogPostMeta[]) {
    const options: any = {
      keys: [
        { name: 'title', weight: 3 },
        { name: 'description', weight: 2 },
        { name: 'tags', weight: 1.5 },
        { name: 'category', weight: 1 },
        { name: 'author.name', weight: 0.5 },
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
    }

    this.fuse = new Fuse(posts, options)
  }

  search(query: string, limit: number = 10): SearchResult[] {
    if (!query.trim()) return []

    const results = this.fuse.search(query, { limit })

    return results.map((result) => ({
      slug: result.item.slug,
      title: result.item.title,
      description: result.item.description,
      content: '', // We don't include full content in search results
      tags: result.item.tags,
      score: result.score || 0,
      matches: result.matches,
    }))
  }

  searchByTag(tag: string, posts: BlogPostMeta[]): BlogPostMeta[] {
    return posts.filter((post) =>
      post.tags.some((postTag) =>
        postTag.toLowerCase().includes(tag.toLowerCase())
      )
    )
  }

  searchByCategory(category: string, posts: BlogPostMeta[]): BlogPostMeta[] {
    return posts.filter((post) =>
      post.category?.toLowerCase().includes(category.toLowerCase())
    )
  }

  getRelatedByTags(currentPost: BlogPostMeta, allPosts: BlogPostMeta[], limit: number = 5): BlogPostMeta[] {
    const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug)

    // Score posts based on shared tags
    const scoredPosts = otherPosts.map(post => {
      const sharedTags = post.tags.filter(tag =>
        currentPost.tags.some(currentTag =>
          currentTag.toLowerCase() === tag.toLowerCase()
        )
      )

      let score = sharedTags.length

      // Bonus points for same category
      if (post.category && post.category === currentPost.category) {
        score += 2
      }

      return { ...post, score }
    })

    return scoredPosts
      .sort((a, b) => b.score - a.score)
      .filter(post => post.score > 0)
      .slice(0, limit)
  }
}

export function createSearchIndex(posts: BlogPostMeta[]): BlogSearch {
  return new BlogSearch(posts)
}

export function highlightSearchTerm(text: string, term: string): string {
  if (!term.trim()) return text

  const regex = new RegExp(`(${term})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
}