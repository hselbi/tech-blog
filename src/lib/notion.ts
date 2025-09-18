import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { NotionConfig, NotionPage, NotionBlogPost, NotionBlogPostMeta, NotionDatabaseQuery } from '@/types/notion'
import readingTime from 'reading-time'
import { slugify } from './utils'

// Notion configuration
const notionConfig: NotionConfig = {
  token: process.env.NOTION_TOKEN || '',
  databaseId: process.env.NOTION_DATABASE_ID || '',
  cacheRevalidate: parseInt(process.env.NOTION_CACHE_REVALIDATE || '3600'),
}

// Initialize Notion client (lazy initialization)
let notion: Client | null = null
let n2m: NotionToMarkdown | null = null

function getNotionClient(): Client {
  if (!notion) {
    notion = new Client({
      auth: notionConfig.token,
    })
  }
  return notion
}

function getN2M(): NotionToMarkdown {
  if (!n2m) {
    n2m = new NotionToMarkdown({ notionClient: getNotionClient() })
  }
  return n2m
}

// Check if Notion is properly configured
export function isNotionConfigured(): boolean {
  return !!(notionConfig.token && notionConfig.databaseId)
}

// Cache for Notion posts
let postsCache: { data: NotionBlogPostMeta[] | null; timestamp: number } = { data: null, timestamp: 0 }

// Get all published posts from Notion with caching
export async function getNotionPosts(): Promise<NotionBlogPostMeta[]> {
  if (!isNotionConfigured()) {
    console.warn('Notion is not configured. Skipping Notion posts.')
    return []
  }

  // Check cache validity
  const now = Date.now()
  const cacheAge = now - postsCache.timestamp
  if (postsCache.data && cacheAge < notionConfig.cacheRevalidate * 1000) {
    return postsCache.data
  }

  try {
    const query: NotionDatabaseQuery = {
      filter: {
        and: [
          {
            property: 'published',
            checkbox: { equals: true },
          },
          {
            property: 'status',
            select: { equals: 'Published' },
          },
        ],
      },
      sorts: [
        {
          property: 'publishDate',
          direction: 'descending',
        },
      ],
    }

    const response = await getNotionClient().databases.query({
      database_id: notionConfig.databaseId,
      ...query,
    })

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        return await convertNotionPageToPostMeta(page as NotionPage)
      })
    )

    const filteredPosts = posts.filter(Boolean) as NotionBlogPostMeta[]

    // Update cache
    postsCache = { data: filteredPosts, timestamp: now }

    return filteredPosts
  } catch (error) {
    console.error('Error fetching Notion posts:', error)
    return postsCache.data || []
  }
}

// Get a single post by slug from Notion
export async function getNotionPostBySlug(slug: string): Promise<NotionBlogPost | null> {
  if (!isNotionConfigured()) {
    return null
  }

  try {
    const query: NotionDatabaseQuery = {
      filter: {
        and: [
          {
            property: 'published',
            checkbox: { equals: true },
          },
          {
            property: 'slug',
            rich_text: { equals: slug },
          },
        ],
      },
    }

    const response = await getNotionClient().databases.query({
      database_id: notionConfig.databaseId,
      ...query,
    })

    if (response.results.length === 0) {
      return null
    }

    const page = response.results[0] as NotionPage
    return await convertNotionPageToPost(page)
  } catch (error) {
    console.error('Error fetching Notion post by slug:', error)
    return null
  }
}

// Get featured posts from Notion
export async function getNotionFeaturedPosts(): Promise<NotionBlogPostMeta[]> {
  if (!isNotionConfigured()) {
    return []
  }

  try {
    const query: NotionDatabaseQuery = {
      filter: {
        and: [
          {
            property: 'published',
            checkbox: { equals: true },
          },
          {
            property: 'featured',
            checkbox: { equals: true },
          },
        ],
      },
      sorts: [
        {
          property: 'publishDate',
          direction: 'descending',
        },
      ],
    }

    const response = await getNotionClient().databases.query({
      database_id: notionConfig.databaseId,
      ...query,
    })

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        return await convertNotionPageToPostMeta(page as NotionPage)
      })
    )

    return posts.filter(Boolean) as NotionBlogPostMeta[]
  } catch (error) {
    console.error('Error fetching featured Notion posts:', error)
    return []
  }
}

// Convert Notion page to blog post metadata
async function convertNotionPageToPostMeta(page: NotionPage): Promise<NotionBlogPostMeta | null> {
  try {
    const properties = page.properties

    // Extract title
    const title = properties.title?.title?.[0]?.plain_text || 'Untitled'

    // Extract description
    const description = properties.description?.rich_text?.[0]?.plain_text || ''

    // Extract tags
    const tags = properties.tags?.multi_select?.map(tag => tag.name) || []

    // Extract category
    const category = properties.category?.select?.name

    // Extract dates
    const publishDate = properties.publishDate?.date?.start || page.created_time
    const lastEditedTime = page.last_edited_time

    // Extract author
    const authorName = properties.author?.rich_text?.[0]?.plain_text || 'Anonymous'

    // Extract slug (auto-generate if not provided)
    let slug = properties.slug?.rich_text?.[0]?.plain_text
    if (!slug) {
      slug = slugify(title)
    }

    // Extract cover image
    let coverImage: string | undefined
    if (page.cover) {
      if (page.cover.type === 'external') {
        coverImage = page.cover.external?.url
      } else if (page.cover.type === 'file') {
        coverImage = page.cover.file?.url
      }
    }

    // Get page content for reading time calculation
    const blocks = await getNotionClient().blocks.children.list({
      block_id: page.id,
    })

    const mdString = await getN2M().blocksToMarkdown(blocks.results)
    const content = getN2M().toMarkdownString(mdString).parent || ''
    const readingTimeResult = readingTime(content || 'No content available')

    return {
      slug,
      title,
      description,
      date: publishDate,
      readingTime: readingTimeResult,
      tags,
      category,
      author: {
        name: authorName,
      },
      coverImage,
      featured: properties.featured?.checkbox || false,
      published: properties.published?.checkbox || false,
      notionId: page.id,
      notionUrl: page.url,
      lastEditedTime,
      source: 'notion',
    }
  } catch (error) {
    console.error('Error converting Notion page to post meta:', error)
    return null
  }
}

// Convert Notion page to full blog post
async function convertNotionPageToPost(page: NotionPage): Promise<NotionBlogPost | null> {
  try {
    const meta = await convertNotionPageToPostMeta(page)
    if (!meta) return null

    // Get page content
    const blocks = await getNotionClient().blocks.children.list({
      block_id: page.id,
    })

    const mdString = await getN2M().blocksToMarkdown(blocks.results)
    const content = getN2M().toMarkdownString(mdString).parent || ''

    return {
      ...meta,
      content,
    } as NotionBlogPost
  } catch (error) {
    console.error('Error converting Notion page to post:', error)
    return null
  }
}

// Get posts by tag from Notion
export async function getNotionPostsByTag(tag: string): Promise<NotionBlogPostMeta[]> {
  if (!isNotionConfigured()) {
    return []
  }

  try {
    const allPosts = await getNotionPosts()
    return allPosts.filter(post =>
      post.tags.some(postTag =>
        postTag.toLowerCase() === tag.toLowerCase()
      )
    )
  } catch (error) {
    console.error('Error fetching Notion posts by tag:', error)
    return []
  }
}

// Get posts by category from Notion
export async function getNotionPostsByCategory(category: string): Promise<NotionBlogPostMeta[]> {
  if (!isNotionConfigured()) {
    return []
  }

  try {
    const allPosts = await getNotionPosts()
    return allPosts.filter(post =>
      post.category?.toLowerCase() === category.toLowerCase()
    )
  } catch (error) {
    console.error('Error fetching Notion posts by category:', error)
    return []
  }
}

// Get all tags from Notion posts
export async function getNotionTags(): Promise<{ tag: string; count: number }[]> {
  if (!isNotionConfigured()) {
    return []
  }

  try {
    const posts = await getNotionPosts()
    const tagCounts: Record<string, number> = {}

    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('Error fetching Notion tags:', error)
    return []
  }
}

// Get all categories from Notion posts
export async function getNotionCategories(): Promise<{ category: string; count: number }[]> {
  if (!isNotionConfigured()) {
    return []
  }

  try {
    const posts = await getNotionPosts()
    const categoryCounts: Record<string, number> = {}

    posts.forEach(post => {
      if (post.category) {
        categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1
      }
    })

    return Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('Error fetching Notion categories:', error)
    return []
  }
}

// Create a new article in user's personal Notion database
export async function createNotionArticle(articleData: {
  title: string
  description: string
  content: string
  tags: string[]
  category?: string
  coverImage?: string
  status: 'draft' | 'published'
  featured: boolean
  authorName: string
  authorEmail: string
}): Promise<NotionBlogPost | null> {
  if (!isNotionConfigured()) {
    throw new Error('Notion is not configured')
  }

  try {
    const { title, description, content, tags, category, coverImage, status, featured, authorName, authorEmail } = articleData

    // Get or create user's personal database
    const { ensureUserDatabase } = await import('./user-notion')
    const userDatabaseId = await ensureUserDatabase(authorEmail, authorName)

    if (!userDatabaseId) {
      throw new Error('Failed to create or access user database')
    }

    // Generate slug from title
    const slug = slugify(title) + '-' + Date.now()

    // Prepare properties for Notion database
    const properties: any = {
      title: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      description: {
        rich_text: [
          {
            text: {
              content: description || '',
            },
          },
        ],
      },
      slug: {
        rich_text: [
          {
            text: {
              content: slug,
            },
          },
        ],
      },
      author: {
        rich_text: [
          {
            text: {
              content: authorName,
            },
          },
        ],
      },
      tags: {
        multi_select: tags.map(tag => ({ name: tag })),
      },
      published: {
        checkbox: status === 'published',
      },
      featured: {
        checkbox: featured,
      },
      status: {
        select: {
          name: status === 'published' ? 'Published' : 'Draft',
        },
      },
      publishDate: {
        date: {
          start: new Date().toISOString(),
        },
      },
    }

    // Add category if provided
    if (category) {
      properties.category = {
        select: {
          name: category,
        },
      }
    }

    // Create the page in user's personal database
    const response = await getNotionClient().pages.create({
      parent: {
        database_id: userDatabaseId,
      },
      properties,
      cover: coverImage ? {
        type: 'external',
        external: {
          url: coverImage,
        },
      } : undefined,
    })

    // Add content blocks to the page
    if (content && content.trim()) {
      await addContentToNotionPage(response.id, content)
    }

    // Clear cache to reflect new article
    postsCache = { data: null, timestamp: 0 }

    // Convert response to NotionBlogPost format
    const page = response as any as NotionPage
    return await convertNotionPageToPost(page)
  } catch (error) {
    console.error('Error creating Notion article:', error)
    throw error
  }
}

// Update an existing article in Notion database
export async function updateNotionArticle(
  notionId: string,
  updateData: {
    title?: string
    description?: string
    content?: string
    tags?: string[]
    category?: string
    coverImage?: string
    status?: 'draft' | 'published'
    featured?: boolean
  }
): Promise<NotionBlogPost | null> {
  if (!isNotionConfigured()) {
    throw new Error('Notion is not configured')
  }

  try {
    const { title, description, content, tags, category, coverImage, status, featured } = updateData

    // Prepare properties for update
    const properties: any = {}

    if (title !== undefined) {
      properties.title = {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      }

      // Update slug if title changed
      properties.slug = {
        rich_text: [
          {
            text: {
              content: slugify(title) + '-' + Date.now(),
            },
          },
        ],
      }
    }

    if (description !== undefined) {
      properties.description = {
        rich_text: [
          {
            text: {
              content: description,
            },
          },
        ],
      }
    }

    if (tags !== undefined) {
      properties.tags = {
        multi_select: tags.map(tag => ({ name: tag })),
      }
    }

    if (category !== undefined) {
      properties.category = category ? {
        select: {
          name: category,
        },
      } : { select: null }
    }

    if (status !== undefined) {
      properties.published = {
        checkbox: status === 'published',
      }
      properties.status = {
        select: {
          name: status === 'published' ? 'Published' : 'Draft',
        },
      }
    }

    if (featured !== undefined) {
      properties.featured = {
        checkbox: featured,
      }
    }

    // Update the page properties
    await getNotionClient().pages.update({
      page_id: notionId,
      properties,
      cover: coverImage ? {
        type: 'external',
        external: {
          url: coverImage,
        },
      } : undefined,
    })

    // Update content if provided
    if (content !== undefined) {
      await updateNotionPageContent(notionId, content)
    }

    // Clear cache to reflect updates
    postsCache = { data: null, timestamp: 0 }

    // Fetch and return updated page
    const updatedPage = await getNotionClient().pages.retrieve({ page_id: notionId })
    return await convertNotionPageToPost(updatedPage as any as NotionPage)
  } catch (error) {
    console.error('Error updating Notion article:', error)
    throw error
  }
}

// Delete an article from Notion database
export async function deleteNotionArticle(notionId: string): Promise<void> {
  if (!isNotionConfigured()) {
    throw new Error('Notion is not configured')
  }

  try {
    // Archive the page (Notion doesn't support true deletion via API)
    await getNotionClient().pages.update({
      page_id: notionId,
      archived: true,
    })

    // Clear cache to reflect deletion
    postsCache = { data: null, timestamp: 0 }
  } catch (error) {
    console.error('Error deleting Notion article:', error)
    throw error
  }
}

// Get user's articles from their personal Notion database (both drafts and published)
export async function getUserNotionArticles(authorEmail: string): Promise<NotionBlogPostMeta[]> {
  if (!isNotionConfigured()) {
    return []
  }

  try {
    // Get user's personal database ID
    const { getUserDatabaseId } = await import('./user-notion')
    const userDatabaseId = getUserDatabaseId(authorEmail)

    if (!userDatabaseId) {
      console.log(`No personal database found for user ${authorEmail}`)
      return []
    }

    const query: NotionDatabaseQuery = {
      sorts: [
        {
          property: 'publishDate',
          direction: 'descending',
        },
      ],
    }

    const response = await getNotionClient().databases.query({
      database_id: userDatabaseId,
      ...query,
    })

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        return await convertNotionPageToPostMeta(page as NotionPage)
      })
    )

    return posts.filter(Boolean) as NotionBlogPostMeta[]
  } catch (error) {
    console.error('Error fetching user Notion articles:', error)
    return []
  }
}

// Helper function to add content blocks to a Notion page
async function addContentToNotionPage(pageId: string, htmlContent: string): Promise<void> {
  try {
    // Convert HTML to simple text blocks for now
    // In the future, you could parse HTML and create proper Notion blocks
    const textContent = htmlContent.replace(/<[^>]*>/g, '') // Strip HTML tags

    const blocks = [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: textContent.slice(0, 2000), // Notion has text limits
              },
            },
          ],
        },
      },
    ]

    if (textContent.length > 2000) {
      // Add additional blocks for longer content
      let remainingContent = textContent.slice(2000)
      while (remainingContent.length > 0) {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: remainingContent.slice(0, 2000),
                },
              },
            ],
          },
        })
        remainingContent = remainingContent.slice(2000)
      }
    }

    await getNotionClient().blocks.children.append({
      block_id: pageId,
      children: blocks,
    })
  } catch (error) {
    console.error('Error adding content to Notion page:', error)
    // Don't throw here - the page was created successfully
  }
}

// Helper function to update content of a Notion page
async function updateNotionPageContent(pageId: string, htmlContent: string): Promise<void> {
  try {
    // First, get existing blocks
    const existingBlocks = await getNotionClient().blocks.children.list({
      block_id: pageId,
    })

    // Delete existing content blocks
    for (const block of existingBlocks.results) {
      try {
        await getNotionClient().blocks.delete({
          block_id: block.id,
        })
      } catch (deleteError) {
        console.warn('Could not delete block:', deleteError)
      }
    }

    // Add new content
    await addContentToNotionPage(pageId, htmlContent)
  } catch (error) {
    console.error('Error updating Notion page content:', error)
    // Don't throw here - the page properties were updated successfully
  }
}

// Get all published articles from all user databases (for main blog feed)
export async function getAllUserNotionPosts(): Promise<NotionBlogPostMeta[]> {
  if (!isNotionConfigured()) {
    return []
  }

  try {
    // Get all user databases
    const { getAllUserDatabases } = await import('./user-notion')
    const userDatabases = await getAllUserDatabases()

    if (userDatabases.length === 0) {
      return []
    }

    // Fetch published articles from each user's database
    const allPosts: NotionBlogPostMeta[] = []

    for (const userDb of userDatabases) {
      try {
        const query: NotionDatabaseQuery = {
          filter: {
            and: [
              {
                property: 'published',
                checkbox: { equals: true },
              },
              {
                property: 'status',
                select: { equals: 'Published' },
              },
            ],
          },
          sorts: [
            {
              property: 'publishDate',
              direction: 'descending',
            },
          ],
        }

        const response = await getNotionClient().databases.query({
          database_id: userDb.databaseId,
          ...query,
        })

        const posts = await Promise.all(
          response.results.map(async (page: any) => {
            return await convertNotionPageToPostMeta(page as NotionPage)
          })
        )

        const validPosts = posts.filter(Boolean) as NotionBlogPostMeta[]
        allPosts.push(...validPosts)
      } catch (dbError) {
        console.error(`Error fetching posts from database ${userDb.databaseId} for user ${userDb.email}:`, dbError)
        // Continue with other databases
      }
    }

    // Sort all posts by publish date
    return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error fetching all user Notion posts:', error)
    return []
  }
}

export { notionConfig }