import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - WriteFlow',
  description: 'Manage your content creation projects',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 