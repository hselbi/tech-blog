import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog'
import { BlogSearch } from '@/lib/search'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    const posts = getAllPosts()
    const search = new BlogSearch(posts)
    const results = search.search(query, limit)

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}