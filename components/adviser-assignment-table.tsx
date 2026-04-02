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
import { AssignAdviserSheet } from "@/components/assign-adviser-sheet"

type SectionWithAdviser = {
  id: string
  name: string
  gradeLevelEntry: { gradeLevel: string }
  strand: { name: string } | null
  adviser: { id: string; name: string; employeeId: string } | null
}

type AdviserAssignmentTableProps = {
  sections: SectionWithAdviser[]
  advisers: Array<{ id: string; name: string; employeeId: string }>
}

export function AdviserAssignmentTable({ sections, advisers }: AdviserAssignmentTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Adviser Assignments</h2>
      {sections.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-xl font-semibold">No sections found</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            Add sections in School Structure before assigning advisers.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm font-semibold uppercase tracking-wide">
                Grade Level
              </TableHead>
              <TableHead className="text-sm font-semibold uppercase tracking-wide">
                Section
              </TableHead>
              <TableHead className="text-sm font-semibold uppercase tracking-wide">
                Strand
              </TableHead>
              <TableHead className="text-sm font-semibold uppercase tracking-wide">
                Current Adviser
              </TableHead>
              <TableHead className="text-sm font-semibold uppercase tracking-wide">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((section) => (
              <TableRow key={section.id} className="hover:bg-muted">
                <TableCell className="text-sm">{section.gradeLevelEntry.gradeLevel}</TableCell>
                <TableCell className="text-sm">{section.name}</TableCell>
                <TableCell className="text-sm">{section.strand?.name ?? "—"}</TableCell>
                <TableCell className="text-sm">
                  {section.adviser ? (
                    section.adviser.name
                  ) : (
                    <Badge variant="secondary">Unassigned</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <AssignAdviserSheet
                    sectionId={section.id}
                    sectionName={section.name}
                    gradeLevel={section.gradeLevelEntry.gradeLevel}
                    currentAdviserId={section.adviser?.id ?? null}
                    advisers={advisers}
                    trigger={
                      <Button variant="outline" size="sm">
                        {section.adviser ? "Change Adviser" : "Assign Adviser"}
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
