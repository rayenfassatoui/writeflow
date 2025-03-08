'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'

interface WordPressPublisherProps {
  title: string
  content: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function WordPressPublisher({ title, content, onSuccess, onError }: WordPressPublisherProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [status, setStatus] = useState<'draft' | 'publish'>('draft')

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const response = await fetch('/api/wordpress/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          status,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to publish to WordPress')
      }

      await response.json()
      onSuccess?.()
    } catch (error) {
      console.error('Error publishing to WordPress:', error)
      onError?.(error instanceof Error ? error.message : 'Failed to publish to WordPress')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as 'draft' | 'publish')}
        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-white"
        disabled={isPublishing}
      >
        <option value="draft">Save as Draft</option>
        <option value="publish">Publish Immediately</option>
      </select>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePublish}
        disabled={isPublishing}
        className="flex items-center gap-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPublishing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Publishing...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Publish to WordPress
          </>
        )}
      </motion.button>
    </div>
  )
}