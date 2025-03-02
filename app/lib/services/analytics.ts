import { prisma } from '@/lib/prisma'
import { ActivityType } from '@prisma/client'

export class AnalyticsService {
  static async trackActivity(userId: string, type: ActivityType, metadata?: any) {
    return await prisma.userActivity.create({
      data: {
        userId,
        type,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    })
  }

  static async updateContentMetrics(projectId: string, updates: {
    views?: number
    shares?: number
    reactions?: number
  }) {
    return await prisma.contentMetrics.upsert({
      where: { projectId },
      create: {
        projectId,
        ...updates,
      },
      update: updates,
    })
  }

  static async getProjectMetrics(projectId: string) {
    return await prisma.contentMetrics.findUnique({
      where: { projectId },
    })
  }

  static async getUserAnalytics(userId: string) {
    const [activities, projects] = await Promise.all([
      prisma.userActivity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.project.findMany({
        where: { userId },
        include: { metrics: true },
      }),
    ])

    const activityCounts = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1
      return acc
    }, {} as Record<ActivityType, number>)

    const totalViews = projects.reduce((sum, project) => sum + (project.metrics?.views || 0), 0)
    const totalShares = projects.reduce((sum, project) => sum + (project.metrics?.shares || 0), 0)
    const totalReactions = projects.reduce((sum, project) => sum + (project.metrics?.reactions || 0), 0)

    return {
      activityCounts,
      totalViews,
      totalShares,
      totalReactions,
      recentActivities: activities.slice(0, 10),
      projectMetrics: projects.map(p => ({
        id: p.id,
        title: p.title,
        metrics: p.metrics || { views: 0, shares: 0, reactions: 0 },
      })),
    }
  }
} 