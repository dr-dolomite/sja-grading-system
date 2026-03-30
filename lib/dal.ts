import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { decrypt } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value
  const session = await decrypt(cookie)
  if (!session?.userId) redirect("/login")
  return {
    userId: session.userId as string,
    roles: session.roles as string[],
    mustChangePassword: session.mustChangePassword as boolean,
  }
})

export const getCurrentUser = cache(async () => {
  const { userId } = await verifySession()
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      employeeId: true,
      name: true,
      roles: true,
      isActive: true,
      mustChangePassword: true,
    },
  })
  if (!user || !user.isActive) redirect("/login")
  return user
})
