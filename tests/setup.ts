import { vi } from "vitest"

// Mock next/headers cookies() — used by session.ts and dal.ts
const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}))

// Mock next/navigation redirect — used by dal.ts and auth actions
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  }),
}))

// Mock next/cache revalidatePath — used by user actions
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

// Mock lib/prisma — used by dal.ts, auth actions, and school structure actions
vi.mock("@/lib/prisma", () => {
  const prismaMock = {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
    schoolYear: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    gradingPeriod: {
      createMany: vi.fn(),
    },
    gradeLevelEntry: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
    },
    strand: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    section: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    subject: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  } as Record<string, unknown>
  prismaMock.$transaction = vi.fn((fnOrArray: unknown) => {
    if (typeof fnOrArray === "function") return fnOrArray(prismaMock)
    return Promise.all(fnOrArray as Promise<unknown>[])
  })
  return { prisma: prismaMock }
})

// Mock server-only — it throws at import time in test env
vi.mock("server-only", () => ({}))

// Export mock references for test files to configure per-test behavior
export { mockCookieStore }
