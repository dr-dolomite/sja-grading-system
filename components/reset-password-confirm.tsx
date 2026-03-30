"use client"

import { useActionState, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { resetPassword } from "@/app/actions/users"
import type { ResetPasswordState } from "@/app/actions/users"
import { toast } from "sonner"

type User = {
  id: string
  name: string
  employeeId: string
}

export function ResetPasswordConfirm({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState<
    ResetPasswordState,
    FormData
  >(resetPassword, null)

  useEffect(() => {
    if (state?.success) {
      toast.success(
        `Password reset. ${state.userName} will be prompted to set a new password on next login.`,
      )
      setOpen(false)
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Reset password
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Reset password</SheetTitle>
        </SheetHeader>
        <div className="px-4 pt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Reset {user.name}&apos;s password? They will be required to set a
            new password on next login.
          </p>
          <div className="flex items-center gap-2">
            <form action={formAction}>
              <input type="hidden" name="userId" value={user.id} />
              <Button
                type="submit"
                variant="destructive"
                disabled={isPending}
              >
                {isPending ? "Resetting..." : "Reset password"}
              </Button>
            </form>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Keep current password
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
