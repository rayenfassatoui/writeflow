'use client'

import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout'
import { motion } from 'framer-motion'
import {
  BarChart3,
  FileText,
  Sparkles,
  Clock,
  ArrowRight,
  Pencil,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    name: 'Total Projects',
    value: '12',
    icon: FileText,
    change: '+2 from last month',
  },
  {
    name: 'Words Generated',
    value: '24,500',
    icon: Sparkles,
    change: '+12% from last month',
  },
  {
    name: 'Active Projects',
    value: '3',
    icon: Clock,
    change: 'Same as last month',
  },
]

const recentProjects = [
  {
    id: '1',
    title: 'Marketing Blog Post',
    excerpt: 'How to Improve Your Content Marketing Strategy in 2024',
    status: 'In Progress',
    lastEdited: '3 hours ago',
  },
  {
    id: '2',
    title: 'Social Media Campaign',
    excerpt: 'Summer Sale Promotional Content for Instagram and Facebook',
    status: 'Draft',
    lastEdited: '1 day ago',
  },
  {
    id: '3',
    title: 'Product Description',
    excerpt: 'New Smart Home Device Product Description and Features',
    status: 'Completed',
    lastEdited: '2 days ago',
  },
]

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome section */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Welcome back, User!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-sm text-gray-600 dark:text-gray-300"
          >
            Here's what's happening with your projects today.
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{stat.change}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Projects</h2>
              <Link
                href="/dashboard/projects"
                className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                {recentProjects.map((project) => (
                  <motion.li
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {project.title}
                          </p>
                          <p className="ml-2 flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                            {project.lastEdited}
                          </p>
                        </div>
                        <p className="mt-1 truncate text-sm text-gray-600 dark:text-gray-300">
                          {project.excerpt}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Status: {project.status}
                        </p>
                      </div>
                      <div className="ml-6 flex flex-shrink-0 gap-2">
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Usage Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Usage Statistics</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-6 h-48 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Chart coming soon</span>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
} 