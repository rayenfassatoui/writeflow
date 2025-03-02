'use client'

import { motion } from 'framer-motion'
import { Brain, Edit, History, Sparkles, Target, Zap } from 'lucide-react'

const features = [
  {
    name: 'AI-Powered Writing',
    description:
      'Leverage advanced AI to generate high-quality content drafts, outlines, and creative ideas instantly.',
    icon: Brain,
  },
  {
    name: 'Smart Editor',
    description:
      'Professional editing tools with real-time suggestions for grammar, style, and tone improvements.',
    icon: Edit,
  },
  {
    name: 'Content Optimization',
    description:
      'Optimize your content for SEO, readability, and engagement with AI-powered recommendations.',
    icon: Target,
  },
  {
    name: 'Version History',
    description:
      'Keep track of all your content versions and revisions with our comprehensive history system.',
    icon: History,
  },
  {
    name: 'Quick Generation',
    description:
      'Generate content in seconds for blog posts, social media, ads, and more with customizable templates.',
    icon: Zap,
  },
  {
    name: 'Multi-Format Support',
    description:
      'Create content for various platforms and formats, all optimized for their specific requirements.',
    icon: Sparkles,
  },
]

export function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Everything you need to create amazing content
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300"
          >
            Our platform combines powerful AI capabilities with intuitive tools to help you create,
            optimize, and manage your content efficiently.
          </motion.p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <feature.icon
                    className="h-5 w-5 flex-none text-indigo-600 dark:text-indigo-400"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
} 