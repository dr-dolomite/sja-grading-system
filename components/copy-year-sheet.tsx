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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { copyFromPreviousYear } from "@/app/actions/school-structure"
import type { CopyYearState } from "@/app/actions/school-structure"
import { toast } from "sonner"

interface CopyYearSheetProps {
  sourceYearId: string
  sourceYearLabel: string
}

export function CopyYearSheet({
  sourceYearId,
  sourceYearLabel,
}: CopyYearSheetProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState<
    CopyYearState,
    FormData
  >(copyFromPreviousYear, null)

  useEffect(() => {
    if (state?.success) {
      toast.success(`School year created from ${sourceYearLabel}.`)
      startTransition(() => setOpen(false))
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state, sourceYearLabel])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Copy to new year
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Copy from previous year</SheetTitle>
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
            <input type="hidden" name="sourceYearId" value={sourceYearId} />
            <Field>
              <FieldLabel htmlFor="yearLabel">New year label</FieldLabel>
              <Input
                id="yearLabel"
                name="yearLabel"
                type="text"
                required
                placeholder="e.g. 2026-2027"
                className="bg-background"
              />
              {state?.errors?.yearLabel && (
                <FieldError>{state.errors.yearLabel[0]}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>What to copy</FieldLabel>
              <div className="flex flex-col gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="copyGradeLevels"
                    name="copyGradeLevels"
                    defaultChecked
                    disabled
                  />
                  <Label
                    htmlFor="copyGradeLevels"
                    className="text-sm font-normal"
                  >
                    Grade levels
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="copySections"
                    name="copySections"
                    defaultChecked
                  />
                  <Label
                    htmlFor="copySections"
                    className="text-sm font-normal"
                  >
                    Sections (requires Grade levels)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="copyStrands"
                    name="copyStrands"
                    defaultChecked
                    disabled
                  />
                  <Label
                    htmlFor="copyStrands"
                    className="text-sm font-normal"
                  >
                    Strands{" "}
                    <span className="text-muted-foreground">
                      (strands are global — always available)
                    </span>
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="copySubjects"
                    name="copySubjects"
                    defaultChecked
                    disabled
                  />
                  <Label
                    htmlFor="copySubjects"
                    className="text-sm font-normal text-muted-foreground"
                  >
                    Subjects{" "}
                    <span className="text-xs">
                      (Subject assignment available in Phase 3)
                    </span>
                  </Label>
                </div>
              </div>
              <FieldDescription>
                Copied data can be edited after creation.
              </FieldDescription>
            </Field>
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isPending} aria-busy={isPending}>
                {isPending ? "Creating..." : "Copy and create year"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
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
