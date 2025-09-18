import { Client } from '@notionhq/client'
import { notionConfig } from './notion'

// Initialize Notion client for admin operations
function getAdminNotionClient(): Client {
  return new Client({
    auth: notionConfig.token,
  })
}

// Function to create a personal database for a user
export async function createUserDatabase(userEmail: string, userName: string): Promise<string | null> {
  if (!notionConfig.token) {
    throw new Error('Admin Notion token is required to create user databases')
  }

  try {
    const adminClient = getAdminNotionClient()

    // Get the template database to copy its structure
    const templateDatabase = await adminClient.databases.retrieve({
      database_id: notionConfig.databaseId,
    })

    // Create a new database with the same properties as the template
    const response = await adminClient.databases.create({
      parent: {
        type: 'page_id',
        page_id: process.env.NOTION_PARENT_PAGE_ID || notionConfig.databaseId, // Parent page where databases are created
      },
      title: [
        {
          type: 'text',
          text: {
            content: `${userName}'s Blog Database`,
          },
        },
      ],
      properties: (templateDatabase as any).properties,
    })

    console.log(`Created personal database for ${userEmail}: ${response.id}`)
    return response.id
  } catch (error) {
    console.error('Error creating user database:', error)
    return null
  }
}

// Function to get user's database ID from user storage
export function getUserDatabaseId(userEmail: string): string | null {
  // In a real app, this would query your user database
  // For now, we'll use the in-memory storage
  const { users } = require('./auth')
  const user = users.find((u: any) => u.email === userEmail)
  return user?.notionDatabaseId || null
}

// Function to set user's database ID
export function setUserDatabaseId(userEmail: string, databaseId: string): void {
  // In a real app, this would update your user database
  // For now, we'll update the in-memory storage
  const { users } = require('./auth')
  const userIndex = users.findIndex((u: any) => u.email === userEmail)
  if (userIndex !== -1) {
    users[userIndex].notionDatabaseId = databaseId
  }
}

// Function to ensure user has a personal database
export async function ensureUserDatabase(userEmail: string, userName: string): Promise<string | null> {
  let databaseId = getUserDatabaseId(userEmail)

  if (!databaseId) {
    // Create a new database for the user
    databaseId = await createUserDatabase(userEmail, userName)

    if (databaseId) {
      setUserDatabaseId(userEmail, databaseId)
    }
  }

  return databaseId
}

// Function to get all user databases for aggregating content
export async function getAllUserDatabases(): Promise<Array<{ email: string, databaseId: string, userName: string }>> {
  // In a real app, this would query your user database
  // For now, we'll use the in-memory storage
  const { users } = require('./auth')

  return users
    .filter((user: any) => user.notionDatabaseId)
    .map((user: any) => ({
      email: user.email,
      databaseId: user.notionDatabaseId,
      userName: user.name,
    }))
}

export interface UserNotionConfig {
  email: string
  databaseId: string
  userName: string
}