'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout'
import { ProjectManagement } from '@/app/components/projects/ProjectManagement'

interface Project {
  id: string
  title: string
  description: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  type: string
  tags: { name: string }[]
  createdAt: string
  updatedAt: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Failed to fetch projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-x-3">
              <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
            </div>
            <Link
              href="/dashboard/projects/new"
              className="flex items-center gap-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create your first project to get started
              </p>
            </div>
          ) : (
            <ProjectManagement
              projects={projects}
              onProjectsChange={setProjects}
            />
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
} 