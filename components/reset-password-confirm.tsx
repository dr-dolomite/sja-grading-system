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
import { CopyIcon, CheckIcon } from "lucide-react"

type User = {
  id: string
  name: string
  employeeId: string
}

function CopyablePassword({ password }: { password: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex w-full items-center justify-between gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm font-mono cursor-pointer hover:bg-muted transition-colors"
    >
      <span>{password}</span>
      {copied ? (
        <CheckIcon className="size-4 text-green-600 shrink-0" />
      ) : (
        <CopyIcon className="size-4 text-muted-foreground shrink-0" />
      )}
    </button>
  )
}

export function ResetPasswordConfirm({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [state, formAction, isPending] = useActionState<
    ResetPasswordState,
    FormData
  >(resetPassword, null)

  useEffect(() => {
    if (state?.success) {
      setShowResult(true)
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state])

  function handleClose(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) setShowResult(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Reset password
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {showResult ? "Password reset" : "Reset password"}
          </SheetTitle>
        </SheetHeader>
        {showResult ? (
          <div className="flex flex-col gap-4 px-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Password for <span className="font-medium text-foreground">{state?.userName}</span> has been reset. Share the temporary password below.
            </p>
            <div>
              <p className="text-sm font-medium mb-1.5">Temporary password</p>
              <CopyablePassword password={state?.tempPassword ?? ""} />
              <p className="text-xs text-muted-foreground mt-1">
                Click to copy. They will be asked to change this on next login.
              </p>
            </div>
            <Button onClick={() => handleClose(false)}>Done</Button>
          </div>
        ) : (
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
              <Button variant="outline" onClick={() => handleClose(false)}>
                Keep current password
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
