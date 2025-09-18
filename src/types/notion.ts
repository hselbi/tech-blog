import { BlogPost, BlogPostMeta } from './blog'

// Notion-specific types
export interface NotionPage {
  id: string
  url: string
  created_time: string
  last_edited_time: string
  properties: NotionProperties
  cover?: {
    type: string
    external?: { url: string }
    file?: { url: string }
  }
}

export interface NotionProperties {
  title: {
    type: 'title'
    title: Array<{
      type: 'text'
      text: { content: string }
      plain_text: string
    }>
  }
  description: {
    type: 'rich_text'
    rich_text: Array<{
      type: 'text'
      text: { content: string }
      plain_text: string
    }>
  }
  tags: {
    type: 'multi_select'
    multi_select: Array<{
      id: string
      name: string
      color: string
    }>
  }
  category: {
    type: 'select'
    select?: {
      id: string
      name: string
      color: string
    }
  }
  status: {
    type: 'select'
    select?: {
      id: string
      name: string
      color: string
    }
  }
  published: {
    type: 'checkbox'
    checkbox: boolean
  }
  featured: {
    type: 'checkbox'
    checkbox: boolean
  }
  publishDate: {
    type: 'date'
    date?: {
      start: string
      end?: string
    }
  }
  author: {
    type: 'rich_text'
    rich_text: Array<{
      type: 'text'
      text: { content: string }
      plain_text: string
    }>
  }
  slug: {
    type: 'rich_text'
    rich_text: Array<{
      type: 'text'
      text: { content: string }
      plain_text: string
    }>
  }
}

export interface NotionBlock {
  id: string
  type: string
  has_children: boolean
  created_time: string
  last_edited_time: string
  [key: string]: any
}

export interface NotionConfig {
  token: string
  databaseId: string
  cacheRevalidate: number
}

// Extended blog types for Notion
export interface NotionBlogPost extends BlogPost {
  notionId: string
  notionUrl: string
  lastEditedTime: string
  source: 'notion' | 'mdx'
}

export interface NotionBlogPostMeta extends BlogPostMeta {
  notionId: string
  notionUrl: string
  lastEditedTime: string
  source: 'notion' | 'mdx'
}

// Database query filters
export interface NotionDatabaseQuery {
  filter?: {
    and?: Array<{
      property: string
      checkbox?: { equals: boolean }
      select?: { equals: string }
      date?: { on_or_after: string }
      rich_text?: { equals: string } | { contains: string }
    }>
  }
  sorts?: Array<{
    property: string
    direction: 'ascending' | 'descending'
  }>
  start_cursor?: string
  page_size?: number
}