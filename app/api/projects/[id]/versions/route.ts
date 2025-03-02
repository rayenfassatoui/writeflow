import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
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

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
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

    const body = await req.json()
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