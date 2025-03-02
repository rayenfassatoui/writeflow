import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth(requireAuth?: boolean) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && status === "unauthenticated") {
      router.push("/login")
    }
  }, [requireAuth, status, router])

  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    user: session?.user,
  }
}

// Types for the user object
export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: "USER" | "ADMIN"
} 