import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check authentication
    const session = await getServerAuthSession()
    if (!session?.user || !('id' in session.user)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get user's data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      include: {
        projects: {
          orderBy: { updatedAt: 'desc' },
          take: 3,
        },
        _count: {
          select: {
            projects: true,
          },
        },
      },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Get last month's project count for comparison
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    
    const lastMonthProjects = await prisma.project.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: lastMonth,
        },
      },
    })

    // Get active projects (those updated in the last 7 days)
    const activeProjects = await prisma.project.count({
      where: {
        userId: user.id,
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    })

    // Calculate total words generated (from project contents)
    const totalWords = user.projects.reduce((acc, project) => {
      return acc + (project.content?.split(/\s+/).length || 0)
    }, 0)

    // Format the dashboard data
    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        credits: user.usageCredits,
      },
      stats: [
        {
          name: 'Total Projects',
          value: user._count.projects.toString(),
          change: `${lastMonthProjects} new this month`,
        },
        {
          name: 'Words Generated',
          value: totalWords.toLocaleString(),
          change: 'Lifetime total',
        },
        {
          name: 'Active Projects',
          value: activeProjects.toString(),
          change: 'Updated in last 7 days',
        },
      ],
      recentProjects: user.projects.map(project => ({
        id: project.id,
        title: project.title,
        excerpt: project.description || '',
        status: project.status,
        lastEdited: project.updatedAt,
      })),
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}