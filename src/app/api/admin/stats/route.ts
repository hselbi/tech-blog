import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllUserDatabases } from '@/lib/user-notion'
import { getAllUnifiedPosts } from '@/lib/blog-service'

// Simple admin check - in production, you'd want proper role-based access
function isAdmin(email: string): boolean {
  return email === 'admin@example.com' || email.includes('admin')
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get users from auth module
    const { users } = await import('@/lib/auth')

    // Get user databases info
    const userDatabases = await getAllUserDatabases()

    // Get all posts
    const allPosts = await getAllUnifiedPosts()

    // Calculate stats
    const stats = {
      totalUsers: users.length,
      totalDatabases: userDatabases.length,
      totalArticles: allPosts.length,
      recentLogins: users.length // Simplified - you can enhance with actual recent login logic
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}