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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { createSection } from "@/app/actions/school-structure"
import type { CreateSectionState } from "@/app/actions/school-structure"
import { toast } from "sonner"
import { PlusIcon } from "lucide-react"

type CreateSectionSheetProps = {
  gradeLevelEntryId: string
  gradeLevel: string
  strands: Array<{ id: string; name: string }>
  trigger?: React.ReactNode
}

function gradeLevelLabel(gl: string) {
  return `Grade ${gl.replace("G", "")}`
}

function isSHS(gradeLevel: string) {
  return ["G11", "G12"].includes(gradeLevel)
}

export function CreateSectionSheet({
  gradeLevelEntryId,
  gradeLevel,
  strands,
  trigger,
}: CreateSectionSheetProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState<CreateSectionState, FormData>(
    createSection,
    null,
  )

  useEffect(() => {
    if (state?.success) {
      toast.success(`Section added to ${gradeLevelLabel(gradeLevel)}.`)
      startTransition(() => setOpen(false))
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state, gradeLevel])

  const sheetTitle = `Add section \u2014 ${gradeLevelLabel(gradeLevel)}`

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon" className="size-7">
            <PlusIcon className="size-4" />
            <span className="sr-only">Add section to {gradeLevelLabel(gradeLevel)}</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
        </SheetHeader>
        <form action={formAction} className="flex flex-col gap-4 px-4 pt-4">
          <input type="hidden" name="gradeLevelEntryId" value={gradeLevelEntryId} />
          <FieldGroup>
            {state?.errors?.form && (
              <div role="alert" className="text-sm text-destructive text-center">
                {state.errors.form[0]}
              </div>
            )}
            <Field>
              <FieldLabel htmlFor={`section-name-${gradeLevelEntryId}`}>
                Section name
              </FieldLabel>
              <Input
                id={`section-name-${gradeLevelEntryId}`}
                name="name"
                type="text"
                required
                placeholder="e.g. St. John"
                className="bg-background"
              />
              {state?.errors?.name && (
                <FieldError>{state.errors.name[0]}</FieldError>
              )}
            </Field>
            {isSHS(gradeLevel) && (
              <Field>
                <FieldLabel htmlFor={`section-strand-${gradeLevelEntryId}`}>
                  Strand
                </FieldLabel>
                <Select name="strandId">
                  <SelectTrigger
                    id={`section-strand-${gradeLevelEntryId}`}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select a strand" />
                  </SelectTrigger>
                  <SelectContent>
                    {strands.map((strand) => (
                      <SelectItem key={strand.id} value={strand.id}>
                        {strand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Assign a strand to this SHS section.
                </FieldDescription>
                {state?.errors?.strandId && (
                  <FieldError>{state.errors.strandId[0]}</FieldError>
                )}
              </Field>
            )}
            <Button type="submit" disabled={isPending} aria-busy={isPending}>
              {isPending ? "Adding..." : "Save section"}
            </Button>
          </FieldGroup>
        </form>
      </SheetContent>
    </Sheet>
  )
}
