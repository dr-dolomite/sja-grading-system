"use client"

import { useActionState, useState, useEffect, startTransition } from "react"
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
import { updateUser } from "@/app/actions/users"
import type { UpdateUserState } from "@/app/actions/users"
import { toast } from "sonner"

const ROLES = [
  { value: "SUBJECT_TEACHER", label: "Subject Teacher" },
  { value: "ADVISER", label: "Adviser" },
  { value: "PRINCIPAL", label: "Principal" },
  { value: "REGISTRAR", label: "Registrar" },
  { value: "ADMIN", label: "Admin" },
] as const

type EditUserSheetProps = {
  user: {
    id: string
    name: string
    roles: string[]
  }
  trigger: React.ReactNode
}

export function EditUserSheet({ user, trigger }: EditUserSheetProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState<
    UpdateUserState,
    FormData
  >(updateUser, null)

  useEffect(() => {
    if (state?.success) {
      toast.success("User updated successfully")
      startTransition(() => setOpen(false))
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit user</SheetTitle>
        </SheetHeader>
        <form action={formAction} className="flex flex-col gap-4 px-4 pt-4">
          <input type="hidden" name="userId" value={user.id} />
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
              <FieldLabel htmlFor="edit-name">Full Name</FieldLabel>
              <Input
                id="edit-name"
                name="name"
                type="text"
                required
                defaultValue={user.name}
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
                      id={`edit-role-${role.value}`}
                      name="roles"
                      value={role.value}
                      defaultChecked={user.roles.includes(role.value)}
                    />
                    <Label
                      htmlFor={`edit-role-${role.value}`}
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
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? "Saving..." : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Discard
              </Button>
            </div>
          </FieldGroup>
        </form>
      </SheetContent>
    </Sheet>
  )
}
