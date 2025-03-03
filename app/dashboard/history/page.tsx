'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { History, FileText, ChevronRight } from 'lucide-react'
import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout'
import Link from 'next/link'

interface Version {
  id: string
  content: string
  createdAt: string
  projectId: string
  project: {
    id: string
    title: string
  }
}

export default function HistoryPage() {
  const [versions, setVersions] = useState<Version[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchVersions()
  }, [])

  const fetchVersions = async () => {
    try {
      const response = await fetch('/api/history')
      if (!response.ok) throw new Error('Failed to fetch versions')
      const data = await response.json()
      setVersions(data)
    } catch (error) {
      console.error('Error fetching versions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex items-center gap-x-3 mb-6">
            <History className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Version History</h1>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading version history...</p>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No versions found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start editing your projects to create version history
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => (
                <motion.div
                  key={version.id}
                  layout
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <Link
                      href={`/dashboard/projects/${version.project.id}/edit`}
                      className="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {version.project.title}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(version.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {version.content}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/projects/${version.project.id}/edit`}
                    className="flex items-center gap-x-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                  >
                    View
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
} 