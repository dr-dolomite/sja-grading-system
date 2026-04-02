"use client"

import { useActionState, useEffect, startTransition, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { removeStudent, type RemoveStudentState } from "@/app/actions/enrollment"
import { CreateStudentSheet } from "@/components/create-student-sheet"
import { toast } from "sonner"
import type { getEnrollmentData } from "@/app/actions/enrollment"

type EnrollmentData = Awaited<ReturnType<typeof getEnrollmentData>>
type StudentWithSection = EnrollmentData["students"][number]
type GradeLevelEntryWithSections = EnrollmentData["gradeLevelEntries"][number]
type SectionFlat = EnrollmentData["sections"][number]

type StudentTableProps = {
  students: StudentWithSection[]
  gradeLevelEntries: GradeLevelEntryWithSections[]
  sections: SectionFlat[]
}

function RemoveStudentRow({
  student,
  onCancel,
}: {
  student: StudentWithSection
  onCancel: () => void
}) {
  const [state, formAction, isPending] = useActionState<RemoveStudentState, FormData>(
    removeStudent,
    null,
  )

  useEffect(() => {
    if (state?.success) {
      toast.success("Student removed")
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
      startTransition(() => onCancel())
    }
  }, [state, onCancel])

  return (
    <TableRow className="bg-destructive/5">
      <TableCell colSpan={7}>
        <div className="flex flex-col gap-2 py-1">
          <p className="text-sm text-destructive font-medium">
            Removing this student will also remove their enrollment records. This cannot be undone.
          </p>
          <div className="flex items-center gap-2">
            <form action={formAction}>
              <input type="hidden" name="id" value={student.id} />
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                disabled={isPending}
              >
                {isPending ? "Removing..." : "Remove Student"}
              </Button>
            </form>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isPending}
            >
              Keep Student
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function StudentTable({
  students,
  gradeLevelEntries,
  sections,
}: StudentTableProps) {
  const [gradeFilter, setGradeFilter] = useState<string>("")
  const [sectionFilter, setSectionFilter] = useState<string>("")
  const [search, setSearch] = useState("")
  const [removingId, setRemovingId] = useState<string | null>(null)

  // Derive unique grade levels
  const gradeLevels = gradeLevelEntries.map((gle) => gle.gradeLevel)

  // Filter sections based on selected grade level
  const filteredSections =
    gradeFilter && gradeFilter !== "all"
      ? sections.filter((s) => s.gradeLevel === gradeFilter)
      : sections

  // Reset section filter when grade changes
  function handleGradeChange(value: string) {
    setGradeFilter(value)
    setSectionFilter("")
  }

  // Apply filters and search
  const filteredStudents = students.filter((student) => {
    const gradeMatch =
      !gradeFilter ||
      gradeFilter === "all" ||
      student.section.gradeLevelEntry.gradeLevel === gradeFilter
    const sectionMatch =
      !sectionFilter || sectionFilter === "all" || student.sectionId === sectionFilter
    const searchLower = search.toLowerCase().trim()
    const fullName =
      `${student.lastName} ${student.firstName} ${student.middleName ?? ""}`.toLowerCase()
    const searchMatch =
      !searchLower ||
      fullName.includes(searchLower) ||
      student.lrn.toLowerCase().includes(searchLower)
    return gradeMatch && sectionMatch && searchMatch
  })

  const hasFilter =
    (gradeFilter && gradeFilter !== "all") ||
    (sectionFilter && sectionFilter !== "all") ||
    search.trim() !== ""

  function getEmptyMessage() {
    if (search.trim() !== "") {
      return "No students match your search. Check the spelling or try the LRN."
    }
    if (hasFilter) {
      return "No students found in this section. Try a different grade level or section, or clear the search."
    }
    return null
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-center gap-4 mb-4">
        <Select
          value={gradeFilter}
          onValueChange={handleGradeChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Grade Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grade Levels</SelectItem>
            {gradeLevels.map((gl) => (
              <SelectItem key={gl} value={gl}>
                {gl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sectionFilter}
          onValueChange={setSectionFilter}
          disabled={!gradeFilter || gradeFilter === "all"}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {filteredSections.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Search by name or LRN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Empty state — no students at all */}
      {students.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-xl font-semibold mb-2">No students enrolled yet</p>
          <p className="text-sm text-muted-foreground max-w-md">
            Start by enrolling students one at a time or import a CSV file to onboard the whole class at once.
          </p>
        </div>
      )}

      {/* Filtered empty state */}
      {students.length > 0 && filteredStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-xl font-semibold mb-2">No students found</p>
          <p className="text-sm text-muted-foreground max-w-md">
            {getEmptyMessage()}
          </p>
        </div>
      )}

      {/* Table */}
      {filteredStudents.length > 0 && (
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-semibold uppercase tracking-wide">LRN</TableHead>
                <TableHead className="text-sm font-semibold uppercase tracking-wide">Name</TableHead>
                <TableHead className="text-sm font-semibold uppercase tracking-wide">Grade &amp; Section</TableHead>
                <TableHead className="text-sm font-semibold uppercase tracking-wide">Strand</TableHead>
                <TableHead className="text-sm font-semibold uppercase tracking-wide">Sex</TableHead>
                <TableHead className="text-sm font-semibold uppercase tracking-wide">Contact No.</TableHead>
                <TableHead className="text-right text-sm font-semibold uppercase tracking-wide">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <>
                  <TableRow key={student.id} className="hover:bg-muted">
                    <TableCell className="text-sm">{student.lrn}</TableCell>
                    <TableCell className="text-sm font-semibold">
                      {student.lastName}, {student.firstName}
                      {student.middleName ? ` ${student.middleName}` : ""}
                    </TableCell>
                    <TableCell className="text-sm">
                      {student.section.gradeLevelEntry.gradeLevel} &mdash;{" "}
                      {student.section.name}
                    </TableCell>
                    <TableCell className="text-sm">
                      {student.section.strand ? student.section.strand.name : "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {student.sex === "MALE" ? "Male" : "Female"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {student.contactNumber || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CreateStudentSheet
                              mode="edit"
                              student={student}
                              gradeLevelEntries={gradeLevelEntries}
                              trigger={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-11 w-11"
                                >
                                  <PencilIcon className="size-4" />
                                  <span className="sr-only">Edit student</span>
                                </Button>
                              }
                            />
                          </TooltipTrigger>
                          <TooltipContent>Edit student</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-11 w-11 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() =>
                                setRemovingId(
                                  removingId === student.id ? null : student.id,
                                )
                              }
                            >
                              <Trash2Icon className="size-4" />
                              <span className="sr-only">Remove student</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove student</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                  {removingId === student.id && (
                    <RemoveStudentRow
                      key={`remove-${student.id}`}
                      student={student}
                      onCancel={() => setRemovingId(null)}
                    />
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      )}
    </div>
  )
}
