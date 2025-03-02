'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    body: 'WriteFlow has completely transformed our content creation process. The AI suggestions are incredibly accurate and save us hours of work.',
    author: {
      name: 'Sarah Chen',
      handle: 'sarahchen',
      imageUrl: '/testimonials/sarahchen.svg',
      role: 'Content Manager at TechCorp',
    },
  },
  {
    body: 'As a freelance writer, WriteFlow has become my go-to tool for creating engaging content. The SEO optimization features are particularly impressive.',
    author: {
      name: 'Michael Rodriguez',
      handle: 'mrodriguez',
      imageUrl: '/testimonials/michaelrodriguez.svg',
      role: 'Freelance Content Writer',
    },
  },
  {
    body: 'The ability to generate and refine content in multiple formats has helped us maintain consistent messaging across all our channels.',
    author: {
      name: 'Emily Thompson',
      handle: 'ethompson',
      imageUrl: '/testimonials/emilythompson.svg',
      role: 'Marketing Director',
    },
  },
  {
    body: 'Outstanding tool for content creation! The AI understands context incredibly well and provides relevant suggestions every time.',
    author: {
      name: 'David Kim',
      handle: 'dkim',
      imageUrl: '/testimonials/davidkim.svg',
      role: 'Digital Marketing Consultant',
    },
  },
]

export function Testimonials() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-semibold leading-8 tracking-tight text-indigo-600 dark:text-indigo-400"
          >
            Testimonials
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Loved by content creators worldwide
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none"
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial, index) => (
              <motion.figure
                key={testimonial.author.handle}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700"
              >
                <blockquote className="text-gray-900 dark:text-white">
                  <div className="flex gap-1 text-indigo-600 dark:text-indigo-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-6">{testimonial.body}</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <img
                    className="h-10 w-10 rounded-full bg-gray-50"
                    src={testimonial.author.imageUrl}
                    alt=""
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author.name}</div>
                    <div className="text-gray-600 dark:text-gray-300">{testimonial.author.role}</div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 