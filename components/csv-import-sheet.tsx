"use client"

import { useActionState, useState, useEffect, startTransition, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { bulkCreateStudents } from "@/app/actions/enrollment"
import type { BulkCreateStudentsState } from "@/app/actions/enrollment"
import { toast } from "sonner"
import { CheckIcon, XIcon, UploadIcon } from "lucide-react"

// --- Types ---

type ParsedRow = {
  lrn: string
  lastName: string
  firstName: string
  middleName: string
  gradeLevel: string
  sectionName: string
  strand: string
  sex: string
  contactNumber: string
}

type ParseError = {
  rowIndex: number
  errors: string[]
  raw: string
}

// --- CSV Parsing Utility ---

async function parseCSV(file: File): Promise<{ valid: ParsedRow[], errors: ParseError[] }> {
  const text = await file.text()
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean)
  const [, ...rows] = lines
  const valid: ParsedRow[] = []
  const errors: ParseError[] = []

  rows.forEach((line, idx) => {
    const cols = line.split(",").map((v) => v.trim())
    const [lrn, lastName, firstName, middleName, gradeLevel, sectionName, strand, sex, contactNumber] = cols

    const rowErrors: string[] = []
    if (!lrn) rowErrors.push("LRN required")
    if (!lastName) rowErrors.push("Last name required")
    if (!firstName) rowErrors.push("First name required")
    if (!["G7", "G8", "G9", "G10", "G11", "G12"].includes(gradeLevel)) rowErrors.push("Invalid grade level")
    if (!["Male", "Female", "MALE", "FEMALE"].includes(sex)) rowErrors.push("Sex must be Male or Female")
    if (["G11", "G12"].includes(gradeLevel) && !strand) rowErrors.push("Strand required for SHS")

    if (rowErrors.length > 0) {
      errors.push({ rowIndex: idx + 2, errors: rowErrors, raw: line })
    } else {
      // Normalize sex to MALE/FEMALE for the server action
      const normalizedSex = sex.toUpperCase() as "MALE" | "FEMALE"
      valid.push({
        lrn,
        lastName,
        firstName,
        middleName: middleName || "",
        gradeLevel,
        sectionName,
        strand: strand || "",
        sex: normalizedSex,
        contactNumber: contactNumber || "",
      })
    }
  })

  return { valid, errors }
}

// --- Error Report Download ---

function downloadErrorReport(errors: ParseError[]) {
  const lines = [
    "Row,Errors,Raw",
    ...errors.map((e) => `${e.rowIndex},"${e.errors.join("; ")}","${e.raw}"`),
  ]
  const blob = new Blob([lines.join("\n")], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "import-errors.csv"
  a.click()
  URL.revokeObjectURL(url)
}

// --- Component Props ---

type CsvImportSheetProps = {
  sections: Array<{ id: string, name: string, gradeLevel: string, gradeLevelEntryId: string, strandId: string | null }>
  trigger: React.ReactNode
}

// --- Main Component ---

export function CsvImportSheet({ trigger }: CsvImportSheetProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [file, setFile] = useState<File | null>(null)
  const [validRows, setValidRows] = useState<ParsedRow[]>([])
  const [errorRows, setErrorRows] = useState<ParseError[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [state, formAction, isSubmitting] = useActionState<BulkCreateStudentsState, FormData>(
    bulkCreateStudents,
    null,
  )

  // Handle success/error from server action
  useEffect(() => {
    if (state?.success) {
      const { imported = 0, skipped = 0 } = state
      if (skipped === 0) {
        toast.success(`${imported} students enrolled successfully`)
      } else {
        toast.success(`${imported} students enrolled. ${skipped} rows skipped — see error report.`)
      }
      startTransition(() => setOpen(false))
    }
    if (state?.errors?.form) {
      toast.error(state.errors.form[0])
    }
  }, [state])

  // Reset state when Sheet closes
  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      startTransition(() => {
        setStep(1)
        setFile(null)
        setValidRows([])
        setErrorRows([])
        setIsParsing(false)
      })
    }
  }

  // Handle file selection (from drop or file input)
  async function handleFile(selected: File) {
    if (!selected.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file.")
      return
    }
    setFile(selected)
    setIsParsing(true)
    const { valid, errors } = await parseCSV(selected)
    startTransition(() => {
      setValidRows(valid)
      setErrorRows(errors)
      setIsParsing(false)
      setStep(2)
    })
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) {
      void handleFile(dropped)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) {
      void handleFile(selected)
    }
  }

  function handleDropZoneClick() {
    fileInputRef.current?.click()
  }

  // Submit: pack valid rows as JSON in a FormData
  function handleImport() {
    const formData = new FormData()
    formData.set("rows", JSON.stringify(validRows))
    startTransition(() => {
      setStep(3)
      formAction(formData)
    })
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-2xl w-full">
        <SheetHeader>
          <SheetTitle>Import Students via CSV</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 pt-4">

          {/* Step 1 — Drop Zone */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Upload a CSV file to bulk-enroll students. Each row creates one student profile and auto-enrolls them in their section&apos;s subjects.
              </p>

              <div
                role="button"
                tabIndex={0}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleDropZoneClick}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleDropZoneClick() }}
                className="min-h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors gap-2 p-6"
              >
                <UploadIcon className="size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {isParsing ? "Parsing..." : "Drop your CSV file here, or click to browse"}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleInputChange}
                />
              </div>

              <a
                href="/csv-templates/student-import-template.csv"
                download
                className="text-sm text-primary underline w-fit"
              >
                Download template
              </a>
            </div>
          )}

          {/* Step 2 — Preview */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">
                  {file?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary font-semibold">{validRows.length} valid</span>
                  {errorRows.length > 0 && (
                    <>, <span className="text-destructive font-semibold">{errorRows.length} errors</span></>
                  )}
                </p>
              </div>

              {errorRows.length > 0 && (
                <p className="text-sm text-destructive">
                  {errorRows.length} rows will be skipped due to errors —{" "}
                  <button
                    type="button"
                    onClick={() => downloadErrorReport(errorRows)}
                    className="underline cursor-pointer"
                  >
                    Download error report
                  </button>
                </p>
              )}

              <div className="rounded-md border overflow-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide">Row</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide">LRN</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide">Name</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide">Grade</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide">Section</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validRows.map((row, i) => (
                      <TableRow key={`valid-${i}`}>
                        <TableCell className="text-sm text-muted-foreground">{i + 2}</TableCell>
                        <TableCell className="text-sm font-mono">{row.lrn}</TableCell>
                        <TableCell className="text-sm">{row.lastName}, {row.firstName}</TableCell>
                        <TableCell className="text-sm">{row.gradeLevel}</TableCell>
                        <TableCell className="text-sm">{row.sectionName}</TableCell>
                        <TableCell>
                          <Badge className="bg-primary/10 text-primary border-0 gap-1">
                            <CheckIcon className="size-3" />
                            Valid
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {errorRows.map((err) => (
                      <TableRow key={`error-${err.rowIndex}`}>
                        <TableCell className="text-sm text-muted-foreground">{err.rowIndex}</TableCell>
                        <TableCell className="text-sm text-muted-foreground" colSpan={3}>
                          <span className="font-mono text-xs truncate max-w-[200px] block">{err.raw}</span>
                        </TableCell>
                        <TableCell />
                        <TableCell>
                          <Badge variant="destructive" className="gap-1 h-auto py-1 whitespace-normal text-left">
                            <XIcon className="size-3 shrink-0" />
                            {err.errors[0]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  onClick={handleImport}
                  disabled={validRows.length === 0}
                  className="flex-1"
                >
                  Import {validRows.length} Students
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 — Importing */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-4 py-8">
              {isSubmitting ? (
                <>
                  <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <p className="text-sm text-muted-foreground">Importing students...</p>
                </>
              ) : (
                <>
                  <CheckIcon className="size-8 text-primary" />
                  <p className="text-sm text-muted-foreground">Import complete.</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                  >
                    Close
                  </Button>
                </>
              )}
            </div>
          )}

        </div>
      </SheetContent>
    </Sheet>
  )
}
