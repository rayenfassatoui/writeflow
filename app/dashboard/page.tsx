'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout'
import { motion } from 'framer-motion'
import {
    BarChart3,
    FileText,
    Sparkles,
    Clock,
    ArrowRight,
    Pencil
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'

interface DashboardData {
  user: {
    name: string
    email: string
    credits: number
  }
  stats: {
    name: string
    value: string
    change: string
  }[]
  recentProjects: {
    id: string
    title: string
    excerpt: string
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    lastEdited: string
  }[]
}

const iconMap = {
  'Total Projects': FileText,
  'Words Generated': Sparkles,
  'Active Projects': Clock,
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchDashboardData()
    }
  }, [isAuthenticated, authLoading, router])

  if (isLoading || authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Try again
          </button>
        </div>
      </DashboardLayout>
    )
  }

  if (!dashboardData) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome section */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Welcome back, {dashboardData.user.name || 'User'}!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-sm text-gray-600 dark:text-gray-300"
          >
            You have {dashboardData.user.credits} credits remaining.
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {dashboardData.stats.map((stat, index) => {
            const Icon = iconMap[stat.name as keyof typeof iconMap]
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {Icon && <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {stat.name}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{stat.change}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Projects</h2>
              <Link
                href="/dashboard/projects"
                className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flow-root">
              {dashboardData.recentProjects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No projects yet</p>
                  <Link
                    href="/dashboard/projects/new"
                    className="mt-4 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                  >
                    Create your first project
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <ul role="list" className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                  {dashboardData.recentProjects.map((project) => (
                    <motion.li
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="truncate text-sm font-medium text-indigo-600 dark:text-indigo-400">
                              {project.title}
                            </p>
                            <p className="ml-2 flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(project.lastEdited).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="mt-1 truncate text-sm text-gray-600 dark:text-gray-300">
                            {project.excerpt}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Status: {project.status.toLowerCase()}
                          </p>
                        </div>
                        <div className="ml-6 flex flex-shrink-0 gap-2">
                          <Link
                            href={`/dashboard/projects/${project.id}/edit`}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <Pencil className="h-5 w-5" />
                          </Link>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>

        {/* Usage Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Usage Statistics</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-6 h-48 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Chart coming soon</span>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
} 