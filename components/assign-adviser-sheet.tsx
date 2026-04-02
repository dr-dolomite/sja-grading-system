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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { assignAdviser } from "@/app/actions/assignment"
import type { AssignAdviserState } from "@/app/actions/assignment"
import { toast } from "sonner"

type AssignAdviserSheetProps = {
  sectionId: string
  sectionName: string
  gradeLevel: string
  currentAdviserId: string | null
  advisers: Array<{ id: string; name: string; employeeId: string }>
  trigger: React.ReactNode
}

export function AssignAdviserSheet({
  sectionId,
  sectionName,
  gradeLevel,
  currentAdviserId,
  advisers,
  trigger,
}: AssignAdviserSheetProps) {
  const [open, setOpen] = useState(false)

  const [state, formAction, isPending] = useActionState<AssignAdviserState, FormData>(
    assignAdviser,
    null,
  )

  useEffect(() => {
    if (state?.success) {
      toast.success("Adviser assigned successfully")
      startTransition(() => setOpen(false))
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Assign Adviser</SheetTitle>
        </SheetHeader>
        <form action={formAction} className="flex flex-col gap-4 px-4 pt-4">
          <input type="hidden" name="sectionId" value={sectionId} />
          <FieldGroup>
            {state?.errors?.form && (
              <div role="alert" className="text-sm text-destructive text-center">
                {state.errors.form[0]}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">Section</p>
              <p className="text-sm text-muted-foreground">
                {gradeLevel} — {sectionName}
              </p>
            </div>
            <Field>
              <FieldLabel htmlFor="adviser-select">Adviser</FieldLabel>
              <Select name="adviserId" defaultValue={currentAdviserId ?? undefined}>
                <SelectTrigger id="adviser-select" className="w-full">
                  <SelectValue placeholder="Select an adviser" />
                </SelectTrigger>
                <SelectContent>
                  {advisers.map((adviser) => (
                    <SelectItem key={adviser.id} value={adviser.id}>
                      {adviser.name} ({adviser.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.adviserId && (
                <FieldError>{state.errors.adviserId[0]}</FieldError>
              )}
            </Field>
            <div className="flex flex-col gap-2 pt-2">
              <Button type="submit" disabled={isPending} aria-busy={isPending}>
                {isPending ? "Assigning..." : "Assign Adviser"}
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
