"use client"

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
import { PencilIcon, Link2Icon } from "lucide-react"
import { getPreset } from "@/lib/subject-type-presets"
import { CreateSubjectSheet } from "@/components/create-subject-sheet"

type SubjectsTabProps = {
  subjects: Array<{
    id: string
    name: string
    subjectTypeKey: string
    writtenWorkPct: number
    performanceTaskPct: number
    quarterlyAssessmentPct: number | null
    hasQuarterlyAssessment: boolean
    linkedSubjectId: string | null
    isActive: boolean
  }>
}

function curriculumLabel(curriculum: string) {
  if (curriculum === "JHS") return "JHS"
  if (curriculum === "SHS_OLD") return "SHS (old)"
  if (curriculum === "SHS_NEW") return "SHS (new)"
  return "School"
}

export function SubjectsTab({ subjects }: SubjectsTabProps) {
  if (subjects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No subjects registered. Add the first subject to get started.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>WW</TableHead>
          <TableHead>PT</TableHead>
          <TableHead className="hidden sm:table-cell">QA</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects.map((subject) => {
          const preset = getPreset(subject.subjectTypeKey)

          return (
            <TableRow key={subject.id}>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <span>{subject.name}</span>
                  {subject.linkedSubjectId !== null && (
                    <Link2Icon
                      className="size-3 text-muted-foreground"
                      aria-label="Linked subject pair — combined average computed for report card"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <span>{preset?.label ?? subject.subjectTypeKey}</span>
                  {preset && (
                    <span className="text-muted-foreground text-xs ml-1">
                      {curriculumLabel(preset.curriculum)}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="tabular-nums font-mono text-sm">
                {subject.writtenWorkPct}%
              </TableCell>
              <TableCell className="tabular-nums font-mono text-sm">
                {subject.performanceTaskPct}%
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {subject.hasQuarterlyAssessment ? (
                  <span className="tabular-nums font-mono text-sm">
                    {subject.quarterlyAssessmentPct}%
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">--</span>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      aria-label="2-component subject (no Quarterly Assessment)"
                    >
                      2-component
                    </Badge>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <CreateSubjectSheet
                  mode="edit"
                  subject={subject}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${subject.name}`}
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
