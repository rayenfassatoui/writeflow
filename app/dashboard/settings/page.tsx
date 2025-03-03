'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Key, User, Shield, Save } from 'lucide-react'
import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout'
import { useAuth } from '@/app/hooks/useAuth'

interface UserSettings {
  name: string
  email: string
  apiKey: string | null
  image: string | null
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    apiKey: null,
    image: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (!response.ok) throw new Error('Failed to fetch settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
      setMessage({ type: 'error', text: 'Failed to load settings' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error('Failed to update settings')
      
      setMessage({ type: 'success', text: 'Settings updated successfully' })
    } catch (error) {
      console.error('Error updating settings:', error)
      setMessage({ type: 'error', text: 'Failed to update settings' })
    } finally {
      setIsSaving(false)
    }
  }

  const generateApiKey = async () => {
    try {
      const response = await fetch('/api/settings/api-key', {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to generate API key')
      
      const { apiKey } = await response.json()
      setSettings(prev => ({ ...prev, apiKey }))
      setMessage({ type: 'success', text: 'New API key generated' })
    } catch (error) {
      console.error('Error generating API key:', error)
      setMessage({ type: 'error', text: 'Failed to generate API key' })
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex items-center gap-x-3 mb-6">
            <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          </div>

          {message.text && (
            <div
              className={`p-4 mb-6 rounded-lg ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                  : 'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="space-y-4">
              <h2 className="flex items-center gap-x-2 text-lg font-medium text-gray-900 dark:text-white">
                <User className="h-5 w-5" />
                Profile Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={settings.name}
                    onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* API Key Section */}
            <div className="space-y-4">
              <h2 className="flex items-center gap-x-2 text-lg font-medium text-gray-900 dark:text-white">
                <Key className="h-5 w-5" />
                API Access
              </h2>
              <div className="flex items-center gap-x-4">
                <input
                  type="text"
                  value={settings.apiKey || ''}
                  readOnly
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white"
                  placeholder="No API key generated"
                />
                <button
                  onClick={generateApiKey}
                  className="flex items-center gap-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  <Shield className="h-4 w-4" />
                  Generate New Key
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Use this API key to access the WriteFlow API programmatically. Keep it secret!
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
} 