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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { CheckIcon, XIcon } from "lucide-react"
import { SUBJECT_TYPE_PRESETS, getPreset } from "@/lib/subject-type-presets"
import { createSubject, updateSubject } from "@/app/actions/school-structure"
import type { CreateSubjectState, UpdateSubjectState } from "@/app/actions/school-structure"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type CreateSubjectSheetProps = {
  mode: "create" | "edit"
  subject?: {
    id: string
    name: string
    subjectTypeKey: string
    writtenWorkPct: number
    performanceTaskPct: number
    quarterlyAssessmentPct: number | null
    hasQuarterlyAssessment: boolean
  }
  trigger?: React.ReactNode
}

const JHS_KEYS = [
  "JHS_LANGUAGES",
  "JHS_AP_ESP",
  "JHS_SCIENCE_MATH",
  "JHS_MAPEH_EPP_TLE",
] as const

const SHS_OLD_KEYS = [
  "SHS_OLD_CORE",
  "SHS_OLD_ACADEMIC_OTHER",
  "SHS_OLD_ACADEMIC_WORK_IMMERSION",
] as const

const SHS_NEW_KEYS = [
  "SHS_NEW_CORE",
  "SHS_NEW_ACADEMIC_ELECTIVE",
  "SHS_NEW_ACADEMIC_FIELD",
  "SHS_NEW_TECHPRO_ELECTIVE",
  "SHS_NEW_WORK_IMMERSION",
] as const

const SCHOOL_KEYS = ["SCHOOL_RELIGIOUS_ED"] as const

export function CreateSubjectSheet({ mode, subject, trigger }: CreateSubjectSheetProps) {
  const [open, setOpen] = useState(false)
  const [subjectTypeKey, setSubjectTypeKey] = useState(subject?.subjectTypeKey ?? "")
  const [ww, setWw] = useState(subject?.writtenWorkPct ?? 0)
  const [pt, setPt] = useState(subject?.performanceTaskPct ?? 0)
  const [qa, setQa] = useState(subject?.quarterlyAssessmentPct ?? 0)

  const preset = getPreset(subjectTypeKey)
  const hasQA = preset?.hasQuarterlyAssessment ?? true
  const weightSum = hasQA ? ww + pt + qa : ww + pt
  const isSumValid = weightSum === 100

  const [createState, createFormAction, createIsPending] = useActionState<
    CreateSubjectState,
    FormData
  >(createSubject, null)

  const [updateState, updateFormAction, updateIsPending] = useActionState<
    UpdateSubjectState,
    FormData
  >(updateSubject, null)

  const state = mode === "create" ? createState : updateState
  const formAction = mode === "create" ? createFormAction : updateFormAction
  const isPending = mode === "create" ? createIsPending : updateIsPending

  useEffect(() => {
    if (state?.success) {
      const subjectName = subject?.name ?? ""
      if (mode === "create") {
        toast.success("Subject added.")
      } else {
        toast.success(`Subject '${subjectName}' updated.`)
      }
      startTransition(() => setOpen(false))
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state, mode, subject?.name])

  // Auto-populate weights when subject type changes
  useEffect(() => {
    const p = getPreset(subjectTypeKey)
    if (p) {
      startTransition(() => {
        setWw(p.defaultWW)
        setPt(p.defaultPT)
        setQa(p.defaultQA ?? 0)
      })
    }
  }, [subjectTypeKey])

  const sheetTitle = mode === "create" ? "Add subject" : "Edit subject"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button>Add subject</Button>
        )}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
        </SheetHeader>
        <form action={formAction} className="flex flex-col gap-4 px-4 pt-4">
          {mode === "edit" && subject && (
            <input type="hidden" name="id" value={subject.id} />
          )}
          <input
            type="hidden"
            name="hasQuarterlyAssessment"
            value={hasQA ? "true" : "false"}
          />
          {!hasQA && (
            <input type="hidden" name="quarterlyAssessmentPct" value="" />
          )}
          <FieldGroup>
            {state?.errors?.form && (
              <div role="alert" className="text-sm text-destructive text-center">
                {state.errors.form[0]}
              </div>
            )}
            <Field>
              <FieldLabel htmlFor="subject-name">Subject name</FieldLabel>
              <Input
                id="subject-name"
                name="name"
                type="text"
                required
                placeholder="e.g. Filipino"
                defaultValue={subject?.name ?? ""}
                className="bg-background"
              />
              {state?.errors?.name && (
                <FieldError>{state.errors.name[0]}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="subject-type">Subject type</FieldLabel>
              <Select
                name="subjectTypeKey"
                value={subjectTypeKey}
                onValueChange={setSubjectTypeKey}
              >
                <SelectTrigger id="subject-type" className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>JHS</SelectLabel>
                    {JHS_KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {SUBJECT_TYPE_PRESETS[key].label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>SHS (old curriculum)</SelectLabel>
                    {SHS_OLD_KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {SUBJECT_TYPE_PRESETS[key].label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>SHS (Strengthened)</SelectLabel>
                    {SHS_NEW_KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {SUBJECT_TYPE_PRESETS[key].label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>School-specific</SelectLabel>
                    {SCHOOL_KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {SUBJECT_TYPE_PRESETS[key].label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {state?.errors?.subjectTypeKey && (
                <FieldError>{state.errors.subjectTypeKey[0]}</FieldError>
              )}
            </Field>

            {/* Component Weights */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Component Weights</p>
              <Field>
                <FieldLabel htmlFor="written-work-pct">Written Work (%)</FieldLabel>
                <Input
                  id="written-work-pct"
                  type="number"
                  name="writtenWorkPct"
                  min={0}
                  max={100}
                  value={ww}
                  onChange={(e) => setWw(Number(e.target.value))}
                  className="h-8 tabular-nums font-mono bg-background"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="performance-task-pct">Performance Task (%)</FieldLabel>
                <Input
                  id="performance-task-pct"
                  type="number"
                  name="performanceTaskPct"
                  min={0}
                  max={100}
                  value={pt}
                  onChange={(e) => setPt(Number(e.target.value))}
                  className="h-8 tabular-nums font-mono bg-background"
                />
              </Field>
              {hasQA && (
                <Field>
                  <FieldLabel htmlFor="quarterly-assessment-pct">
                    Quarterly Assessment (%)
                  </FieldLabel>
                  <Input
                    id="quarterly-assessment-pct"
                    type="number"
                    name="quarterlyAssessmentPct"
                    min={0}
                    max={100}
                    value={qa}
                    onChange={(e) => setQa(Number(e.target.value))}
                    className="h-8 tabular-nums font-mono bg-background"
                  />
                </Field>
              )}

              {/* Weight sum indicator */}
              <Card className="flex items-center gap-2 px-3 py-2">
                {isSumValid ? (
                  <>
                    <CheckIcon className="size-4 text-primary shrink-0" />
                    <span className="text-primary tabular-nums font-mono text-sm">
                      100%
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      {hasQA
                        ? "Written Work, Performance Task, and Quarterly Assessment must total 100%."
                        : "Written Work and Performance Task must total 100%."}
                    </span>
                  </>
                ) : (
                  <>
                    <XIcon className="size-4 text-destructive shrink-0" />
                    <span className="text-destructive tabular-nums font-mono text-sm">
                      Current total: {weightSum}%
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      {hasQA
                        ? "Written Work, Performance Task, and Quarterly Assessment must total 100%."
                        : "Written Work and Performance Task must total 100%."}
                    </span>
                  </>
                )}
              </Card>
              {(state?.errors?.writtenWorkPct ||
                state?.errors?.performanceTaskPct ||
                state?.errors?.quarterlyAssessmentPct) && (
                <FieldError>
                  {state.errors.writtenWorkPct?.[0] ||
                    state.errors.performanceTaskPct?.[0] ||
                    state.errors.quarterlyAssessmentPct?.[0]}
                </FieldError>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
              className={cn(!isSumValid && "opacity-80")}
            >
              {isPending ? "Saving..." : "Save subject"}
            </Button>
          </FieldGroup>
        </form>
      </SheetContent>
    </Sheet>
  )
}
