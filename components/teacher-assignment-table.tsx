"use client"

import { useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AssignTeacherSheet } from "@/components/assign-teacher-sheet"

type SubjectSectionPair = {
  subjectAssignmentId: string
  subjectName: string
  gradeLevel: string
  sectionId: string
  sectionName: string
  strandName: string | null
  teacherId: string | null
  teacherName: string | null
  teacherEmployeeId: string | null
}

type TeacherAssignmentTableProps = {
  pairs: SubjectSectionPair[]
  teachers: Array<{ id: string; name: string; employeeId: string }>
}

export function TeacherAssignmentTable({ pairs, teachers }: TeacherAssignmentTableProps) {
  const [gradeFilter, setGradeFilter] = useState<string>("")

  const gradeLevels = Array.from(new Set(pairs.map((p) => p.gradeLevel))).sort()

  const filteredPairs = gradeFilter
    ? pairs.filter((p) => p.gradeLevel === gradeFilter)
    : pairs

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Teacher Assignments</h2>
      <div className="flex items-center gap-2">
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Grade Level" />
          </SelectTrigger>
          <SelectContent>
            {gradeLevels.map((gl) => (
              <SelectItem key={gl} value={gl}>
                {gl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {gradeFilter && (
          <Button variant="ghost" size="sm" onClick={() => setGradeFilter("")}>
            Clear
          </Button>
        )}
      </div>
      {filteredPairs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-xl font-semibold">No subject assignments found</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            Configure grade levels and subjects in School Structure first, then return here to assign teachers.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm font-semibold uppercase tracking-wide">
                Subject Name
              </TableHead>
              <TableHead className="text-sm font-semibold uppercase tracking-wide">
                Grade Level
              </TableHead>
              <TableHead className="text-sm font-semibold uppercase tracking-wide">
                Section
              </TableHead>
              <TableHead className="text-sm font-semibold uppercase tracking-wide">
                Assigned Teacher
              </TableHead>
              <TableHead className="text-sm font-semibold uppercase tracking-wide">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPairs.map((pair) => (
              <TableRow key={`${pair.subjectAssignmentId}-${pair.sectionId}`} className="hover:bg-muted">
                <TableCell className="text-sm">{pair.subjectName}</TableCell>
                <TableCell className="text-sm">{pair.gradeLevel}</TableCell>
                <TableCell className="text-sm">{pair.sectionName}</TableCell>
                <TableCell className="text-sm">
                  {pair.teacherName ? (
                    pair.teacherName
                  ) : (
                    <Badge variant="secondary">Unassigned</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <AssignTeacherSheet
                    subjectAssignmentId={pair.subjectAssignmentId}
                    sectionId={pair.sectionId}
                    subjectName={pair.subjectName}
                    sectionName={pair.sectionName}
                    gradeLevel={pair.gradeLevel}
                    currentTeacherId={pair.teacherId}
                    teachers={teachers}
                    trigger={
                      <Button variant="outline" size="sm">
                        {pair.teacherId ? "Change Teacher" : "Assign Teacher"}
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
