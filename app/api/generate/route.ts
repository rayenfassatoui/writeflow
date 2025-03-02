import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
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

    // Configure max tokens based on length
    const maxTokens = {
      short: 250,
      medium: 500,
      long: 1000,
    }[length]

    // Generate content using OpenAI API
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt,
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error('OpenAI API request failed')
    }

    const data = await response.json()
    const generatedContent = data.choices[0]?.text || ''

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