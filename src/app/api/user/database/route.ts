import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserDatabaseId, ensureUserDatabase } from '@/lib/user-notion'

// GET - Get user's database information
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const databaseId = getUserDatabaseId(session.user.email)

    return NextResponse.json({ databaseId })
  } catch (error) {
    console.error('Error fetching user database:', error)
    return NextResponse.json(
      { error: 'Failed to fetch database information' },
      { status: 500 }
    )
  }
}

// POST - Create or ensure user has a database
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email, name } = body

    // Verify the email matches the session
    if (email !== session.user.email) {
      return NextResponse.json(
        { error: 'Email mismatch' },
        { status: 400 }
      )
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const databaseId = await ensureUserDatabase(email, name)

    if (!databaseId) {
      return NextResponse.json(
        { error: 'Failed to create database' },
        { status: 500 }
      )
    }

    return NextResponse.json({ databaseId })
  } catch (error) {
    console.error('Error creating user database:', error)
    return NextResponse.json(
      { error: 'Failed to create database' },
      { status: 500 }
    )
  }
}