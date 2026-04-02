"use client"

import { useActionState, useState, useEffect, startTransition } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  assignSubjectToGradeLevel,
  removeSubjectAssignment,
  type AssignSubjectState,
  type RemoveSubjectAssignmentState,
} from "@/app/actions/school-structure"
import { toast } from "sonner"

const SHS_GRADE_LEVELS = ["G11", "G12"]

type GradeLevelEntry = {
  id: string
  gradeLevel: string
  schoolYearId: string
}

type Strand = {
  id: string
  name: string
}

type ExistingAssignment = {
  id: string
  gradeLevelEntryId: string
  strandId: string | null
}

type AssignSubjectSheetProps = {
  subjectId: string
  subjectName: string
  gradeLevelEntries: GradeLevelEntry[]
  strands: Strand[]
  existingAssignments: ExistingAssignment[]
  trigger: React.ReactNode
}

// JHS row: single checkbox, no strand
function JhsRow({
  subjectId,
  entry,
  existing,
}: {
  subjectId: string
  entry: GradeLevelEntry
  existing: ExistingAssignment | undefined
}) {
  const isAssigned = !!existing
  const [checked, setChecked] = useState(isAssigned)
  const [pending, setPending] = useState(false)

  const [assignState, assignFormAction] = useActionState<AssignSubjectState, FormData>(
    assignSubjectToGradeLevel,
    null,
  )
  const [removeState, removeFormAction] = useActionState<RemoveSubjectAssignmentState, FormData>(
    removeSubjectAssignment,
    null,
  )

  useEffect(() => {
    if (assignState?.success) {
      startTransition(() => {
        setChecked(true)
        setPending(false)
      })
    }
    if (assignState?.errors?.form) {
      toast.error(assignState.errors.form[0])
      startTransition(() => {
        setChecked(isAssigned)
        setPending(false)
      })
    }
  }, [assignState, isAssigned])

  useEffect(() => {
    if (removeState?.success) {
      startTransition(() => {
        setChecked(false)
        setPending(false)
      })
    }
    if (removeState?.errors?.form) {
      toast.error(removeState.errors.form[0])
      startTransition(() => {
        setChecked(isAssigned)
        setPending(false)
      })
    }
  }, [removeState, isAssigned])

  const assignRef = (form: HTMLFormElement | null) => {
    if (form) form.dataset.assignEntry = entry.id
  }
  const removeRef = (form: HTMLFormElement | null) => {
    if (form) form.dataset.removeEntry = entry.id
  }

  const handleToggle = (newChecked: boolean | "indeterminate") => {
    if (pending || typeof newChecked !== "boolean") return
    setPending(true)
    setChecked(newChecked)
    const selector = newChecked
      ? `form[data-assign-entry="${entry.id}"] button[type="submit"]`
      : `form[data-remove-entry="${entry.id}"] button[type="submit"]`
    const btn = document.querySelector<HTMLButtonElement>(selector)
    btn?.click()
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <Checkbox
        checked={checked}
        disabled={pending}
        onCheckedChange={handleToggle}
        aria-label={`${checked ? "Unassign" : "Assign"} subject ${checked ? "from" : "to"} ${entry.gradeLevel}`}
      />
      <span className="text-sm">{entry.gradeLevel}</span>
      {/* Hidden forms for Server Actions */}
      <form action={assignFormAction} ref={assignRef} className="hidden">
        <input type="hidden" name="subjectId" value={subjectId} />
        <input type="hidden" name="gradeLevelEntryId" value={entry.id} />
        <button type="submit" />
      </form>
      {existing && (
        <form action={removeFormAction} ref={removeRef} className="hidden">
          <input type="hidden" name="id" value={existing.id} />
          <button type="submit" />
        </form>
      )}
    </div>
  )
}

// SHS strand row: one checkbox per strand per grade level entry
function ShsStrandRow({
  subjectId,
  entry,
  strand,
  existing,
}: {
  subjectId: string
  entry: GradeLevelEntry
  strand: Strand
  existing: ExistingAssignment | undefined
}) {
  const isAssigned = !!existing
  const [checked, setChecked] = useState(isAssigned)
  const [pending, setPending] = useState(false)

  const [assignState, assignFormAction] = useActionState<AssignSubjectState, FormData>(
    assignSubjectToGradeLevel,
    null,
  )
  const [removeState, removeFormAction] = useActionState<RemoveSubjectAssignmentState, FormData>(
    removeSubjectAssignment,
    null,
  )

  useEffect(() => {
    if (assignState?.success) {
      startTransition(() => {
        setChecked(true)
        setPending(false)
      })
    }
    if (assignState?.errors?.form) {
      toast.error(assignState.errors.form[0])
      startTransition(() => {
        setChecked(isAssigned)
        setPending(false)
      })
    }
  }, [assignState, isAssigned])

  useEffect(() => {
    if (removeState?.success) {
      startTransition(() => {
        setChecked(false)
        setPending(false)
      })
    }
    if (removeState?.errors?.form) {
      toast.error(removeState.errors.form[0])
      startTransition(() => {
        setChecked(isAssigned)
        setPending(false)
      })
    }
  }, [removeState, isAssigned])

  const rowKey = `${entry.id}-${strand.id}`
  const assignRef = (form: HTMLFormElement | null) => {
    if (form) form.dataset.assignStrandEntry = rowKey
  }
  const removeRef = (form: HTMLFormElement | null) => {
    if (form) form.dataset.removeStrandEntry = rowKey
  }

  const handleToggle = (newChecked: boolean | "indeterminate") => {
    if (pending || typeof newChecked !== "boolean") return
    setPending(true)
    setChecked(newChecked)
    const selector = newChecked
      ? `form[data-assign-strand-entry="${rowKey}"] button[type="submit"]`
      : `form[data-remove-strand-entry="${rowKey}"] button[type="submit"]`
    const btn = document.querySelector<HTMLButtonElement>(selector)
    btn?.click()
  }

  return (
    <div className="flex items-center gap-3 py-1.5 pl-4">
      <Checkbox
        checked={checked}
        disabled={pending}
        onCheckedChange={handleToggle}
        aria-label={`${checked ? "Unassign" : "Assign"} subject ${checked ? "from" : "to"} ${entry.gradeLevel} - ${strand.name}`}
      />
      <span className="text-sm text-muted-foreground">{strand.name}</span>
      {/* Hidden forms for Server Actions */}
      <form action={assignFormAction} ref={assignRef} className="hidden">
        <input type="hidden" name="subjectId" value={subjectId} />
        <input type="hidden" name="gradeLevelEntryId" value={entry.id} />
        <input type="hidden" name="strandId" value={strand.id} />
        <button type="submit" />
      </form>
      {existing && (
        <form action={removeFormAction} ref={removeRef} className="hidden">
          <input type="hidden" name="id" value={existing.id} />
          <button type="submit" />
        </form>
      )}
    </div>
  )
}

export function AssignSubjectSheet({
  subjectId,
  subjectName,
  gradeLevelEntries,
  strands,
  existingAssignments,
  trigger,
}: AssignSubjectSheetProps) {
  const [open, setOpen] = useState(false)

  const jhsEntries = gradeLevelEntries.filter(
    (e) => !SHS_GRADE_LEVELS.includes(e.gradeLevel),
  )
  const shsEntries = gradeLevelEntries.filter((e) =>
    SHS_GRADE_LEVELS.includes(e.gradeLevel),
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Assign to grade levels</SheetTitle>
        </SheetHeader>
        <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Subject:{" "}
            <span className="font-medium text-foreground">{subjectName}</span>
          </p>

          {gradeLevelEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No active school year with grade levels found. Create a school year first.
            </p>
          ) : (
            <div className="flex flex-col">
              {jhsEntries.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    JHS
                  </p>
                  {jhsEntries.map((entry) => (
                    <JhsRow
                      key={entry.id}
                      subjectId={subjectId}
                      entry={entry}
                      existing={existingAssignments.find(
                        (a) =>
                          a.gradeLevelEntryId === entry.id && a.strandId === null,
                      )}
                    />
                  ))}
                </div>
              )}

              {shsEntries.length > 0 && strands.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    SHS
                  </p>
                  {shsEntries.map((entry) => (
                    <div key={entry.id} className="mb-2">
                      <p className="text-sm font-medium py-1">{entry.gradeLevel}</p>
                      {strands.map((strand) => (
                        <ShsStrandRow
                          key={strand.id}
                          subjectId={subjectId}
                          entry={entry}
                          strand={strand}
                          existing={existingAssignments.find(
                            (a) =>
                              a.gradeLevelEntryId === entry.id &&
                              a.strandId === strand.id,
                          )}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {shsEntries.length > 0 && strands.length === 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    SHS
                  </p>
                  <p className="text-sm text-muted-foreground py-2">
                    No active strands found. Add strands in the Grade Levels tab first.
                  </p>
                </div>
              )}
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => startTransition(() => setOpen(false))}
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
