"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/dal"

// Local type — do NOT import from generated Prisma client
type Sex = "MALE" | "FEMALE"

// --- Data Query Helper (NOT a Server Action) ---

export async function getEnrollmentData() {
  const activeYear = await prisma.schoolYear.findFirst({ where: { isActive: true } })
  if (!activeYear) {
    return { students: [], gradeLevelEntries: [], sections: [], teachers: [], advisers: [], activeYearId: null }
  }

  const students = await prisma.student.findMany({
    where: { section: { gradeLevelEntry: { schoolYearId: activeYear.id } } },
    include: {
      section: {
        include: {
          gradeLevelEntry: true,
          strand: true,
        },
      },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  })

  const gradeLevelEntries = await prisma.gradeLevelEntry.findMany({
    where: { schoolYearId: activeYear.id },
    include: {
      sections: {
        include: { strand: true },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { gradeLevel: "asc" },
  })

  // Flatten sections for filter dropdowns
  const sections = gradeLevelEntries.flatMap((gle) =>
    gle.sections.map((s) => ({
      ...s,
      gradeLevel: gle.gradeLevel,
      gradeLevelEntryId: gle.id,
    }))
  )

  const teachers = await prisma.user.findMany({
    where: { roles: { has: "SUBJECT_TEACHER" }, isActive: true },
    select: { id: true, name: true, employeeId: true },
    orderBy: { name: "asc" },
  })

  const advisers = await prisma.user.findMany({
    where: { roles: { has: "ADVISER" }, isActive: true },
    select: { id: true, name: true, employeeId: true },
    orderBy: { name: "asc" },
  })

  return { students, gradeLevelEntries, sections, teachers, advisers, activeYearId: activeYear.id }
}

// --- Create Student ---

export type CreateStudentState = {
  errors?: {
    lrn?: string[]
    lastName?: string[]
    firstName?: string[]
    sectionId?: string[]
    sex?: string[]
    form?: string[]
  }
  success?: boolean
} | null

const CreateStudentSchema = z.object({
  lrn: z.string().min(1, { error: "LRN is required." }),
  lastName: z.string().min(1, { error: "Last name is required." }),
  firstName: z.string().min(1, { error: "First name is required." }),
  middleName: z.string().optional(),
  sectionId: z.string().min(1, { error: "Section is required." }),
  sex: z.enum(["MALE", "FEMALE"]),
  contactNumber: z.string().optional(),
})

export async function createStudent(
  _prevState: CreateStudentState,
  formData: FormData,
): Promise<CreateStudentState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN") && !session.roles.includes("PRINCIPAL")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const validated = CreateStudentSchema.safeParse({
    lrn: formData.get("lrn"),
    lastName: formData.get("lastName"),
    firstName: formData.get("firstName"),
    middleName: formData.get("middleName") || undefined,
    sectionId: formData.get("sectionId"),
    sex: formData.get("sex"),
    contactNumber: formData.get("contactNumber") || undefined,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { lrn, lastName, firstName, middleName, sectionId, sex, contactNumber } = validated.data

  // Check LRN uniqueness
  const existing = await prisma.student.findUnique({ where: { lrn } })
  if (existing) {
    return { errors: { lrn: ["This LRN is already registered."] } }
  }

  // Look up section with grade level entry
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: { gradeLevelEntry: true },
  })
  if (!section) {
    return { errors: { sectionId: ["Section not found."] } }
  }

  await prisma.$transaction(async (tx) => {
    // Create student
    const student = await tx.student.create({
      data: {
        lrn,
        lastName,
        firstName,
        middleName: middleName || null,
        sectionId,
        sex: sex as Sex,
        contactNumber: contactNumber || null,
      },
    })

    // Auto-enroll: find SubjectAssignments for this grade level + strand
    // CRITICAL: use section.strandId ?? null (NOT undefined) — Prisma treats undefined as "omit filter"
    const subjectAssignments = await tx.subjectAssignment.findMany({
      where: {
        gradeLevelEntryId: section.gradeLevelEntryId,
        strandId: section.strandId ?? null,
      },
    })

    // Create enrollment records
    await tx.studentEnrollment.createMany({
      data: subjectAssignments.map((sa) => ({
        studentId: student.id,
        subjectAssignmentId: sa.id,
      })),
      skipDuplicates: true,
    })
  })

  revalidatePath("/dashboard/enrollment")
  return { success: true }
}

// --- Update Student ---

export type UpdateStudentState = {
  errors?: {
    lrn?: string[]
    lastName?: string[]
    firstName?: string[]
    sectionId?: string[]
    sex?: string[]
    form?: string[]
  }
  success?: boolean
} | null

const UpdateStudentSchema = z.object({
  id: z.string().min(1, { error: "Student ID is required." }),
  lrn: z.string().min(1, { error: "LRN is required." }),
  lastName: z.string().min(1, { error: "Last name is required." }),
  firstName: z.string().min(1, { error: "First name is required." }),
  middleName: z.string().optional(),
  sectionId: z.string().min(1, { error: "Section is required." }),
  sex: z.enum(["MALE", "FEMALE"]),
  contactNumber: z.string().optional(),
})

export async function updateStudent(
  _prevState: UpdateStudentState,
  formData: FormData,
): Promise<UpdateStudentState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN") && !session.roles.includes("PRINCIPAL")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const validated = UpdateStudentSchema.safeParse({
    id: formData.get("id"),
    lrn: formData.get("lrn"),
    lastName: formData.get("lastName"),
    firstName: formData.get("firstName"),
    middleName: formData.get("middleName") || undefined,
    sectionId: formData.get("sectionId"),
    sex: formData.get("sex"),
    contactNumber: formData.get("contactNumber") || undefined,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { id, lrn, lastName, firstName, middleName, sectionId, sex, contactNumber } = validated.data

  // Check LRN uniqueness excluding current student
  const lrnConflict = await prisma.student.findFirst({ where: { lrn, NOT: { id } } })
  if (lrnConflict) {
    return { errors: { lrn: ["This LRN is already registered."] } }
  }

  // Get current student to check if section changed
  const currentStudent = await prisma.student.findUnique({ where: { id } })
  if (!currentStudent) {
    return { errors: { form: ["Student not found."] } }
  }

  // Look up new section
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: { gradeLevelEntry: true },
  })
  if (!section) {
    return { errors: { sectionId: ["Section not found."] } }
  }

  const sectionChanged = currentStudent.sectionId !== sectionId

  await prisma.$transaction(async (tx) => {
    if (sectionChanged) {
      // Delete existing enrollments and re-enroll for new section
      await tx.studentEnrollment.deleteMany({ where: { studentId: id } })

      const subjectAssignments = await tx.subjectAssignment.findMany({
        where: {
          gradeLevelEntryId: section.gradeLevelEntryId,
          strandId: section.strandId ?? null,
        },
      })

      await tx.studentEnrollment.createMany({
        data: subjectAssignments.map((sa) => ({
          studentId: id,
          subjectAssignmentId: sa.id,
        })),
        skipDuplicates: true,
      })
    }

    await tx.student.update({
      where: { id },
      data: {
        lrn,
        lastName,
        firstName,
        middleName: middleName || null,
        sectionId,
        sex: sex as Sex,
        contactNumber: contactNumber || null,
      },
    })
  })

  revalidatePath("/dashboard/enrollment")
  return { success: true }
}

// --- Remove Student ---

export type RemoveStudentState = {
  errors?: { form?: string[] }
  success?: boolean
} | null

const RemoveStudentSchema = z.object({
  id: z.string().min(1, { error: "Student ID is required." }),
})

export async function removeStudent(
  _prevState: RemoveStudentState,
  formData: FormData,
): Promise<RemoveStudentState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN") && !session.roles.includes("PRINCIPAL")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const validated = RemoveStudentSchema.safeParse({
    id: formData.get("id"),
  })

  if (!validated.success) {
    return { errors: { form: ["Invalid student ID."] } }
  }

  // Cascade deletes enrollments automatically (onDelete: Cascade on StudentEnrollment)
  await prisma.student.delete({ where: { id: validated.data.id } })

  revalidatePath("/dashboard/enrollment")
  return { success: true }
}
