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
import { ActivateYearSheet } from "@/components/activate-year-sheet"
import { CopyYearSheet } from "@/components/copy-year-sheet"
import type { getSchoolStructureData } from "@/app/actions/school-structure"

type SchoolYear = Awaited<
  ReturnType<typeof getSchoolStructureData>
>["schoolYears"][number]

interface SchoolYearTabProps {
  schoolYears: SchoolYear[]
}

export function SchoolYearTab({ schoolYears }: SchoolYearTabProps) {
  if (schoolYears.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground text-center">
          No school years configured. Add the first school year to get started.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Year Label</TableHead>
          <TableHead>Periods</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schoolYears.map((year) => (
          <TableRow key={year.id}>
            <TableCell>
              <div>
                <span className="font-medium">{year.label}</span>
                <p className="text-sm text-muted-foreground">
                  JHS: Q1-Q4 · SHS: Sem 1/Sem 2
                </p>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {year.gradingPeriods.map((p) => p.periodType).join(", ")}
              </span>
            </TableCell>
            <TableCell>
              {year.isActive ? (
                <Badge variant="default">Active</Badge>
              ) : (
                <Badge variant="secondary">Past</Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {year.isActive ? (
                  <CopyYearSheet
                    sourceYearId={year.id}
                    sourceYearLabel={year.label}
                  />
                ) : (
                  <ActivateYearSheet
                    schoolYearId={year.id}
                    yearLabel={year.label}
                  />
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
