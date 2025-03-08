import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { Status } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { projectIds, action, tags, status } = await req.json()

    if (!projectIds || !Array.isArray(projectIds)) {
      return new NextResponse('Invalid project IDs', { status: 400 })
    }

    switch (action) {
      case 'archive':
        await prisma.project.updateMany({
          where: {
            id: { in: projectIds },
            userId: session.user.id,
          },
          data: { status: 'ARCHIVED' as Status },
        })
        break

      case 'delete':
        await prisma.project.deleteMany({
          where: {
            id: { in: projectIds },
            userId: session.user.id,
          },
        })
        break

      case 'updateStatus':
        if (!status) {
          return new NextResponse('Status is required', { status: 400 })
        }
        await prisma.project.updateMany({
          where: {
            id: { in: projectIds },
            userId: session.user.id,
          },
          data: { status: status as Status },
        })
        break

      case 'addTags':
        if (!tags || !Array.isArray(tags)) {
          return new NextResponse('Tags are required', { status: 400 })
        }

        // Create or get existing tags
        const createdTags = await Promise.all(
          tags.map(async (tagName) => {
            // First try to find existing tag
            let tag = await prisma.tag.findFirst({
              where: { name: tagName },
            })

            // If tag doesn't exist, create it
            if (!tag) {
              try {
                tag = await prisma.tag.create({
                  data: { name: tagName },
                })
              } catch (error) {
                // If creation fails (e.g., due to race condition), try to find it again
                tag = await prisma.tag.findFirst({
                  where: { name: tagName },
                })
                if (!tag) {
                  throw error; // Re-throw if we still can't find the tag
                }
              }
            }

            return tag
          })
        )

        // Update each project with the new tags
        const updatedProjects = await Promise.all(
          projectIds.map(async (projectId) => {
            const project = await prisma.project.findFirst({
              where: { 
                id: projectId,
                userId: session.user.id 
              },
              include: { tags: true },
            })

            if (project) {
              return await prisma.project.update({
                where: { id: projectId },
                data: {
                  tags: {
                    connect: createdTags.map(tag => ({ id: tag.id })),
                  },
                },
                include: { tags: true },
              })
            }
            return null
          })
        )

        // Filter out null values and return updated projects
        const validUpdatedProjects = updatedProjects.filter((p): p is NonNullable<typeof p> => p !== null)
        return NextResponse.json(validUpdatedProjects)

      case 'removeTags':
        if (!tags || !Array.isArray(tags)) {
          return new NextResponse('Tags are required', { status: 400 })
        }

        // Get tag IDs
        const tagsToRemove = await prisma.tag.findMany({
          where: {
            name: { in: tags },
          },
        })

        // Remove tags from projects
        await Promise.all(
          projectIds.map(async (projectId) => {
            const project = await prisma.project.findUnique({
              where: { id: projectId },
              include: { tags: true },
            })

            if (project && project.userId === session.user.id) {
              await prisma.project.update({
                where: { id: projectId },
                data: {
                  tags: {
                    disconnect: tagsToRemove.map(tag => ({ id: tag.id })),
                  },
                },
              })
            }
          })
        )

        // Return updated projects
        const projectsAfterRemoval = await prisma.project.findMany({
          where: {
            id: { in: projectIds },
            userId: session.user.id,
          },
          include: { tags: true },
        })

        return NextResponse.json(projectsAfterRemoval)

      default:
        return new NextResponse('Invalid action', { status: 400 })
    }

    // For non-tag actions, return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in bulk operation:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}