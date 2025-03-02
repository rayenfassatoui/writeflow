import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // Public paths that don't require authentication
  const publicPaths = ["/", "/login", "/register", "/api/auth"]

  // Check if the current path is public
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Handle API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    if (!request.nextUrl.pathname.startsWith("/api/auth")) {
      if (!token) {
        return new NextResponse(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401 }
        )
      }
    }
    return NextResponse.next()
  }

  // Handle page routes
  if (!token && !isPublicPath) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (token && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
} 