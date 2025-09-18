"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit, Trash2, Eye, Plus, FileText, Database, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

interface Article {
  notionId: string
  slug: string
  title: string
  description: string
  published: boolean
  featured: boolean
  date: string
  lastEditedTime: string
  tags: string[]
  category?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [databaseId, setDatabaseId] = useState<string | null>(null)
  const [databaseLoading, setDatabaseLoading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  // Fetch user's articles and database info
  useEffect(() => {
    if (session?.user?.email) {
      fetchArticles()
      fetchDatabaseInfo()
    }
  }, [session])

  const fetchArticles = async () => {
    try {
      const response = await fetch(`/api/articles?author=${session?.user?.email}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch articles')
      }

      setArticles(data.articles)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch articles')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (notionId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return
    }

    try {
      const response = await fetch(`/api/articles/${notionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete article')
      }

      // Remove from local state
      setArticles(prev => prev.filter(article => article.notionId !== notionId))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete article')
    }
  }

  const fetchDatabaseInfo = async () => {
    try {
      const response = await fetch('/api/user/database')
      const data = await response.json()

      if (response.ok && data.databaseId) {
        setDatabaseId(data.databaseId)
      }
    } catch (error) {
      console.error('Failed to fetch database info:', error)
    }
  }

  const createUserDatabase = async () => {
    if (!session?.user?.email || !session?.user?.name) return

    setDatabaseLoading(true)
    try {
      const response = await fetch('/api/user/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
        }),
      })

      const data = await response.json()

      if (response.ok && data.databaseId) {
        setDatabaseId(data.databaseId)
      } else {
        throw new Error(data.error || 'Failed to create database')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create database')
    } finally {
      setDatabaseLoading(false)
    }
  }

  const toggleStatus = async (notionId: string, currentPublished: boolean) => {
    const newStatus = currentPublished ? 'draft' : 'published'

    try {
      const response = await fetch(`/api/articles/${notionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update article')
      }

      // Update local state
      setArticles(prev =>
        prev.map(article =>
          article.notionId === notionId ? { ...article, published: !currentPublished } : article
        )
      )
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update article')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your articles and content
          </p>
        </div>

        <Link
          href="/write"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Articles
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {articles.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Published
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {articles.filter(a => a.published).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Edit className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Drafts
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {articles.filter(a => !a.published).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Database Management */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Personal Notion Database
          </h2>
        </div>
        <div className="p-6">
          {databaseId ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Your personal Notion database is active and ready to use.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                  Database ID: {databaseId}
                </p>
              </div>
              <a
                href={`https://notion.so/${databaseId.replace(/-/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View in Notion
              </a>
            </div>
          ) : (
            <div className="text-center py-6">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Personal Database
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Create your personal Notion database to start managing your articles.
              </p>
              <button
                onClick={createUserDatabase}
                disabled={databaseLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {databaseLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Database...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Database
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Articles</h2>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No articles yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by creating your first article
            </p>
            <Link
              href="/write"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Article
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {articles.map((article) => (
              <div key={article.notionId} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {article.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.published
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}
                      >
                        {article.published ? 'published' : 'draft'}
                      </span>
                      {article.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      {article.description || 'No description'}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                      <span>Created: {format(new Date(article.date), 'MMM d, yyyy')}</span>
                      {article.lastEditedTime !== article.date && (
                        <span>Updated: {format(new Date(article.lastEditedTime), 'MMM d, yyyy')}</span>
                      )}
                      {article.tags.length > 0 && (
                        <span>Tags: {article.tags.join(', ')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {article.published && (
                      <Link
                        href={`/blog/${article.slug}`}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="View Article"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    )}

                    <Link
                      href={`/write/${article.notionId}`}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Edit Article"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => toggleStatus(article.notionId, article.published)}
                      className="px-3 py-1 text-xs font-medium rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {article.published ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      onClick={() => handleDelete(article.notionId)}
                      className="p-2 text-red-400 hover:text-red-600"
                      title="Delete Article"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}