"use client"

import { useState, useEffect, startTransition } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRightIcon, ChevronDownIcon, PlusIcon, TrashIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { CreateSectionSheet } from "@/components/create-section-sheet"
import { removeSection } from "@/app/actions/school-structure"
import type { RemoveSectionState } from "@/app/actions/school-structure"
import { useActionState } from "react"
import { toast } from "sonner"

type GradeLevelsTabProps = {
  gradeLevelEntries: Array<{
    id: string
    gradeLevel: string
    schoolYearId: string
    sections: Array<{
      id: string
      name: string
      strandId: string | null
      strand: { id: string; name: string } | null
    }>
  }>
  strands: Array<{ id: string; name: string }>
}

const GRADE_LEVEL_ORDER = ["G7", "G8", "G9", "G10", "G11", "G12"]

function isJHS(gradeLevel: string) {
  return ["G7", "G8", "G9", "G10"].includes(gradeLevel)
}

function gradeLevelLabel(gl: string) {
  return `Grade ${gl.replace("G", "")}`
}

type RemoveSectionRowProps = {
  section: {
    id: string
    name: string
  }
  gradeLevel: string
  onCancel: () => void
}

function RemoveSectionRow({ section, gradeLevel, onCancel }: RemoveSectionRowProps) {
  const [state, formAction, isPending] = useActionState<RemoveSectionState, FormData>(
    removeSection,
    null,
  )

  useEffect(() => {
    if (state?.success) {
      toast.success(`'${section.name}' removed from ${gradeLevelLabel(gradeLevel)}.`)
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state, section.name, gradeLevel])

  return (
    <TableRow className="bg-muted/30">
      <TableCell className="pl-8" colSpan={5}>
        <div className="flex items-center gap-3 text-sm">
          <span>
            Remove &apos;{section.name}&apos; from {gradeLevelLabel(gradeLevel)}?
          </span>
          <form action={formAction} className="flex items-center gap-2">
            <input type="hidden" name="sectionId" value={section.id} />
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isPending}
            >
              Remove section
            </Button>
          </form>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => startTransition(() => onCancel())}
          >
            Keep section
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function GradeLevelsTab({ gradeLevelEntries, strands }: GradeLevelsTabProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [confirmingRemove, setConfirmingRemove] = useState<string | null>(null)

  function toggleExpand(id: string) {
    const next = new Set(expanded)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setExpanded(next)
  }

  const sorted = [...gradeLevelEntries].sort(
    (a, b) =>
      GRADE_LEVEL_ORDER.indexOf(a.gradeLevel) -
      GRADE_LEVEL_ORDER.indexOf(b.gradeLevel),
  )

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8" />
          <TableHead>Grade Level</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Sections</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((entry) => {
          const isExpanded = expanded.has(entry.id)
          const jhs = isJHS(entry.gradeLevel)

          return (
            <>
              {/* Parent row */}
              <TableRow key={entry.id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-expanded={isExpanded}
                    aria-controls={`sections-${entry.id}`}
                    onClick={() => toggleExpand(entry.id)}
                  >
                    {isExpanded ? (
                      <ChevronDownIcon className="size-4" />
                    ) : (
                      <ChevronRightIcon className="size-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-semibold">
                  {gradeLevelLabel(entry.gradeLevel)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{jhs ? "JHS" : "SHS"}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {entry.sections.length} section
                  {entry.sections.length !== 1 ? "s" : ""}
                </TableCell>
                <TableCell className="text-right">
                  <CreateSectionSheet
                    gradeLevelEntryId={entry.id}
                    gradeLevel={entry.gradeLevel}
                    strands={strands}
                  />
                </TableCell>
              </TableRow>

              {/* Expanded section rows */}
              {isExpanded && (
                <>
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <div id={`sections-${entry.id}`}>
                        <Table>
                          <TableBody>
                            {entry.sections.length === 0 ? (
                              <TableRow className="bg-muted/30">
                                <TableCell
                                  colSpan={5}
                                  className={cn("pl-8 text-sm text-muted-foreground")}
                                >
                                  No sections yet. Add the first section for{" "}
                                  {gradeLevelLabel(entry.gradeLevel)}.
                                </TableCell>
                              </TableRow>
                            ) : (
                              entry.sections.map((section) =>
                                confirmingRemove === section.id ? (
                                  <RemoveSectionRow
                                    key={section.id}
                                    section={section}
                                    gradeLevel={entry.gradeLevel}
                                    onCancel={() => setConfirmingRemove(null)}
                                  />
                                ) : (
                                  <TableRow
                                    key={section.id}
                                    className="bg-muted/30"
                                  >
                                    <TableCell className="pl-8" colSpan={4}>
                                      <div className="flex items-center gap-2">
                                        <span>{section.name}</span>
                                        {!jhs && section.strand && (
                                          <Badge variant="outline" className="text-xs">
                                            {section.strand.name}
                                          </Badge>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-4">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() =>
                                          setConfirmingRemove(section.id)
                                        }
                                      >
                                        <TrashIcon className="size-4 mr-1" />
                                        Remove
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ),
                              )
                            )}
                            {/* Add section row */}
                            <TableRow className="bg-muted/30">
                              <TableCell colSpan={5} className="pl-8 py-2">
                                <CreateSectionSheet
                                  gradeLevelEntryId={entry.id}
                                  gradeLevel={entry.gradeLevel}
                                  strands={strands}
                                  trigger={
                                    <Button variant="ghost" size="sm">
                                      <PlusIcon className="size-4 mr-1" />
                                      Add section
                                    </Button>
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </>
          )
        })}
      </TableBody>
    </Table>
  )
}
