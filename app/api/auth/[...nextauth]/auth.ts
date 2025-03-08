import { getServerSession } from "next-auth"
import { authOptions } from "./route"

// Export a wrapper around getServerSession for use in other files
export function getServerAuthSession() {
  return getServerSession(authOptions)
}