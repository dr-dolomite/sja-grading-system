"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/dal"

// --- Data Query Helper (NOT a Server Action) ---

export async function getAssignmentData() {
  const activeYear = await prisma.schoolYear.findFirst({ where: { isActive: true } })
  if (!activeYear) {
    return { subjectSectionPairs: [], sections: [] }
  }

  // All SubjectAssignments for the active year, with their teacher assignments
  const subjectAssignments = await prisma.subjectAssignment.findMany({
    where: { gradeLevelEntry: { schoolYearId: activeYear.id } },
    include: {
      subject: true,
      gradeLevelEntry: {
        include: {
          sections: {
            include: { strand: true },
            orderBy: { name: "asc" },
          },
        },
      },
      strand: true,
      teacherAssignments: {
        include: {
          teacher: { select: { id: true, name: true, employeeId: true } },
          section: true,
        },
      },
    },
    orderBy: [{ gradeLevelEntry: { gradeLevel: "asc" } }, { subject: { name: "asc" } }],
  })

  // Build subject-section pairs: for each SubjectAssignment, cross with each section
  // in the same grade level that matches the strand (null strand = all sections, non-null = only matching strand sections)
  const subjectSectionPairs = subjectAssignments.flatMap((sa) => {
    const matchingSections = sa.gradeLevelEntry.sections.filter((s) =>
      sa.strandId === null ? true : s.strandId === sa.strandId
    )
    return matchingSections.map((section) => {
      const assignment = sa.teacherAssignments.find((ta) => ta.sectionId === section.id)
      return {
        subjectAssignmentId: sa.id,
        subjectName: sa.subject.name,
        gradeLevel: sa.gradeLevelEntry.gradeLevel,
        sectionId: section.id,
        sectionName: section.name,
        strandName: section.strand?.name ?? null,
        teacherId: assignment?.teacher.id ?? null,
        teacherName: assignment?.teacher.name ?? null,
        teacherEmployeeId: assignment?.teacher.employeeId ?? null,
      }
    })
  })

  // All sections in active year with adviser info
  const sections = await prisma.section.findMany({
    where: { gradeLevelEntry: { schoolYearId: activeYear.id } },
    include: {
      gradeLevelEntry: true,
      strand: true,
      adviser: { select: { id: true, name: true, employeeId: true } },
    },
    orderBy: [{ gradeLevelEntry: { gradeLevel: "asc" } }, { name: "asc" }],
  })

  return { subjectSectionPairs, sections }
}

// --- Assign Teacher ---

export type AssignTeacherState = {
  errors?: {
    teacherId?: string[]
    form?: string[]
  }
  success?: boolean
} | null

const AssignTeacherSchema = z.object({
  subjectAssignmentId: z.string().min(1, { error: "Subject assignment is required." }),
  sectionId: z.string().min(1, { error: "Section is required." }),
  teacherId: z.string().min(1, { error: "Teacher is required." }),
})

export async function assignTeacher(
  _prevState: AssignTeacherState,
  formData: FormData,
): Promise<AssignTeacherState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN") && !session.roles.includes("PRINCIPAL")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const validated = AssignTeacherSchema.safeParse({
    subjectAssignmentId: formData.get("subjectAssignmentId"),
    sectionId: formData.get("sectionId"),
    teacherId: formData.get("teacherId"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  await prisma.teacherAssignment.upsert({
    where: {
      subjectAssignmentId_sectionId: {
        subjectAssignmentId: validated.data.subjectAssignmentId,
        sectionId: validated.data.sectionId,
      },
    },
    create: {
      subjectAssignmentId: validated.data.subjectAssignmentId,
      sectionId: validated.data.sectionId,
      teacherId: validated.data.teacherId,
    },
    update: { teacherId: validated.data.teacherId },
  })

  revalidatePath("/dashboard/enrollment")
  return { success: true }
}

// --- Assign Adviser ---

export type AssignAdviserState = {
  errors?: {
    adviserId?: string[]
    form?: string[]
  }
  success?: boolean
} | null

const AssignAdviserSchema = z.object({
  sectionId: z.string().min(1, { error: "Section is required." }),
  adviserId: z.string().min(1, { error: "Adviser is required." }),
})

export async function assignAdviser(
  _prevState: AssignAdviserState,
  formData: FormData,
): Promise<AssignAdviserState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN") && !session.roles.includes("PRINCIPAL")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const validated = AssignAdviserSchema.safeParse({
    sectionId: formData.get("sectionId"),
    adviserId: formData.get("adviserId"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  await prisma.section.update({
    where: { id: validated.data.sectionId },
    data: { adviserId: validated.data.adviserId },
  })

  revalidatePath("/dashboard/enrollment")
  return { success: true }
}
