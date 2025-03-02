'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout'
import { motion } from 'framer-motion'
import { Sparkles, Send, RefreshCcw } from 'lucide-react'

type ContentType = 'BLOG_POST' | 'SOCIAL_MEDIA' | 'AD_COPY' | 'EMAIL' | 'WEBSITE_COPY' | 'CUSTOM'

interface GenerationParams {
  contentType: ContentType
  topic: string
  tone: 'professional' | 'casual' | 'friendly' | 'formal'
  length: 'short' | 'medium' | 'long'
  keywords: string[]
  additionalInstructions?: string
}

export default function Generate() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [params, setParams] = useState<GenerationParams>({
    contentType: 'BLOG_POST',
    topic: '',
    tone: 'professional',
    length: 'medium',
    keywords: [],
    additionalInstructions: '',
  })
  const [result, setResult] = useState<string>('')

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
      
      if (!response.ok) {
        throw new Error('Generation failed')
      }

      const data = await response.json()
      setResult(data.content)
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeywordsChange = (value: string) => {
    setParams(prev => ({
      ...prev,
      keywords: value.split(',').map(k => k.trim()).filter(k => k !== '')
    }))
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
            <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Content Generator</h1>
          </div>

          <div className="space-y-6">
            {/* Content Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content Type
              </label>
              <select
                value={params.contentType}
                onChange={(e) => setParams(prev => ({ ...prev, contentType: e.target.value as ContentType }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
              >
                <option value="BLOG_POST">Blog Post</option>
                <option value="SOCIAL_MEDIA">Social Media Post</option>
                <option value="AD_COPY">Advertisement Copy</option>
                <option value="EMAIL">Email</option>
                <option value="WEBSITE_COPY">Website Copy</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic or Title
              </label>
              <input
                type="text"
                value={params.topic}
                onChange={(e) => setParams(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                placeholder="Enter your topic or title"
              />
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tone
              </label>
              <select
                value={params.tone}
                onChange={(e) => setParams(prev => ({ ...prev, tone: e.target.value as any }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
              </select>
            </div>

            {/* Length Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content Length
              </label>
              <select
                value={params.length}
                onChange={(e) => setParams(prev => ({ ...prev, length: e.target.value as any }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>

            {/* Keywords Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={params.keywords.join(', ')}
                onChange={(e) => handleKeywordsChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                placeholder="Enter keywords separated by commas"
              />
            </div>

            {/* Additional Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Instructions (optional)
              </label>
              <textarea
                value={params.additionalInstructions}
                onChange={(e) => setParams(prev => ({ ...prev, additionalInstructions: e.target.value }))}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                placeholder="Any specific requirements or instructions"
              />
            </div>

            {/* Generate Button */}
            <div className="flex justify-end gap-x-4">
              {result && (
                <button
                  onClick={() => setResult('')}
                  className="flex items-center gap-x-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Clear
                </button>
              )}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !params.topic}
                className="flex items-center gap-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Result Display */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generated Content</h2>
            <div className="prose dark:prose-invert max-w-none">
              {result.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 dark:text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
} 