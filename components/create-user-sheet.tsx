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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { createUser } from "@/app/actions/users"
import type { CreateUserState } from "@/app/actions/users"
import { toast } from "sonner"
import { PlusIcon, CopyIcon, CheckIcon } from "lucide-react"

const ROLES = [
  { value: "SUBJECT_TEACHER", label: "Subject Teacher" },
  { value: "ADVISER", label: "Adviser" },
  { value: "PRINCIPAL", label: "Principal" },
  { value: "REGISTRAR", label: "Registrar" },
  { value: "ADMIN", label: "Admin" },
] as const

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

export function CreateUserSheet() {
  const [open, setOpen] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [state, formAction, isPending] = useActionState<
    CreateUserState,
    FormData
  >(createUser, null)

  useEffect(() => {
    if (state?.success && state?.createdEmployeeId) {
      setShowResult(true)
    }
  }, [state])

  function handleClose(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) setShowResult(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          Create account
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {showResult ? "Account created" : "Create account"}
          </SheetTitle>
        </SheetHeader>
        {showResult ? (
          <div className="flex flex-col gap-4 px-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Account for <span className="font-medium text-foreground">{state?.createdEmployeeId}</span> has been created. Share the temporary password below with the user.
            </p>
            <Field>
              <FieldLabel>Temporary password</FieldLabel>
              <CopyablePassword password={state?.tempPassword ?? ""} />
              <p className="text-xs text-muted-foreground mt-1">
                Click to copy. The user will be asked to change this on first login.
              </p>
            </Field>
            <Button onClick={() => handleClose(false)}>Done</Button>
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-4 px-4 pt-4">
            <FieldGroup>
              {state?.errors?.form && (
                <div
                  role="alert"
                  className="text-sm text-destructive text-center"
                >
                  {state.errors.form[0]}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="employeeId">Employee ID</FieldLabel>
                <Input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  required
                  placeholder="e.g. EMP-001"
                  className="bg-background"
                />
                {state?.errors?.employeeId && (
                  <FieldError>{state.errors.employeeId[0]}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Juan Dela Cruz"
                  className="bg-background"
                />
                {state?.errors?.name && (
                  <FieldError>{state.errors.name[0]}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel>Roles</FieldLabel>
                <div className="flex flex-col gap-2 pt-1">
                  {ROLES.map((role) => (
                    <div key={role.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`role-${role.value}`}
                        name="roles"
                        value={role.value}
                      />
                      <Label
                        htmlFor={`role-${role.value}`}
                        className="text-sm font-normal"
                      >
                        {role.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {state?.errors?.roles && (
                  <FieldError>{state.errors.roles[0]}</FieldError>
                )}
              </Field>
              <Button type="submit" disabled={isPending} aria-busy={isPending}>
                {isPending ? "Creating..." : "Create account"}
              </Button>
            </FieldGroup>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
