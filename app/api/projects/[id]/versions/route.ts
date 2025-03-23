import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/app/api/auth/[...nextauth]/auth'
import { prisma } from '@/lib/prisma'

// @ts-expect-error - Bypassing Next.js type checking issues with route params
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    // Get all versions for the project
    const versions = await prisma.version.findMany({
      where: {
        projectId: params.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(versions)
  } catch (error) {
    console.error('Error fetching versions:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// @ts-expect-error - Bypassing Next.js type checking issues with route params
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    const body = await request.json()
    const { content } = body

    // Create new version
    const version = await prisma.version.create({
      data: {
        content,
        projectId: params.id,
      },
    })

    return NextResponse.json(version)
  } catch (error) {
    console.error('Error creating version:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 