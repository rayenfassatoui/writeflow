'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout'
import { ContentEditor } from '@/app/components/editor/ContentEditor'
import { VersionHistory } from '@/app/components/editor/VersionHistory'
import { ContentOptimizer } from '@/app/components/editor/ContentOptimizer'
import { motion } from 'framer-motion'
import { Save, ArrowLeft } from 'lucide-react'

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
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch project')
        const data = await response.json()
        setProject(data)
        setTitle(data.title)
        setContent(data.content || '')
      } catch (error) {
        console.error('Error fetching project:', error)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  const handleSave = async (newContent: string) => {
    if (!project) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: newContent,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save project')
      }

      setContent(newContent)

      // Create a new version
      await fetch(`/api/projects/${project.id}/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newContent }),
      })
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleRestore = (restoredContent: string) => {
    setContent(restoredContent)
    handleSave(restoredContent)
  }

  const handleOptimize = (optimizedContent: string) => {
    setContent(optimizedContent)
    handleSave(optimizedContent)
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-white"
              placeholder="Project Title"
            />
          </div>
          <div className="flex items-center gap-x-4">
            <ContentOptimizer content={content} onOptimize={handleOptimize} />
            <VersionHistory projectId={params.id as string} onRestore={handleRestore} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {project?.status.toLowerCase()}
            </span>
            <button
              onClick={() => handleSave(content)}
              disabled={isSaving}
              className="flex items-center gap-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ContentEditor
            initialContent={content}
            onSave={handleSave}
            placeholder="Start writing your content..."
          />
        </motion.div>
      </div>
    </DashboardLayout>
  )
} 