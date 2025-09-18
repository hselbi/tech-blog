import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { invalidateCache } from '@/lib/blog-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, path, tag } = body

    // Verify secret to prevent unauthorized revalidation
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Invalidate blog service cache
    invalidateCache()

    if (path) {
      // Revalidate specific path
      revalidatePath(path)
      return NextResponse.json({
        message: `Path ${path} revalidated`,
        timestamp: new Date().toISOString()
      })
    }

    if (tag) {
      // Revalidate by tag
      revalidateTag(tag)
      return NextResponse.json({
        message: `Tag ${tag} revalidated`,
        timestamp: new Date().toISOString()
      })
    }

    // Revalidate all blog-related paths
    const pathsToRevalidate = [
      '/',
      '/blog',
      '/tags',
    ]

    for (const path of pathsToRevalidate) {
      revalidatePath(path)
    }

    // Revalidate all blog tags
    revalidateTag('blog-posts')
    revalidateTag('blog-tags')
    revalidateTag('blog-categories')

    return NextResponse.json({
      message: 'Blog cache revalidated',
      paths: pathsToRevalidate,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    )
  }
}

// Allow GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: 'Revalidation endpoint active',
    timestamp: new Date().toISOString()
  })
}