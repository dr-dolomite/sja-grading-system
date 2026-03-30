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
import { PlusIcon } from "lucide-react"

const ROLES = [
  { value: "SUBJECT_TEACHER", label: "Subject Teacher" },
  { value: "ADVISER", label: "Adviser" },
  { value: "PRINCIPAL", label: "Principal" },
  { value: "REGISTRAR", label: "Registrar" },
  { value: "ADMIN", label: "Admin" },
] as const

export function CreateUserSheet() {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState<
    CreateUserState,
    FormData
  >(createUser, null)

  useEffect(() => {
    if (state?.success && state?.createdEmployeeId) {
      toast.success(
        `Account created. Employee ID: ${state.createdEmployeeId}`,
      )
      setOpen(false)
    }
  }, [state])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          Create account
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create account</SheetTitle>
        </SheetHeader>
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
      </SheetContent>
    </Sheet>
  )
}
