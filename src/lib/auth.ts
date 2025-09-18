import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import bcrypt from 'bcryptjs'

// In-memory user storage for demo (replace with database in production)
const users: Array<{
  id: string
  email: string
  name: string
  password: string
  provider?: string
  avatar?: string
  bio?: string
  notionDatabaseId?: string
  notionToken?: string
  createdAt?: string
  lastLogin?: string
  loginCount?: number
}> = [
  // Default admin user for testing - remove in production
  {
    id: 'admin-123',
    email: 'test@admin.com',
    name: 'Test Admin',
    password: '$2b$12$Fvc9U41UIE/5JbnMwiCiLOo4pdZzmxBYCXyY.g9TGuaQ9YNUQYZqO', // password: admin123
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    loginCount: 1,
    notionDatabaseId: undefined,
    notionToken: undefined
  }
]

// Mock email notification function
async function sendLoginNotification(email: string, name: string, loginType: 'login' | 'register' | 'sso') {
  console.log('🔔 Login Notification:', {
    type: loginType,
    user: name,
    email: email,
    timestamp: new Date().toISOString(),
    message: `${name} (${email}) has ${loginType === 'register' ? 'registered' : 'logged in'} ${loginType === 'sso' ? 'via SSO' : 'with credentials'}`
  })

  // In production, send actual email to admin
  // Example: await sendEmail('admin@yourdomain.com', `User ${loginType}`, message)
}

// Articles are now stored in Notion database
// This in-memory storage has been removed in favor of Notion integration

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = users.find(u => u.email === credentials.email)
        if (!user) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          return null
        }

        // Update login tracking
        user.lastLogin = new Date().toISOString()
        user.loginCount = (user.loginCount || 0) + 1

        // Send login notification
        await sendLoginNotification(user.email, user.name, 'login')

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        // Auto-register SSO users
        const existingUser = users.find(u => u.email === user.email)
        if (!existingUser && user.email && user.name) {
          const newUser = {
            id: user.id || crypto.randomUUID(),
            email: user.email,
            name: user.name,
            password: '', // No password for SSO users
            provider: account.provider,
            avatar: user.image,
            notionDatabaseId: undefined,
            notionToken: undefined,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            loginCount: 1
          }
          users.push(newUser)

          // Send registration notification
          await sendLoginNotification(user.email, user.name, 'sso')

          // Create personal database for SSO user (async)
          setTimeout(async () => {
            try {
              const { ensureUserDatabase } = await import('./user-notion')
              await ensureUserDatabase(user.email!, user.name!)
              console.log(`Personal database creation initiated for SSO user ${user.email}`)
            } catch (error) {
              console.error(`Failed to create personal database for SSO user ${user.email}:`, error)
            }
          }, 100)
        } else if (existingUser) {
          // Update existing SSO user login tracking
          existingUser.lastLogin = new Date().toISOString()
          existingUser.loginCount = (existingUser.loginCount || 0) + 1

          // Send login notification for existing user
          await sendLoginNotification(existingUser.email, existingUser.name, 'sso')
        }
      }
      return true
    },
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  session: {
    strategy: 'jwt',
  },
}

// Helper function to register new users
export async function registerUser(email: string, password: string, name: string) {
  const existingUser = users.find(u => u.email === email)
  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = {
    id: crypto.randomUUID(),
    email,
    name,
    password: hashedPassword,
    notionDatabaseId: undefined,
    notionToken: undefined,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    loginCount: 1
  }

  users.push(user)

  // Send registration notification
  await sendLoginNotification(email, name, 'register')

  // Create personal database for the user (async, don't wait for it to complete registration)
  setTimeout(async () => {
    try {
      const { ensureUserDatabase } = await import('./user-notion')
      await ensureUserDatabase(email, name)
      console.log(`Personal database creation initiated for ${email}`)
    } catch (error) {
      console.error(`Failed to create personal database for ${email}:`, error)
    }
  }, 100)

  return { id: user.id, email: user.email, name: user.name }
}

// Export users for admin access
export { users }