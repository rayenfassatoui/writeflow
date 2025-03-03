import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get all versions from user's projects, ordered by creation date
    const versions = await prisma.version.findMany({
      where: {
        project: {
          userId: session.user.id,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to most recent 50 versions
    })

    return NextResponse.json(versions)
  } catch (error) {
    console.error('Error fetching version history:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 