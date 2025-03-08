'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, ChevronRight, RotateCcw } from 'lucide-react'

interface Version {
  id: string
  content: string
  createdAt: string
}

interface VersionHistoryProps {
  projectId: string
  onRestore: (content: string) => void
}

export function VersionHistory({ projectId, onRestore }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Move fetchVersions inside useEffect to avoid dependency issues
      const fetchVersions = async () => {
        try {
          const response = await fetch(`/api/projects/${projectId}/versions`)
          if (!response.ok) throw new Error('Failed to fetch versions')
          const data = await response.json()
          setVersions(data)
        } catch (error) {
          console.error('Error fetching versions:', error)
        }
      }
      
      fetchVersions()
    }
  }, [isOpen, projectId])

  const handleRestore = (version: Version) => {
    onRestore(version.content)
    setSelectedVersion(null)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      >
        <History className="h-4 w-4" />
        Version History
        <ChevronRight
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 z-10 mt-2 w-96 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700"
          >
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Version History</h3>
              <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedVersion(version)}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(version.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {version.content.slice(0, 100)}...
                      </p>
                    </div>
                    {selectedVersion?.id === version.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRestore(version)
                        }}
                        className="flex items-center gap-x-1 px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}