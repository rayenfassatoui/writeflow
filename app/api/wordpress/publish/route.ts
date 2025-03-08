import { NextResponse } from 'next/server'
import { WordPressService } from '@/app/lib/services/integrations/wordpress'

export async function POST(request: Request) {
  try {
    // Check if WordPress credentials are configured
    if (!process.env.WORDPRESS_API_URL || !process.env.WORDPRESS_USERNAME || !process.env.WORDPRESS_PASSWORD) {
      return NextResponse.json(
        { error: 'WordPress credentials not configured' },
        { status: 500 }
      )
    }

    // Initialize WordPress service
    const wordpress = new WordPressService({
      endpoint: process.env.WORDPRESS_API_URL,
      username: process.env.WORDPRESS_USERNAME,
      password: process.env.WORDPRESS_PASSWORD,
    })

    // Get request body
    const body = await request.json()
    const { title, content, status = 'draft', categories = [], tags = [], featured_media } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Publish post to WordPress
    const post = await wordpress.publishPost(title, content, {
      status,
      categories,
      tags,
      featured_media,
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error publishing to WordPress:', error)
    return NextResponse.json(
      { error: 'Failed to publish to WordPress' },
      { status: 500 }
    )
  }
} 