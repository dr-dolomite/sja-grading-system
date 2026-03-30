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
import { activateSchoolYear } from "@/app/actions/school-structure"
import type { ActivateYearState } from "@/app/actions/school-structure"
import { toast } from "sonner"

interface ActivateYearSheetProps {
  schoolYearId: string
  yearLabel: string
}

export function ActivateYearSheet({
  schoolYearId,
  yearLabel,
}: ActivateYearSheetProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState<
    ActivateYearState,
    FormData
  >(activateSchoolYear, null)

  useEffect(() => {
    if (state?.success && state?.activatedLabel) {
      toast.success(`${state.activatedLabel} is now the active school year.`)
      startTransition(() => setOpen(false))
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Activate
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Activate school year</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Activating{" "}
            <span className="font-medium text-foreground">{yearLabel}</span>{" "}
            will deactivate the current active year. Continue?
          </p>
          <form action={formAction} className="flex flex-col gap-3">
            <input type="hidden" name="schoolYearId" value={schoolYearId} />
            <Button type="submit" disabled={isPending} aria-busy={isPending}>
              Activate {yearLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Keep current year
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
