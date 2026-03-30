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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createSchoolYear } from "@/app/actions/school-structure"
import type { CreateSchoolYearState } from "@/app/actions/school-structure"
import { toast } from "sonner"
import { PlusIcon } from "lucide-react"

export function CreateSchoolYearSheet() {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState<
    CreateSchoolYearState,
    FormData
  >(createSchoolYear, null)

  useEffect(() => {
    if (state?.success) {
      toast.success("School year created. Grading periods auto-generated.")
      startTransition(() => setOpen(false))
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon className="size-4 mr-2" />
          Add school year
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add school year</SheetTitle>
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
              <FieldLabel htmlFor="label">Year Label</FieldLabel>
              <Input
                id="label"
                name="label"
                type="text"
                required
                placeholder="e.g. 2025-2026"
                className="bg-background"
              />
              <FieldDescription>
                Enter the school year label. Grading periods (Q1-Q4) will be
                auto-generated.
              </FieldDescription>
              {state?.errors?.label && (
                <FieldError>{state.errors.label[0]}</FieldError>
              )}
            </Field>
            <Button type="submit" disabled={isPending} aria-busy={isPending}>
              {isPending ? "Creating..." : "Add school year"}
            </Button>
          </FieldGroup>
        </form>
      </SheetContent>
    </Sheet>
  )
}
