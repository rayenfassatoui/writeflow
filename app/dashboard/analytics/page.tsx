'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout'
import { motion } from 'framer-motion'
import {
    BarChart,
    LineChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { ActivityType } from '@prisma/client'
import { Eye, Share2, Heart, Activity } from 'lucide-react'

interface AnalyticsData {
  activityCounts: Record<ActivityType, number>
  totalViews: number
  totalShares: number
  totalReactions: number
  recentActivities: Array<{
    id: string
    type: ActivityType
    createdAt: string
    metadata: Record<string, unknown>
  }>
  projectMetrics: Array<{
    id: string
    title: string
    metrics: {
      views: number
      shares: number
      reactions: number
    }
  }>
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics')
        if (!response.ok) {
          throw new Error('Failed to fetch analytics')
        }
        const data = await response.json()
        setAnalytics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (isLoading) {
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

  if (!analytics) return null

  const activityData = Object.entries(analytics.activityCounts).map(([type, count]) => ({
    type,
    count,
  }))

  const metricsData = analytics.projectMetrics.map((project) => ({
    name: project.title,
    views: project.metrics.views,
    shares: project.metrics.shares,
    reactions: project.metrics.reactions,
  }))

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Overview Cards */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Eye className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="ml-2 text-lg font-medium">Total Views</h3>
            </div>
            <p className="mt-2 text-3xl font-bold">{analytics.totalViews}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Share2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="ml-2 text-lg font-medium">Total Shares</h3>
            </div>
            <p className="mt-2 text-3xl font-bold">{analytics.totalShares}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="ml-2 text-lg font-medium">Total Reactions</h3>
            </div>
            <p className="mt-2 text-3xl font-bold">{analytics.totalReactions}</p>
          </div>
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-medium mb-4">Activity Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Project Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-medium mb-4">Project Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#6366f1" />
                <Line type="monotone" dataKey="shares" stroke="#10b981" />
                <Line type="monotone" dataKey="reactions" stroke="#f43f5e" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {analytics.recentActivities.map((activity, idx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {idx !== analytics.recentActivities.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-indigo-600 dark:bg-indigo-400 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {activity.type.replace(/_/g, ' ')}
                          </p>
                          {activity.metadata && (
                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                              {JSON.stringify(activity.metadata)}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}