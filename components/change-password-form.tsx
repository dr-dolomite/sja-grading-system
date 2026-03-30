"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { PasswordInput } from "@/components/password-input"
import { changePassword } from "@/app/actions/auth"
import type { ChangePasswordState } from "@/app/actions/auth"

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState<
    ChangePasswordState,
    FormData
  >(changePassword, null)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FieldGroup>
        {state?.errors?.form && (
          <div role="alert" className="text-sm text-destructive text-center">
            {state.errors.form[0]}
          </div>
        )}
        <Field>
          <FieldLabel htmlFor="newPassword">New password</FieldLabel>
          <PasswordInput
            id="newPassword"
            name="newPassword"
            required
            autoComplete="new-password"
            className="bg-background"
          />
          <FieldDescription>At least 8 characters.</FieldDescription>
          {state?.errors?.newPassword && (
            <FieldError>{state.errors.newPassword[0]}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">
            Confirm new password
          </FieldLabel>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            required
            autoComplete="new-password"
            className="bg-background"
          />
          {state?.errors?.confirmPassword && (
            <FieldError>{state.errors.confirmPassword[0]}</FieldError>
          )}
        </Field>
        <Field>
          <Button type="submit" disabled={isPending} aria-busy={isPending}>
            {isPending ? "Saving..." : "Set new password"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
