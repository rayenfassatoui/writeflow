import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user || !('id' in session.user)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get user's projects
    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id as string,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user || !('id' in session.user)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { title, description, type } = body

    // Create new project
    const project = await prisma.project.create({
      data: {
        title,
        description,
        type,
        status: 'DRAFT',
        userId: session.user.id as string,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 