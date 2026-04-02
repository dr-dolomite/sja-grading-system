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
import { assignTeacher } from "@/app/actions/assignment"
import type { AssignTeacherState } from "@/app/actions/assignment"
import { toast } from "sonner"

type AssignTeacherSheetProps = {
  subjectAssignmentId: string
  sectionId: string
  subjectName: string
  sectionName: string
  gradeLevel: string
  currentTeacherId: string | null
  teachers: Array<{ id: string; name: string; employeeId: string }>
  trigger: React.ReactNode
}

export function AssignTeacherSheet({
  subjectAssignmentId,
  sectionId,
  subjectName,
  sectionName,
  gradeLevel,
  currentTeacherId,
  teachers,
  trigger,
}: AssignTeacherSheetProps) {
  const [open, setOpen] = useState(false)

  const [state, formAction, isPending] = useActionState<AssignTeacherState, FormData>(
    assignTeacher,
    null,
  )

  useEffect(() => {
    if (state?.success) {
      toast.success("Teacher assigned successfully")
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
          <SheetTitle>Assign Teacher</SheetTitle>
        </SheetHeader>
        <form action={formAction} className="flex flex-col gap-4 px-4 pt-4">
          <input type="hidden" name="subjectAssignmentId" value={subjectAssignmentId} />
          <input type="hidden" name="sectionId" value={sectionId} />
          <FieldGroup>
            {state?.errors?.form && (
              <div role="alert" className="text-sm text-destructive text-center">
                {state.errors.form[0]}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">Subject</p>
              <p className="text-sm text-muted-foreground">{subjectName}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">Grade Level &amp; Section</p>
              <p className="text-sm text-muted-foreground">
                {gradeLevel} — {sectionName}
              </p>
            </div>
            <Field>
              <FieldLabel htmlFor="teacher-select">Teacher</FieldLabel>
              <Select name="teacherId" defaultValue={currentTeacherId ?? undefined}>
                <SelectTrigger id="teacher-select" className="w-full">
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.teacherId && (
                <FieldError>{state.errors.teacherId[0]}</FieldError>
              )}
            </Field>
            <div className="flex flex-col gap-2 pt-2">
              <Button type="submit" disabled={isPending} aria-busy={isPending}>
                {isPending ? "Assigning..." : "Assign Teacher"}
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
