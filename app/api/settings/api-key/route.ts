import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/app/api/auth/[...nextauth]/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST() {
  try {
    const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Generate a new API key
    const apiKey = `wf_${crypto.randomBytes(32).toString('hex')}`

    // Update the user with the new API key
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { apiKey },
      select: { apiKey: true },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error generating API key:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 