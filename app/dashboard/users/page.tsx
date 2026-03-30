import { verifySession } from "@/lib/dal"
import { redirect } from "next/navigation"
import { getUsers } from "@/app/actions/users"
import { UserTable } from "@/components/user-table"
import { CreateUserSheet } from "@/components/create-user-sheet"

export default async function UsersPage() {
  const session = await verifySession()

  // Only ADMIN can access this page (per D-01, D-10)
  if (!session.roles.includes("ADMIN")) {
    redirect("/dashboard")
  }

  const users = await getUsers()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user accounts and role assignments.
          </p>
        </div>
        <CreateUserSheet />
      </div>
      <div className="px-4 lg:px-6">
        <UserTable users={users} currentUserId={session.userId} />
      </div>
    </div>
  )
}
