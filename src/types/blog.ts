export interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  date: string
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
  tags: string[]
  category?: string
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  coverImage?: string
  featured?: boolean
  published?: boolean
  updated?: string
}

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  date: string
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
  tags: string[]
  category?: string
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  coverImage?: string
  featured?: boolean
  published?: boolean
  updated?: string
}

export interface TableOfContentsItem {
  id: string
  title: string
  level: number
  children?: TableOfContentsItem[]
}

export interface SearchResult {
  slug: string
  title: string
  description: string
  content: string
  tags: string[]
}