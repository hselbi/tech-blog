import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllUserDatabases } from '@/lib/user-notion'

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

    // Enhance user data with additional info
    const enhancedUsers = await Promise.all(
      users.map(async (user) => {
        const database = userDatabases.find(db => db.email === user.email)

        // Get article count for user (you can enhance this later)
        let articlesCount = 0
        if (database?.databaseId) {
          try {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/articles?author=${user.email}`)
            if (response.ok) {
              const data = await response.json()
              articlesCount = data.articles?.length || 0
            }
          } catch (error) {
            console.error(`Failed to get articles count for ${user.email}:`, error)
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          provider: user.provider,
          avatar: user.avatar,
          notionDatabaseId: user.notionDatabaseId,
          createdAt: new Date().toISOString(), // You can enhance this with actual creation time
          lastLogin: new Date().toISOString(), // You can enhance this with actual last login
          articlesCount
        }
      })
    )

    return NextResponse.json({ users: enhancedUsers })
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}