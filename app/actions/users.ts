"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/dal"

const ROLE_VALUES = [
  "SUBJECT_TEACHER",
  "ADVISER",
  "PRINCIPAL",
  "REGISTRAR",
  "ADMIN",
] as const

const CreateUserSchema = z.object({
  employeeId: z.string().min(1, { error: "Employee ID is required." }),
  name: z.string().min(1, { error: "Full name is required." }),
  roles: z.array(z.enum(ROLE_VALUES)).min(1, { error: "Select at least one role." }),
})

// --- Create User (AUTH-01) ---

export type CreateUserState = {
  errors?: {
    employeeId?: string[]
    name?: string[]
    roles?: string[]
    form?: string[]
  }
  success?: boolean
  createdEmployeeId?: string
} | null

export async function createUser(
  _prevState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const roles = formData.getAll("roles") as string[]

  const validated = CreateUserSchema.safeParse({
    employeeId: formData.get("employeeId"),
    name: formData.get("name"),
    roles,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { employeeId, name } = validated.data
  const validatedRoles = validated.data.roles

  // Check duplicate Employee ID
  const existing = await prisma.user.findUnique({
    where: { employeeId },
  })
  if (existing) {
    return {
      errors: { employeeId: ["This Employee ID is already in use."] },
    }
  }

  // Generate a temporary password: first 4 chars of employeeId + "@Sja" + random 4 digits
  const tempPassword = `${employeeId.slice(0, 4)}@Sja${Math.floor(1000 + Math.random() * 9000)}`
  const passwordHash = await bcrypt.hash(tempPassword, 12)

  await prisma.user.create({
    data: {
      employeeId,
      name,
      passwordHash,
      roles: validatedRoles,
      mustChangePassword: true,
      isActive: true,
    },
  })

  revalidatePath("/dashboard/users")
  return { success: true, createdEmployeeId: employeeId }
}

// --- Reset Password (AUTH-03 / D-05) ---

export type ResetPasswordState = {
  errors?: { form?: string[] }
  success?: boolean
  userName?: string
} | null

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const userId = formData.get("userId") as string
  if (!userId) {
    return { errors: { form: ["User ID is required."] } }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { employeeId: true, name: true },
  })

  if (!user) {
    return { errors: { form: ["User not found."] } }
  }

  // Generate temporary password
  const tempPassword = `${user.employeeId.slice(0, 4)}@Reset${Math.floor(1000 + Math.random() * 9000)}`
  const passwordHash = await bcrypt.hash(tempPassword, 12)

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash,
      mustChangePassword: true,
    },
  })

  revalidatePath("/dashboard/users")
  return { success: true, userName: user.name }
}

// --- Toggle User Active Status ---

export type ToggleUserActiveState = {
  errors?: { form?: string[] }
  success?: boolean
} | null

export async function toggleUserActive(
  _prevState: ToggleUserActiveState,
  formData: FormData,
): Promise<ToggleUserActiveState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const userId = formData.get("userId") as string
  const newStatus = formData.get("isActive") === "true"

  if (!userId) {
    return { errors: { form: ["User ID is required."] } }
  }

  // Prevent admin from disabling themselves
  if (userId === session.userId && !newStatus) {
    return { errors: { form: ["You cannot disable your own account."] } }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: newStatus },
  })

  revalidatePath("/dashboard/users")
  return { success: true }
}

// --- List Users (read-only, not a Server Action — helper for the page) ---

export async function getUsers() {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return []
  }

  return prisma.user.findMany({
    select: {
      id: true,
      employeeId: true,
      name: true,
      roles: true,
      isActive: true,
      mustChangePassword: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })
}
