'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Archive,
    Tag,
    Trash2,
    Filter,
    X,
    Plus,
    Search
} from 'lucide-react'

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

interface ProjectManagementProps {
  projects: Project[]
  onProjectsChange: (projects: Project[]) => void
}

export function ProjectManagement({ projects, onProjectsChange }: ProjectManagementProps) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const [newTag, setNewTag] = useState('')

  // Get unique tags from all projects, ensuring tags exist
  const allTags = Array.from(
    new Set(
      projects
        .filter(project => project.tags)
        .flatMap(project => project.tags.map(tag => tag.name))
    )
  )

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = (
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
    
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    
    const matchesTags = filterTags.length === 0 ||
      (project.tags && filterTags.every(tag => 
        project.tags.some(projectTag => projectTag.name === tag)
      ))

    return matchesSearch && matchesStatus && matchesTags
  })

  const handleBulkAction = async (action: string) => {
    try {
      const response = await fetch('/api/projects/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectIds: selectedProjects,
          action,
        }),
      })

      if (!response.ok) throw new Error('Bulk action failed')

      // Update local state based on the action
      let updatedProjects = [...projects]
      switch (action) {
        case 'archive':
          updatedProjects = projects.map(project =>
            selectedProjects.includes(project.id)
              ? { ...project, status: 'ARCHIVED' }
              : project
          )
          break
        case 'delete':
          updatedProjects = projects.filter(
            project => !selectedProjects.includes(project.id)
          )
          break
      }

      onProjectsChange(updatedProjects)
      setSelectedProjects([])
    } catch (error) {
      console.error('Error performing bulk action:', error)
    }
  }

  const handleAddTag = async () => {
    if (!newTag.trim() || selectedProjects.length === 0) return

    try {
      const response = await fetch('/api/projects/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectIds: selectedProjects,
          action: 'addTags',
          tags: [newTag.trim()],
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to add tag')
      }

      const updatedProjects = await response.json()
      if (!Array.isArray(updatedProjects)) {
        throw new Error('Invalid response from server')
      }

      // Merge the updated projects with the existing ones
      const mergedProjects = projects.map(project => {
        const updatedProject = updatedProjects.find(p => p.id === project.id)
        return updatedProject || project
      })

      onProjectsChange(mergedProjects)
      setNewTag('')
      setShowTagInput(false)
      setSelectedProjects([]) // Clear selection after successful tag addition
    } catch (error) {
      console.error('Error adding tag:', error)
      // You might want to show this error to the user through a toast notification
      throw error
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pr-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {/* Bulk Actions */}
      {selectedProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {selectedProjects.length} selected
          </span>
          <div className="flex items-center gap-x-2">
            <button
              onClick={() => handleBulkAction('archive')}
              className="flex items-center gap-x-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Archive className="h-4 w-4" />
              Archive
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="flex items-center gap-x-2 px-3 py-1 text-sm text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
            {showTagInput ? (
              <div className="flex items-center gap-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter tag name"
                  className="px-2 py-1 text-sm border rounded"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <button
                  onClick={handleAddTag}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowTagInput(false)}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowTagInput(true)}
                className="flex items-center gap-x-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Tag className="h-4 w-4" />
                Add Tag
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center gap-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border-gray-300 rounded-md"
          >
            <option value="all">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-gray-500" />
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setFilterTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
                )
              }}
              className={`px-2 py-1 text-xs rounded-full ${
                filterTags.includes(tag)
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Project List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            layout
            className="flex items-center gap-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <input
              type="checkbox"
              checked={selectedProjects.includes(project.id)}
              onChange={(e) => {
                setSelectedProjects((prev) =>
                  e.target.checked
                    ? [...prev, project.id]
                    : prev.filter((id) => id !== project.id)
                )
              }}
              className="h-4 w-4 text-indigo-600 rounded border-gray-300"
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {project.title}
              </h3>
              {project.description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {project.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {project.tags?.map((tag) => (
                  <span
                    key={tag.name}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                project.status === 'PUBLISHED'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : project.status === 'DRAFT'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {project.status.toLowerCase()}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 