import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { invalidateCache } from '@/lib/blog-service'
import { createNotionArticle, getUserNotionArticles, isNotionConfigured } from '@/lib/notion'

// Create a new article
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!isNotionConfigured()) {
      return NextResponse.json(
        { error: 'Notion is not configured. Please set up NOTION_TOKEN and NOTION_DATABASE_ID in your environment variables.' },
        { status: 503 }
      )
    }

    const {
      title,
      description,
      content,
      tags = [],
      category,
      coverImage,
      status = 'draft',
      featured = false
    } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Create article in Notion database
    const article = await createNotionArticle({
      title,
      description: description || '',
      content,
      tags,
      category,
      coverImage,
      status: status as 'draft' | 'published',
      featured,
      authorName: session.user.name || 'Unknown Author',
      authorEmail: session.user.email,
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Failed to create article in Notion' },
        { status: 500 }
      )
    }

    // Invalidate cache to include new article
    invalidateCache()

    return NextResponse.json(
      { message: 'Article created successfully in Notion database', article },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

// Get articles (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const authorEmail = searchParams.get('author')
    const session = await getServerSession(authOptions)

    if (!isNotionConfigured()) {
      return NextResponse.json(
        { error: 'Notion is not configured' },
        { status: 503 }
      )
    }

    // If requesting user's own articles, require authentication
    if (authorEmail) {
      if (!session?.user?.email || session.user.email !== authorEmail) {
        return NextResponse.json(
          { error: 'Unauthorized to view these articles' },
          { status: 401 }
        )
      }

      // Get user's articles from Notion (including drafts)
      const userArticles = await getUserNotionArticles(authorEmail)
      return NextResponse.json({ articles: userArticles })
    }

    // For public access, only published articles are available through the unified blog service
    return NextResponse.json({
      articles: [],
      message: 'Use the blog endpoints for public articles'
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}