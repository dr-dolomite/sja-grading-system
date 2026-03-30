"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createSession, deleteSession, updateSession } from "@/lib/session"
import { verifySession } from "@/lib/dal"

// --- Schemas ---

const LoginSchema = z.object({
  employeeId: z.string().min(1, { error: "Employee ID is required" }),
  password: z.string().min(1, { error: "Password is required" }),
})

const ChangePasswordSchema = z.object({
  newPassword: z.string().min(8, { error: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(1, { error: "Please confirm your password." }),
})

// --- Login ---

export type LoginState = {
  errors?: {
    employeeId?: string[]
    password?: string[]
    form?: string[]
  }
} | null

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const validated = LoginSchema.safeParse({
    employeeId: formData.get("employeeId"),
    password: formData.get("password"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { employeeId, password } = validated.data

  const user = await prisma.user.findUnique({
    where: { employeeId },
  })

  if (!user || !user.isActive) {
    return {
      errors: {
        form: ["Invalid credentials. Check your Employee ID and password."],
      },
    }
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatch) {
    return {
      errors: {
        form: ["Invalid credentials. Check your Employee ID and password."],
      },
    }
  }

  await createSession(
    user.id,
    user.roles as string[],
    user.mustChangePassword,
  )

  if (user.mustChangePassword) {
    redirect("/change-password")
  }

  redirect("/dashboard")
}

// --- Logout ---

export async function logout() {
  await deleteSession()
  redirect("/login")
}

// --- Change Password (forced flow for current user) ---

export type ChangePasswordState = {
  errors?: {
    newPassword?: string[]
    confirmPassword?: string[]
    form?: string[]
  }
  success?: boolean
} | null

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await verifySession()

  const validated = ChangePasswordSchema.safeParse({
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { newPassword, confirmPassword } = validated.data

  if (newPassword !== confirmPassword) {
    return {
      errors: { confirmPassword: ["Passwords do not match."] },
    }
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      passwordHash,
      mustChangePassword: false,
    },
  })

  // Update session to clear mustChangePassword flag
  await updateSession(session.userId, session.roles, false)

  redirect("/dashboard")
}
