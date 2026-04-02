"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/dal"
import { SUBJECT_TYPE_KEYS } from "@/lib/subject-type-presets"
// These types mirror the Prisma enum values (defined locally to avoid importing
// from the generated client which is not available until after prisma generate)
type GradeLevel = "G7" | "G8" | "G9" | "G10" | "G11" | "G12"
type PeriodType = "Q1" | "Q2" | "Q3" | "Q4"

// --- Data Query Helper (NOT a Server Action) ---

export async function getSchoolStructureData() {
  const schoolYears = await prisma.schoolYear.findMany({
    include: { gradingPeriods: true },
    orderBy: { createdAt: "desc" },
  })
  const gradeLevelEntries = await prisma.gradeLevelEntry.findMany({
    include: {
      sections: { include: { strand: true }, orderBy: { name: "asc" } },
    },
    orderBy: { gradeLevel: "asc" },
  })
  const strands = await prisma.strand.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  })
  const subjects = await prisma.subject.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  })
  const subjectAssignments = await prisma.subjectAssignment.findMany({
    include: {
      subject: true,
      gradeLevelEntry: true,
      strand: true,
    },
    orderBy: { gradeLevelEntry: { gradeLevel: "asc" } },
  })
  return { schoolYears, gradeLevelEntries, strands, subjects, subjectAssignments }
}

// --- Create School Year ---

export type CreateSchoolYearState = {
  errors?: {
    label?: string[]
    form?: string[]
  }
  success?: boolean
} | null

const CreateSchoolYearSchema = z.object({
  label: z.string().min(1, { error: "School year label is required." }),
})

export async function createSchoolYear(
  _prevState: CreateSchoolYearState,
  formData: FormData,
): Promise<CreateSchoolYearState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const validated = CreateSchoolYearSchema.safeParse({
    label: formData.get("label"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { label } = validated.data

  const existing = await prisma.schoolYear.findUnique({ where: { label } })
  if (existing) {
    return {
      errors: { label: ["A school year with this label already exists."] },
    }
  }

  const newYear = await prisma.schoolYear.create({ data: { label } })

  await prisma.gradingPeriod.createMany({
    data: (["Q1", "Q2", "Q3", "Q4"] as PeriodType[]).map((p) => ({
      schoolYearId: newYear.id,
      periodType: p,
    })),
  })

  await prisma.gradeLevelEntry.createMany({
    data: (["G7", "G8", "G9", "G10", "G11", "G12"] as GradeLevel[]).map(
      (g) => ({
        schoolYearId: newYear.id,
        gradeLevel: g,
      }),
    ),
  })

  revalidatePath("/dashboard/school-structure")
  return { success: true }
}

// --- Activate School Year ---

export type ActivateYearState = {
  errors?: { form?: string[] }
  success?: boolean
  activatedLabel?: string
} | null

export async function activateSchoolYear(
  _prevState: ActivateYearState,
  formData: FormData,
): Promise<ActivateYearState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const schoolYearId = formData.get("schoolYearId") as string
  if (!schoolYearId) {
    return { errors: { form: ["School year ID is required."] } }
  }

  const year = await prisma.schoolYear.findUnique({
    where: { id: schoolYearId },
    select: { label: true },
  })
  if (!year) {
    return { errors: { form: ["School year not found."] } }
  }

  await prisma.$transaction([
    prisma.schoolYear.updateMany({ data: { isActive: false } }),
    prisma.schoolYear.update({
      where: { id: schoolYearId },
      data: { isActive: true },
    }),
  ])

  revalidatePath("/dashboard/school-structure")
  return { success: true, activatedLabel: year.label }
}

// --- Create Section ---

export type CreateSectionState = {
  errors?: {
    name?: string[]
    strandId?: string[]
    form?: string[]
  }
  success?: boolean
} | null

const CreateSectionSchema = z.object({
  name: z.string().min(1, { error: "Section name is required." }),
  gradeLevelEntryId: z.string().min(1, { error: "Grade level is required." }),
  strandId: z.string().optional(),
})

export async function createSection(
  _prevState: CreateSectionState,
  formData: FormData,
): Promise<CreateSectionState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const validated = CreateSectionSchema.safeParse({
    name: formData.get("name"),
    gradeLevelEntryId: formData.get("gradeLevelEntryId"),
    strandId: formData.get("strandId") || undefined,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { name, gradeLevelEntryId, strandId } = validated.data

  const existing = await prisma.section.findUnique({
    where: {
      gradeLevelEntryId_name_strandId: {
        gradeLevelEntryId,
        name,
        strandId: strandId || null,
      },
    },
  })
  if (existing) {
    const msg = strandId
      ? "A section with this name already exists for this strand."
      : "A section with this name already exists in this grade level."
    return { errors: { name: [msg] } }
  }

  await prisma.section.create({
    data: { name, gradeLevelEntryId, strandId: strandId || null },
  })

  revalidatePath("/dashboard/school-structure")
  return { success: true }
}

// --- Remove Section ---

export type RemoveSectionState = {
  errors?: { form?: string[] }
  success?: boolean
} | null

export async function removeSection(
  _prevState: RemoveSectionState,
  formData: FormData,
): Promise<RemoveSectionState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const sectionId = formData.get("sectionId") as string
  if (!sectionId) {
    return { errors: { form: ["Section ID is required."] } }
  }

  await prisma.section.delete({ where: { id: sectionId } })

  revalidatePath("/dashboard/school-structure")
  return { success: true }
}

// --- Create Subject ---

export type CreateSubjectState = {
  errors?: {
    name?: string[]
    subjectTypeKey?: string[]
    writtenWorkPct?: string[]
    performanceTaskPct?: string[]
    quarterlyAssessmentPct?: string[]
    form?: string[]
  }
  success?: boolean
} | null

const CreateSubjectSchema = z
  .object({
    name: z.string().min(1, { error: "Subject name is required." }),
    subjectTypeKey: z
      .string()
      .refine((key) => SUBJECT_TYPE_KEYS.includes(key), {
        error: "Invalid subject type.",
      }),
    writtenWorkPct: z.coerce.number().int().min(0).max(100),
    performanceTaskPct: z.coerce.number().int().min(0).max(100),
    quarterlyAssessmentPct: z.coerce.number().int().min(0).max(100).optional(),
    hasQuarterlyAssessment: z.coerce.boolean(),
  })
  .refine(
    (data) => {
      if (!data.hasQuarterlyAssessment) {
        return data.writtenWorkPct + data.performanceTaskPct === 100
      }
      return (
        data.writtenWorkPct +
          data.performanceTaskPct +
          (data.quarterlyAssessmentPct ?? 0) ===
        100
      )
    },
    { error: "Component weights must total 100%." },
  )

export async function createSubject(
  _prevState: CreateSubjectState,
  formData: FormData,
): Promise<CreateSubjectState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const hasQA = formData.get("hasQuarterlyAssessment") === "true"

  const validated = CreateSubjectSchema.safeParse({
    name: formData.get("name"),
    subjectTypeKey: formData.get("subjectTypeKey"),
    writtenWorkPct: formData.get("writtenWorkPct"),
    performanceTaskPct: formData.get("performanceTaskPct"),
    quarterlyAssessmentPct: hasQA
      ? formData.get("quarterlyAssessmentPct")
      : undefined,
    hasQuarterlyAssessment: hasQA,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const {
    name,
    subjectTypeKey,
    writtenWorkPct,
    performanceTaskPct,
    quarterlyAssessmentPct,
    hasQuarterlyAssessment,
  } = validated.data

  await prisma.subject.create({
    data: {
      name,
      subjectTypeKey,
      writtenWorkPct,
      performanceTaskPct,
      quarterlyAssessmentPct: hasQuarterlyAssessment
        ? quarterlyAssessmentPct
        : null,
      hasQuarterlyAssessment,
    },
  })

  revalidatePath("/dashboard/school-structure")
  return { success: true }
}

// --- Update Subject ---

export type UpdateSubjectState = {
  errors?: {
    id?: string[]
    name?: string[]
    subjectTypeKey?: string[]
    writtenWorkPct?: string[]
    performanceTaskPct?: string[]
    quarterlyAssessmentPct?: string[]
    form?: string[]
  }
  success?: boolean
} | null

const UpdateSubjectSchema = z
  .object({
    id: z.string().min(1, { error: "Subject ID is required." }),
    name: z.string().min(1, { error: "Subject name is required." }),
    subjectTypeKey: z
      .string()
      .refine((key) => SUBJECT_TYPE_KEYS.includes(key), {
        error: "Invalid subject type.",
      }),
    writtenWorkPct: z.coerce.number().int().min(0).max(100),
    performanceTaskPct: z.coerce.number().int().min(0).max(100),
    quarterlyAssessmentPct: z.coerce.number().int().min(0).max(100).optional(),
    hasQuarterlyAssessment: z.coerce.boolean(),
  })
  .refine(
    (data) => {
      if (!data.hasQuarterlyAssessment) {
        return data.writtenWorkPct + data.performanceTaskPct === 100
      }
      return (
        data.writtenWorkPct +
          data.performanceTaskPct +
          (data.quarterlyAssessmentPct ?? 0) ===
        100
      )
    },
    { error: "Component weights must total 100%." },
  )

export async function updateSubject(
  _prevState: UpdateSubjectState,
  formData: FormData,
): Promise<UpdateSubjectState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const hasQA = formData.get("hasQuarterlyAssessment") === "true"

  const validated = UpdateSubjectSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    subjectTypeKey: formData.get("subjectTypeKey"),
    writtenWorkPct: formData.get("writtenWorkPct"),
    performanceTaskPct: formData.get("performanceTaskPct"),
    quarterlyAssessmentPct: hasQA
      ? formData.get("quarterlyAssessmentPct")
      : undefined,
    hasQuarterlyAssessment: hasQA,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const {
    id,
    name,
    subjectTypeKey,
    writtenWorkPct,
    performanceTaskPct,
    quarterlyAssessmentPct,
    hasQuarterlyAssessment,
  } = validated.data

  await prisma.subject.update({
    where: { id },
    data: {
      name,
      subjectTypeKey,
      writtenWorkPct,
      performanceTaskPct,
      quarterlyAssessmentPct: hasQuarterlyAssessment
        ? quarterlyAssessmentPct
        : null,
      hasQuarterlyAssessment,
    },
  })

  revalidatePath("/dashboard/school-structure")
  return { success: true }
}

// --- Remove School Year ---

export type RemoveSchoolYearState = {
  errors?: { form?: string[] }
  success?: boolean
} | null

export async function removeSchoolYear(
  _prevState: RemoveSchoolYearState,
  formData: FormData,
): Promise<RemoveSchoolYearState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const schoolYearId = formData.get("schoolYearId") as string
  if (!schoolYearId) {
    return { errors: { form: ["School year ID is required."] } }
  }

  const year = await prisma.schoolYear.findUnique({ where: { id: schoolYearId } })
  if (year?.isActive) {
    return { errors: { form: ["Cannot delete the active school year. Deactivate it first."] } }
  }

  await prisma.schoolYear.delete({ where: { id: schoolYearId } })

  revalidatePath("/dashboard/school-structure")
  return { success: true }
}

// --- Remove Subject ---

export type RemoveSubjectState = {
  errors?: { form?: string[] }
  success?: boolean
} | null

export async function removeSubject(
  _prevState: RemoveSubjectState,
  formData: FormData,
): Promise<RemoveSubjectState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const subjectId = formData.get("subjectId") as string
  if (!subjectId) {
    return { errors: { form: ["Subject ID is required."] } }
  }

  await prisma.subject.delete({ where: { id: subjectId } })

  revalidatePath("/dashboard/school-structure")
  return { success: true }
}

// --- Assign Subject to Grade Level ---

export type AssignSubjectState = {
  errors?: {
    subjectId?: string[]
    gradeLevelEntryId?: string[]
    strandId?: string[]
    form?: string[]
  }
  success?: boolean
} | null

const AssignSubjectSchema = z.object({
  subjectId: z.string().min(1, { error: "Subject ID is required." }),
  gradeLevelEntryId: z.string().min(1, { error: "Grade level is required." }),
  strandId: z.string().optional(),
})

export async function assignSubjectToGradeLevel(
  _prevState: AssignSubjectState,
  formData: FormData,
): Promise<AssignSubjectState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const validated = AssignSubjectSchema.safeParse({
    subjectId: formData.get("subjectId"),
    gradeLevelEntryId: formData.get("gradeLevelEntryId"),
    strandId: formData.get("strandId") || undefined,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { subjectId, gradeLevelEntryId, strandId } = validated.data

  try {
    await prisma.subjectAssignment.create({
      data: { subjectId, gradeLevelEntryId, strandId: strandId ?? null },
    })
  } catch (e) {
    const err = e as { code?: string }
    if (err?.code === "P2002") {
      return {
        errors: {
          form: ["This subject is already assigned to this grade level and strand."],
        },
      }
    }
    throw e
  }

  revalidatePath("/dashboard/school-structure")
  return { success: true }
}

// --- Remove Subject Assignment ---

export type RemoveSubjectAssignmentState = {
  errors?: { form?: string[] }
  success?: boolean
} | null

const RemoveSubjectAssignmentSchema = z.object({
  id: z.string().min(1, { error: "Assignment ID is required." }),
})

export async function removeSubjectAssignment(
  _prevState: RemoveSubjectAssignmentState,
  formData: FormData,
): Promise<RemoveSubjectAssignmentState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const validated = RemoveSubjectAssignmentSchema.safeParse({
    id: formData.get("id"),
  })

  if (!validated.success) {
    return { errors: { form: ["Invalid assignment ID."] } }
  }

  await prisma.subjectAssignment.delete({ where: { id: validated.data.id } })

  revalidatePath("/dashboard/school-structure")
  return { success: true }
}

// --- Copy From Previous Year ---

export type CopyYearState = {
  errors?: {
    yearLabel?: string[]
    form?: string[]
  }
  success?: boolean
} | null

export async function copyFromPreviousYear(
  _prevState: CopyYearState,
  formData: FormData,
): Promise<CopyYearState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const sourceYearId = formData.get("sourceYearId") as string
  const yearLabel = (formData.get("yearLabel") as string)?.trim()
  const copySections = formData.get("copySections") === "on"

  if (!yearLabel) {
    return { errors: { yearLabel: ["New school year label is required."] } }
  }

  if (!sourceYearId) {
    return { errors: { form: ["Source year is required."] } }
  }

  const existingLabel = await prisma.schoolYear.findUnique({
    where: { label: yearLabel },
  })
  if (existingLabel) {
    return {
      errors: {
        yearLabel: ["A school year with this label already exists."],
      },
    }
  }

  await prisma.$transaction(async (tx) => {
    const newYear = await tx.schoolYear.create({ data: { label: yearLabel } })

    await tx.gradingPeriod.createMany({
      data: (["Q1", "Q2", "Q3", "Q4"] as PeriodType[]).map((p) => ({
        schoolYearId: newYear.id,
        periodType: p,
      })),
    })

    const newEntries: Array<{ id: string; gradeLevel: GradeLevel }> = []
    for (const gl of ["G7", "G8", "G9", "G10", "G11", "G12"] as GradeLevel[]) {
      const entry = await tx.gradeLevelEntry.create({
        data: { schoolYearId: newYear.id, gradeLevel: gl },
      })
      newEntries.push(entry)
    }

    if (copySections) {
      const sourceEntries = await tx.gradeLevelEntry.findMany({
        where: { schoolYearId: sourceYearId },
        include: { sections: true },
      })
      for (const sourceEntry of sourceEntries) {
        const matchingNew = newEntries.find(
          (e) => e.gradeLevel === sourceEntry.gradeLevel,
        )
        if (matchingNew) {
          for (const section of sourceEntry.sections) {
            await tx.section.create({
              data: {
                name: section.name,
                gradeLevelEntryId: matchingNew.id,
                strandId: section.strandId,
              },
            })
          }
        }
      }
    }
  })

  revalidatePath("/dashboard/school-structure")
  return { success: true }
}
