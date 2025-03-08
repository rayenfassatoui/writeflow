'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout'
import { ContentEditor } from '@/app/components/editor/ContentEditor'
import { VersionHistory } from '@/app/components/editor/VersionHistory'
import { ContentOptimizer } from '@/app/components/editor/ContentOptimizer'
import { WordPressPublisher } from '@/app/components/wordpress/WordPressPublisher'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Project {
  id: string
  title: string
  content: string | null
  description: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  type: 'BLOG_POST' | 'SOCIAL_MEDIA' | 'AD_COPY' | 'EMAIL' | 'WEBSITE_COPY' | 'CUSTOM'
}

export default function EditProject() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSaving, setIsSaving] = useState(false)

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch project')
      const data = await response.json()
      setProject(data)
    } catch (error) {
      console.error('Error fetching project:', error)
    }
  }, [params.id])

  useEffect(() => {
    if (params.id) {
      fetchProject()
    }
  }, [params.id, fetchProject])

  const handleSave = async (newContent: string) => {
    if (!project) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newContent,
        }),
      })

      if (!response.ok) throw new Error('Failed to save project')
      
      toast.success('Project saved successfully')
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Failed to save project')
    } finally {
      setIsSaving(false)
    }
  }
  const handleRestore = (restoredContent: string) => {
    if (project) {
      setProject({ ...project, content: restoredContent })
    }
  }

  const handleOptimize = (optimizedContent: string) => {
    if (project) {
      setProject({ ...project, content: optimizedContent })
    }
  }

  const handleWordPressSuccess = () => {
    toast.success('Successfully published to WordPress!')
  }

  const handleWordPressError = (error: string) => {
    toast.error(error)
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    )
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
            <div className="flex items-center gap-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
            </div>
            
            <div className="flex items-center gap-x-4">
              <VersionHistory
                projectId={project.id}
                onRestore={handleRestore}
              />
              <ContentOptimizer
                content={project.content || ''}
                onOptimize={handleOptimize}
              />
              <WordPressPublisher
                title={project.title}
                content={project.content || ''}
                onSuccess={handleWordPressSuccess}
                onError={handleWordPressError}
              />
            </div>
          </div>

          <ContentEditor
            initialContent={project.content || ''}
            onSave={handleSave}
          />
        </motion.div>
      </div>
    </DashboardLayout>
  )
}