'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Link from 'next/link'

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    href: '/register?plan=starter',
    priceMonthly: '$15',
    description: 'Perfect for individuals and small content creators.',
    features: [
      '5,000 words per month',
      'Basic AI writing assistance',
      'Grammar & style checking',
      'Export to common formats',
      '2 user seats',
      'Email support',
    ],
    featured: false,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    href: '/register?plan=professional',
    priceMonthly: '$39',
    description: 'Ideal for professional content creators and small teams.',
    features: [
      '25,000 words per month',
      'Advanced AI writing features',
      'SEO optimization tools',
      'Content performance analytics',
      '5 user seats',
      'Priority email & chat support',
      'API access',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/register?plan=enterprise',
    priceMonthly: '$99',
    description: 'For organizations with advanced content needs.',
    features: [
      'Unlimited words',
      'Custom AI model training',
      'Advanced analytics & reporting',
      'Custom integrations',
      'Unlimited user seats',
      '24/7 priority support',
      'Dedicated account manager',
    ],
    featured: false,
  },
]

export function Pricing() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400"
          >
            Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
          >
            Choose the right plan for&nbsp;you
          </motion.p>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-gray-300"
        >
          Start with our free trial. No credit card required. Cancel anytime.
        </motion.p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              key={tier.id}
              className={`${
                tier.featured
                  ? 'z-10 ring-2 ring-indigo-600'
                  : 'ring-1 ring-gray-200 dark:ring-gray-700'
              } relative rounded-3xl p-8 xl:p-10`}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  className={`text-lg font-semibold leading-8 ${
                    tier.featured ? 'text-indigo-600' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {tier.name}
                </h3>
                {tier.featured && (
                  <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600 dark:text-indigo-400">
                    Most popular
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {tier.priceMonthly}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">/month</span>
              </p>
              <Link
                href={tier.href}
                className={`${
                  tier.featured
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 dark:ring-indigo-700 dark:hover:ring-indigo-600'
                } mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              >
                Get started
              </Link>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 