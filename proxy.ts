import { NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/session"
import { cookies } from "next/headers"

const publicRoutes = ["/login"]
const changePasswordRoute = "/change-password"

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = (await cookies()).get("session")?.value
  const session = await decrypt(cookie)

  // Unauthenticated user trying to access protected route
  if (!isPublicRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  // Authenticated user trying to access login page — redirect to dashboard
  if (isPublicRoute && session?.userId) {
    if (session.mustChangePassword) {
      return NextResponse.redirect(new URL("/change-password", req.nextUrl))
    }
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  // Authenticated user who must change password — force to /change-password
  // (per D-06, D-07: mustChangePassword bypass prevention)
  if (
    session?.userId &&
    session.mustChangePassword &&
    path !== changePasswordRoute
  ) {
    return NextResponse.redirect(new URL("/change-password", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|sja-logos|.*\\.png$|.*\\.svg$).*)",
  ],
}
