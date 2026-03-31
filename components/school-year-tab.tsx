"use client"

import React, { useState, useEffect, useActionState, startTransition } from "react"
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
import { Trash2Icon } from "lucide-react"
import { ActivateYearSheet } from "@/components/activate-year-sheet"
import { CopyYearSheet } from "@/components/copy-year-sheet"
import { removeSchoolYear, type RemoveSchoolYearState } from "@/app/actions/school-structure"
import type { getSchoolStructureData } from "@/app/actions/school-structure"
import { toast } from "sonner"

type SchoolYear = Awaited<
  ReturnType<typeof getSchoolStructureData>
>["schoolYears"][number]

interface SchoolYearTabProps {
  schoolYears: SchoolYear[]
}

function RemoveYearRow({
  year,
  onCancel,
}: {
  year: { id: string; label: string }
  onCancel: () => void
}) {
  const [state, formAction, isPending] = useActionState<RemoveSchoolYearState, FormData>(
    removeSchoolYear,
    null,
  )

  useEffect(() => {
    if (state?.success) {
      toast.success(`School year '${year.label}' deleted.`)
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state, year.label])

  return (
    <TableRow className="bg-muted/30">
      <TableCell colSpan={4}>
        <div className="flex items-center gap-3 text-sm">
          <span>Delete school year &apos;{year.label}&apos; and all its data?</span>
          <form action={formAction} className="flex items-center gap-2">
            <input type="hidden" name="schoolYearId" value={year.id} />
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isPending}
            >
              Delete year
            </Button>
          </form>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => startTransition(() => onCancel())}
          >
            Keep year
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function SchoolYearTab({ schoolYears }: SchoolYearTabProps) {
  const [confirmingRemove, setConfirmingRemove] = useState<string | null>(null)

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
          <React.Fragment key={year.id}>
            <TableRow>
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
                    <>
                      <ActivateYearSheet
                        schoolYearId={year.id}
                        yearLabel={year.label}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${year.label}`}
                        onClick={() => setConfirmingRemove(year.id)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
            {confirmingRemove === year.id && (
              <RemoveYearRow
                year={year}
                onCancel={() => setConfirmingRemove(null)}
              />
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  )
}
