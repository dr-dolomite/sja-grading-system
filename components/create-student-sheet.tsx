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
import { Input } from "@/components/ui/input"
import { createStudent, updateStudent } from "@/app/actions/enrollment"
import type {
  CreateStudentState,
  UpdateStudentState,
  getEnrollmentData,
} from "@/app/actions/enrollment"
import { toast } from "sonner"

type EnrollmentData = Awaited<ReturnType<typeof getEnrollmentData>>
type GradeLevelEntryWithSections = EnrollmentData["gradeLevelEntries"][number]
type StudentWithSection = EnrollmentData["students"][number]

type CreateStudentSheetProps = {
  mode: "create" | "edit"
  student?: StudentWithSection
  gradeLevelEntries: GradeLevelEntryWithSections[]
  trigger?: React.ReactNode
}

export function CreateStudentSheet({
  mode,
  student,
  gradeLevelEntries,
  trigger,
}: CreateStudentSheetProps) {
  const [open, setOpen] = useState(false)

  // Derive initial grade level and section from student (edit mode)
  const initialGradeLevel = student?.section.gradeLevelEntry.gradeLevel ?? ""
  const initialSectionId = student?.sectionId ?? ""
  const initialSex = student?.sex ?? ""

  const [gradeLevel, setGradeLevel] = useState(initialGradeLevel)
  const [sectionId, setSectionId] = useState(initialSectionId)
  const [sex, setSex] = useState(initialSex)

  // Dual useActionState per established pattern (avoids conditional hook call)
  const [createState, createFormAction, createIsPending] = useActionState<
    CreateStudentState,
    FormData
  >(createStudent, null)

  const [updateState, updateFormAction, updateIsPending] = useActionState<
    UpdateStudentState,
    FormData
  >(updateStudent, null)

  const state = mode === "create" ? createState : updateState
  const formAction = mode === "create" ? createFormAction : updateFormAction
  const isPending = mode === "create" ? createIsPending : updateIsPending

  // Reset form state when sheet opens/closes
  useEffect(() => {
    if (open) {
      startTransition(() => {
        setGradeLevel(initialGradeLevel)
        setSectionId(initialSectionId)
        setSex(initialSex)
      })
    }
  }, [open, initialGradeLevel, initialSectionId, initialSex])

  useEffect(() => {
    if (state?.success) {
      if (mode === "create") {
        toast.success("Student enrolled successfully")
      } else {
        toast.success("Student updated")
      }
      startTransition(() => setOpen(false))
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state, mode])

  // Available sections filtered by selected grade level
  const selectedEntry = gradeLevelEntries.find(
    (gle) => gle.gradeLevel === gradeLevel,
  )
  const availableSections = selectedEntry?.sections ?? []

  // SHS strands for the current grade level — used as informational display only
  const isSHS = gradeLevel === "G11" || gradeLevel === "G12"

  // When grade level changes, reset section
  function handleGradeLevelChange(value: string) {
    startTransition(() => {
      setGradeLevel(value)
      setSectionId("")
    })
  }

  const sheetTitle = mode === "create" ? "Enroll student" : "Edit student"
  const submitLabel = mode === "create" ? "Enroll Student" : "Update Student"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? <Button>Enroll Student</Button>}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
        </SheetHeader>
        <form action={formAction} className="flex flex-col gap-4 px-4 pt-4">
          {mode === "edit" && student && (
            <input type="hidden" name="id" value={student.id} />
          )}
          {/* Hidden inputs for controlled select values */}
          <input type="hidden" name="sectionId" value={sectionId} />
          <input type="hidden" name="sex" value={sex} />

          <FieldGroup>
            {state?.errors?.form && (
              <div role="alert" className="text-sm text-destructive text-center">
                {state.errors.form[0]}
              </div>
            )}

            {/* LRN */}
            <Field>
              <FieldLabel htmlFor="student-lrn">LRN</FieldLabel>
              <Input
                id="student-lrn"
                name="lrn"
                type="text"
                required
                placeholder="e.g. 123456789012"
                defaultValue={student?.lrn ?? ""}
                className="bg-background"
              />
              {state?.errors?.lrn && (
                <FieldError>{state.errors.lrn[0]}</FieldError>
              )}
            </Field>

            {/* Last Name */}
            <Field>
              <FieldLabel htmlFor="student-last-name">Last Name</FieldLabel>
              <Input
                id="student-last-name"
                name="lastName"
                type="text"
                required
                placeholder="e.g. Santos"
                defaultValue={student?.lastName ?? ""}
                className="bg-background"
              />
              {state?.errors?.lastName && (
                <FieldError>{state.errors.lastName[0]}</FieldError>
              )}
            </Field>

            {/* First Name */}
            <Field>
              <FieldLabel htmlFor="student-first-name">First Name</FieldLabel>
              <Input
                id="student-first-name"
                name="firstName"
                type="text"
                required
                placeholder="e.g. Maria"
                defaultValue={student?.firstName ?? ""}
                className="bg-background"
              />
              {state?.errors?.firstName && (
                <FieldError>{state.errors.firstName[0]}</FieldError>
              )}
            </Field>

            {/* Middle Name */}
            <Field>
              <FieldLabel htmlFor="student-middle-name">
                Middle Name{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </FieldLabel>
              <Input
                id="student-middle-name"
                name="middleName"
                type="text"
                placeholder="e.g. Cruz"
                defaultValue={student?.middleName ?? ""}
                className="bg-background"
              />
            </Field>

            {/* Grade Level */}
            <Field>
              <FieldLabel htmlFor="student-grade-level">Grade Level</FieldLabel>
              <Select
                value={gradeLevel}
                onValueChange={handleGradeLevelChange}
              >
                <SelectTrigger id="student-grade-level" className="w-full">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  {gradeLevelEntries.map((gle) => (
                    <SelectItem key={gle.id} value={gle.gradeLevel}>
                      {gle.gradeLevel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Section */}
            <Field>
              <FieldLabel htmlFor="student-section">Section</FieldLabel>
              <Select
                value={sectionId}
                onValueChange={setSectionId}
                disabled={!gradeLevel}
              >
                <SelectTrigger id="student-section" className="w-full">
                  <SelectValue placeholder={gradeLevel ? "Select section" : "Select grade level first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSections.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                      {isSHS && s.strand ? ` (${s.strand.name})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.sectionId && (
                <FieldError>{state.errors.sectionId[0]}</FieldError>
              )}
              {sectionId && (
                <p className="text-xs text-muted-foreground">
                  This student will be automatically enrolled in all subjects for the selected section.
                </p>
              )}
            </Field>

            {/* Sex */}
            <Field>
              <FieldLabel htmlFor="student-sex">Sex</FieldLabel>
              <Select
                value={sex}
                onValueChange={setSex}
              >
                <SelectTrigger id="student-sex" className="w-full">
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.sex && (
                <FieldError>{state.errors.sex[0]}</FieldError>
              )}
            </Field>

            {/* Contact Number */}
            <Field>
              <FieldLabel htmlFor="student-contact">
                Contact Number{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </FieldLabel>
              <Input
                id="student-contact"
                name="contactNumber"
                type="text"
                placeholder="e.g. 09171234567"
                defaultValue={student?.contactNumber ?? ""}
                className="bg-background"
              />
            </Field>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={isPending || !sectionId || !sex}
                aria-busy={isPending}
                className="flex-1"
              >
                {isPending ? "Saving..." : submitLabel}
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
