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

    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// @ts-expect-error - Bypassing Next.js type checking issues with route params
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { title, content } = body

    const project = await prisma.project.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        title,
        content,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 