import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/app/api/auth/[...nextauth]/auth'
import { prisma } from '@/lib/prisma'
import { ContentOptimizer, OptimizationOptions } from '@/app/lib/services/ContentOptimizer'

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Check if user has enough credits
    if (user.usageCredits <= 0) {
      return new NextResponse('Insufficient credits', { status: 402 })
    }

    const body = await req.json()
    const options: OptimizationOptions = {
      content: body.content,
      targetKeywords: body.targetKeywords,
      contentType: body.contentType,
      tone: body.tone,
    }

    // Validate input
    if (!options.content || !options.targetKeywords || !options.contentType || !options.tone) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Optimize content
    const optimizer = new ContentOptimizer()
    const result = await optimizer.optimize(options)

    // Update user credits
    await prisma.user.update({
      where: { id: user.id },
      data: { usageCredits: user.usageCredits - 1 },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error optimizing content:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 