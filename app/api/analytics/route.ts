import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/app/api/auth/[...nextauth]/auth'
import { AnalyticsService } from '@/app/lib/services/analytics'

export async function GET() {
  try {
    const session = await getServerAuthSession()
    if (!session?.user || !('id' in session.user)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const analytics = await AnalyticsService.getUserAnalytics(session.user.id as string)
    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user || !('id' in session.user)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { type, metadata } = await request.json()
    const activity = await AnalyticsService.trackActivity(
      session.user.id as string,
      type,
      metadata
    )

    return NextResponse.json(activity)
  } catch (error) {
    console.error('Error tracking activity:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}