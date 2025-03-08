'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChartBar, Target, Book, MessageSquare, X, Sparkles } from 'lucide-react'

interface ContentOptimizerProps {
  content: string
  onOptimize: (optimizedContent: string) => void
}

interface OptimizationMetrics {
  seoScore: number
  readabilityScore: number
  keywordDensity: {
    [keyword: string]: number
  }
  suggestions: string[]
}

export function ContentOptimizer({ content, onOptimize }: ContentOptimizerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [targetKeywords, setTargetKeywords] = useState<string[]>([])
  const [contentType, setContentType] = useState<'blog' | 'social' | 'ad'>('blog')
  const [tone, setTone] = useState<'professional' | 'casual' | 'friendly'>('professional')
  const [metrics, setMetrics] = useState<OptimizationMetrics | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleOptimize = async () => {
    setIsOptimizing(true)
    setError(null)

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          targetKeywords,
          contentType,
          tone,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      const result = await response.json()
      setMetrics({
        seoScore: result.seoScore,
        readabilityScore: result.readabilityScore,
        keywordDensity: result.keywordDensity,
        suggestions: result.suggestions,
      })
      onOptimize(result.optimizedContent)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to optimize content')
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleKeywordsChange = (value: string) => {
    setTargetKeywords(value.split(',').map(k => k.trim()).filter(k => k !== ''))
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      >
        <Target className="h-4 w-4" />
        Optimize Content
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Content Optimization</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Keywords
                  </label>
                  <input
                    type="text"
                    value={targetKeywords.join(', ')}
                    onChange={(e) => handleKeywordsChange(e.target.value)}
                    placeholder="Enter keywords separated by commas"
                    className="w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content Type
                  </label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as 'blog' | 'social' | 'ad')}
                    className="w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  >
                    <option value="blog">Blog Post</option>
                    <option value="social">Social Media</option>
                    <option value="ad">Advertisement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as 'professional' | 'casual' | 'friendly')}
                    className="w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                  </select>
                </div>

                <button
                  onClick={handleOptimize}
                  disabled={isOptimizing || targetKeywords.length === 0}
                  className="w-full flex items-center justify-center gap-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isOptimizing ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Optimize
                    </>
                  )}
                </button>
              </div>

              {metrics && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center gap-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <ChartBar className="h-4 w-4" />
                        SEO Score
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        {metrics.seoScore}%
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center gap-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Book className="h-4 w-4" />
                        Readability
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        {metrics.readabilityScore}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <MessageSquare className="h-4 w-4" />
                      Suggestions
                    </h4>
                    <ul className="mt-2 space-y-1">
                      {metrics.suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 dark:text-gray-400"
                        >
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Target className="h-4 w-4" />
                      Keyword Density
                    </h4>
                    <div className="mt-2 space-y-1">
                      {Object.entries(metrics.keywordDensity).map(([keyword, density]) => (
                        <div
                          key={keyword}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-600 dark:text-gray-400">{keyword}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {density}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}