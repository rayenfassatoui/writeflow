import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/app/api/auth/[...nextauth]/auth'
import { prisma } from '@/lib/prisma'
import Groq from 'groq-sdk'

// Removing the unused type

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerAuthSession()
    if (!session?.user || !('id' in session.user)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Check if user has enough credits
    if (user.usageCredits <= 0) {
      return new NextResponse('Insufficient credits', { status: 402 })
    }

    const body = await req.json()
    const { contentType, topic, tone, length, keywords, additionalInstructions } = body

    // Build the prompt based on the parameters
    let prompt = `Create a ${contentType.toLowerCase().replace('_', ' ')} about "${topic}". `
    prompt += `Use a ${tone} tone. `
    prompt += `The content should be ${length} in length. `
    
    if (keywords.length > 0) {
      prompt += `Include the following keywords: ${keywords.join(', ')}. `
    }

    if (additionalInstructions) {
      prompt += `Additional requirements: ${additionalInstructions}`
    }

    // Initialize Groq client
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    // Generate content using Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: length === 'short' ? 250 : length === 'medium' ? 500 : 1000,
    })

    const generatedContent = completion.choices[0]?.message?.content || ''

    // Update user credits
    await prisma.user.update({
      where: { id: user.id },
      data: { usageCredits: user.usageCredits - 1 },
    })

    return NextResponse.json({ content: generatedContent.trim() })
  } catch (error) {
    console.error('Error generating content:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}