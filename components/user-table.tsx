"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ResetPasswordConfirm } from "@/components/reset-password-confirm"
import { toggleUserActive } from "@/app/actions/users"
import type { ToggleUserActiveState } from "@/app/actions/users"
import { Button } from "@/components/ui/button"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

const ROLE_LABELS: Record<string, string> = {
  SUBJECT_TEACHER: "Teacher",
  ADVISER: "Adviser",
  PRINCIPAL: "Principal",
  REGISTRAR: "Registrar",
  ADMIN: "Admin",
}

type User = {
  id: string
  employeeId: string
  name: string
  roles: string[]
  isActive: boolean
  mustChangePassword: boolean
  createdAt: Date
}

function ToggleActiveButton({
  user,
  isCurrentUser,
}: {
  user: User
  isCurrentUser: boolean
}) {
  const [state, formAction, isPending] = useActionState<
    ToggleUserActiveState,
    FormData
  >(toggleUserActive, null)

  useEffect(() => {
    if (state?.success) {
      toast.success(
        user.isActive
          ? `${user.name}'s account has been disabled.`
          : `${user.name}'s account has been reactivated.`,
      )
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state])

  if (isCurrentUser) return null

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={user.id} />
      <input
        type="hidden"
        name="isActive"
        value={user.isActive ? "false" : "true"}
      />
      <Button
        type="submit"
        variant={user.isActive ? "destructive" : "outline"}
        size="sm"
        disabled={isPending}
      >
        {user.isActive ? "Disable" : "Enable"}
      </Button>
    </form>
  )
}

export function UserTable({
  users,
  currentUserId,
}: {
  users: User[]
  currentUserId: string
}) {
  if (users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No user accounts yet. Create the first account to get started.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee ID</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.employeeId}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {user.roles.map((role) => (
                  <Badge key={role} variant="outline" className="text-xs">
                    {ROLE_LABELS[role] ?? role}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={user.isActive ? "default" : "secondary"}>
                {user.isActive ? "Active" : "Disabled"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <ResetPasswordConfirm user={user} />
                <ToggleActiveButton
                  user={user}
                  isCurrentUser={user.id === currentUserId}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
