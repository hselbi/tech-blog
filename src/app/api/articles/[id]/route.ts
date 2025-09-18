import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { invalidateCache } from '@/lib/blog-service'
import {
  getNotionPostBySlug,
  updateNotionArticle,
  deleteNotionArticle,
  isNotionConfigured,
  getUserNotionArticles
} from '@/lib/notion'

// Get single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const session = await getServerSession(authOptions)

    if (!isNotionConfigured()) {
      return NextResponse.json(
        { error: 'Notion is not configured' },
        { status: 503 }
      )
    }

    // First try to find by Notion ID for user's articles
    if (session?.user?.email) {
      const userArticles = await getUserNotionArticles(session.user.email)
      const userArticle = userArticles.find(a => a.notionId === resolvedParams.id)

      if (userArticle) {
        // User can access their own articles (including drafts)
        const fullArticle = await getNotionPostBySlug(userArticle.slug)
        if (fullArticle) {
          return NextResponse.json({ article: fullArticle })
        }
      }
    }

    // Try to find by slug in published articles
    const article = await getNotionPostBySlug(resolvedParams.id)

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // Check if user can access draft articles
    if (!article.published && (!session?.user?.email || !article.author.name.includes(session.user.email))) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

// Update article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
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
        { error: 'Notion is not configured' },
        { status: 503 }
      )
    }

    // Find the article in user's articles
    const userArticles = await getUserNotionArticles(session.user.email)
    const article = userArticles.find(a => a.notionId === resolvedParams.id)

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    const updates = await request.json()

    // Update the article in Notion
    const updatedArticle = await updateNotionArticle(resolvedParams.id, updates)

    if (!updatedArticle) {
      return NextResponse.json(
        { error: 'Failed to update article in Notion' },
        { status: 500 }
      )
    }

    // Invalidate cache to reflect changes
    invalidateCache()

    return NextResponse.json(
      { message: 'Article updated successfully in Notion', article: updatedArticle },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

// Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
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
        { error: 'Notion is not configured' },
        { status: 503 }
      )
    }

    // Find the article in user's articles
    const userArticles = await getUserNotionArticles(session.user.email)
    const article = userArticles.find(a => a.notionId === resolvedParams.id)

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // Delete the article from Notion (archives it)
    await deleteNotionArticle(resolvedParams.id)

    // Invalidate cache to reflect deletion
    invalidateCache()

    return NextResponse.json(
      { message: 'Article deleted successfully from Notion' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}