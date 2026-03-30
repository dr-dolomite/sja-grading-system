"use client"

import { useActionState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/password-input"
import { login } from "@/app/actions/auth"
import type { LoginState } from "@/app/actions/auth"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    login,
    null,
  )

  return (
    <form
      action={formAction}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-semibold">Sign in to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your Employee ID and password
          </p>
        </div>
        {state?.errors?.form && (
          <div role="alert" className="text-sm text-destructive text-center">
            {state.errors.form[0]}
          </div>
        )}
        <Field>
          <FieldLabel htmlFor="employeeId">Employee ID</FieldLabel>
          <Input
            id="employeeId"
            name="employeeId"
            type="text"
            placeholder="Enter your Employee ID"
            required
            autoComplete="username"
            className="bg-background"
          />
          {state?.errors?.employeeId && (
            <FieldError>{state.errors.employeeId[0]}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput
            id="password"
            name="password"
            required
            autoComplete="current-password"
            className="bg-background"
          />
          {state?.errors?.password && (
            <FieldError>{state.errors.password[0]}</FieldError>
          )}
        </Field>
        <Field>
          <Button type="submit" disabled={isPending} aria-busy={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
