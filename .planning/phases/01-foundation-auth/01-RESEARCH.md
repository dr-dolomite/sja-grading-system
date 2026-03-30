# Phase 1: Foundation & Auth - Research

**Researched:** 2026-03-30
**Domain:** Authentication, Session Management, Prisma ORM, Next.js 16 App Router
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Account Provisioning**
- D-01: Admin-only account creation. No self-registration. Only users with the Admin role can create new accounts and assign roles.
- D-02: One account at a time via a form. No bulk import or CSV upload for v1.
- D-03: Login credentials are Employee ID + password. Employee ID is the unique login identifier (not username or email).
- D-04: First admin account is bootstrapped via a CLI seed command (e.g., `pnpm db:seed`) with known default credentials.

**Password Reset**
- D-05: Admin-assisted password reset only. No self-service reset (no email, no security questions). Teacher contacts Admin, Admin resets from admin panel.
- D-06: Forced password change after admin reset. When Admin resets a user's password, the user must set a new password on next login.
- D-07: Seed admin also requires forced password change on first login. Same rule applies to the bootstrapped admin account — default credentials cannot persist.

**User Roles**
- D-08: Five roles: Subject Teacher, Adviser, Principal, Registrar, Admin.
- D-09: Multi-role support. A single user can hold multiple roles (e.g., Teacher + Adviser). Permissions are additive across assigned roles.
- D-10: No role hierarchy. Each role grants specific, explicit permissions. Higher roles do NOT inherit lower role capabilities.
- D-11: Unified dashboard for multi-role users. One dashboard that combines sections from all assigned roles. No role switcher.

### Claude's Discretion
- Dashboard landing experience: What each role sees on their dashboard (summary cards, action shortcuts, navigation).
- Login page design: Layout, branding, use of SJA logos.
- Auth library choice: Whether to use NextAuth.js/Auth.js, Lucia, or custom auth.
- Session management strategy: Cookie-based sessions, JWT, or framework-provided.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | Admin can create user accounts with assigned roles (Subject Teacher, Adviser, Principal, Registrar, Admin) | Prisma User model with roles relation; Server Action for account creation with Admin role check |
| AUTH-02 | User can log in with credentials and see role-appropriate dashboard | Custom credential auth (Employee ID + password); DAL verifySession; dashboard renders sections based on session roles |
| AUTH-03 | User can reset their own password | Admin-only password reset via Server Action; mustChangePassword flag triggers forced-change flow on next login |
| AUTH-04 | User session persists across browser refresh | Stateless JWT session in HttpOnly cookie; proxy.ts validates session on every request |
</phase_requirements>

---

## Summary

This phase establishes the auth foundation from scratch. The stack is Next.js 16.2.1 + Prisma 7 + PostgreSQL — no auth library was installed yet. Two distinct concerns must be resolved: (1) selecting and configuring an auth approach compatible with custom Employee ID credentials and multi-role additive permissions, and (2) setting up Prisma 7 correctly, which has substantial breaking changes from Prisma 5/6.

Next.js 16 has renamed `middleware.ts` to `proxy.ts` — this is a hard breaking change from training data. All route protection must use `proxy.ts` at the project root. Server Actions are the canonical pattern for form submissions in App Router; the existing `components/login-form.tsx` is already structured as a Server-action-compatible form.

**Primary recommendation:** Use a custom credential auth approach — bcryptjs for password hashing + jose for JWT session cookies + Prisma as the user store + proxy.ts for route protection. This avoids auth library overhead for a use case that is credential-only (no social logins, no OAuth), with Employee ID as the unique identifier (not email), which most auth libraries assume. Better Auth's username plugin gets close but maps "username" to display, not a custom identifier type; the indirection adds complexity with no benefit.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| prisma | 7.6.0 | ORM / schema / migrations | Decided stack; Rust-free v7 is the current major |
| @prisma/client | 7.6.0 | Generated database client | Required companion to prisma |
| @prisma/adapter-pg | (install) | Driver adapter — mandatory in Prisma 7 | Prisma 7 removed built-in engines; all DBs now require a driver adapter |
| pg | (install) | PostgreSQL driver for adapter-pg | Standard Node.js pg driver |
| bcryptjs | 3.0.3 | Password hashing | Pure-JS implementation; no native binaries; safe in RSC/Server Actions on Next.js |
| @types/bcryptjs | 3.0.0 | TypeScript types for bcryptjs | Dev only |
| jose | 6.2.2 | JWT signing/verification for session cookies | Recommended by official Next.js auth guide; Edge Runtime compatible |
| server-only | (install) | Prevent DAL/session modules from leaking to client | Standard pattern in Next.js data security guide |
| dotenv | (install) | Load .env in prisma.config.ts (Prisma 7 no longer auto-loads) | Required by Prisma 7 config architecture |
| tsx | (install) | Run TypeScript seed scripts directly | Required for `pnpm db:seed` CLI seed command |
| zod | 4.3.6 | Form validation in Server Actions | Already installed; v4 API differs from v3 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @types/pg | (install) | TypeScript types for pg | Dev only; needed with @prisma/adapter-pg |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom auth | Better Auth | Better Auth has a username plugin and Prisma adapter but still maps "username" as an optional display field, not as the sole identifier type; requires fighting defaults for Employee ID |
| Custom auth | Auth.js v5 / NextAuth | Auth.js requires email as primary identifier in the credentials provider pattern; @auth/prisma-adapter schema forces email on User model |
| bcryptjs | bcrypt | bcrypt uses native C++ binaries that can fail in RSC/Server Action context on some environments; bcryptjs is pure JS and always safe |
| jose | iron-session | iron-session is simpler but jose is listed first in the official Next.js session guide and provides fine-grained JWT control |

**Installation (new packages needed):**
```bash
pnpm add @prisma/adapter-pg pg bcryptjs jose server-only dotenv
pnpm add -D prisma @prisma/client @types/bcryptjs @types/pg tsx
```

**Version verification:**
```bash
npm view @prisma/adapter-pg version   # should match 7.x
npm view pg version                   # 8.x
npm view bcryptjs version             # 3.x
npm view jose version                 # 6.x
```

---

## Architecture Patterns

### Recommended Project Structure
```
prisma/
├── schema.prisma          # Data models (no url — moved to prisma.config.ts)
├── seed.ts                # Seed script for first Admin account
└── migrations/            # Migration files from prisma migrate dev
prisma.config.ts           # NEW in Prisma 7: datasource url, migration path, seed
app/
├── generated/
│   └── prisma/            # Prisma-generated client output (gitignored)
├── (auth)/
│   └── login/
│       └── page.tsx       # Login page (adapt existing template)
├── (protected)/
│   └── dashboard/
│       └── page.tsx       # Dashboard page (adapt existing template)
├── api/
│   └── auth/
│       └── [...all]/      # Only needed if using Better Auth (not used here)
└── actions/
    └── auth.ts            # login, logout, createUser, resetPassword Server Actions
lib/
├── session.ts             # JWT encrypt/decrypt using jose; createSession, deleteSession
├── dal.ts                 # Data Access Layer: verifySession, getCurrentUser
├── prisma.ts              # PrismaClient singleton with PrismaPg adapter
└── utils.ts               # Existing cn() — no changes needed
proxy.ts                   # Route protection (renamed from middleware.ts in Next.js 16)
.env                       # DATABASE_URL, SESSION_SECRET
```

### Pattern 1: Prisma 7 Configuration (BREAKING CHANGE from prior versions)
**What:** Prisma 7 introduces a mandatory `prisma.config.ts` at the project root. The database URL moves from `schema.prisma` into this file. Driver adapters are required for all databases.
**When to use:** Always — this is the only supported configuration for Prisma 7.
**Example:**
```typescript
// prisma.config.ts — project root
import "dotenv/config"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
```

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
  // No url here — lives in prisma.config.ts
}
```

```typescript
// lib/prisma.ts — PrismaClient singleton
import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

### Pattern 2: Next.js 16 proxy.ts (BREAKING CHANGE — middleware.ts is deprecated)
**What:** In Next.js 16, `middleware.ts` is renamed to `proxy.ts`. The export is also renamed from `middleware` to `proxy`. The file convention is otherwise identical.
**When to use:** Route protection, redirecting unauthenticated users.
**Example:**
```typescript
// proxy.ts — project root (NOT middleware.ts)
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
import { NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/session"
import { cookies } from "next/headers"

const publicRoutes = ["/login"]

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = (await cookies()).get("session")?.value
  const session = await decrypt(cookie)

  if (!isPublicRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
```

### Pattern 3: Stateless JWT Sessions via jose
**What:** Session data stored as JWT in an HttpOnly cookie. The official Next.js auth guide recommends this pattern with jose.
**When to use:** This is the selected session strategy for this phase.
**Example:**
```typescript
// lib/session.ts
// Source: node_modules/next/dist/docs/01-app/02-guides/authentication.md
import "server-only"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: { userId: string; roles: string[]; mustChangePassword: boolean; expiresAt: Date }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, { algorithms: ["HS256"] })
    return payload
  } catch {
    return null
  }
}

export async function createSession(userId: string, roles: string[], mustChangePassword: boolean) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, roles, mustChangePassword, expiresAt })
  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
```

### Pattern 4: Data Access Layer (DAL) with React cache
**What:** Centralized auth verification using React's `cache()` to avoid duplicate DB calls per render.
**When to use:** All page-level and Server Action auth checks — never rely on middleware alone.
**Example:**
```typescript
// lib/dal.ts
// Source: node_modules/next/dist/docs/01-app/02-guides/authentication.md
import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { decrypt } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value
  const session = await decrypt(cookie)
  if (!session?.userId) redirect("/login")
  return { userId: session.userId as string, roles: session.roles as string[], mustChangePassword: session.mustChangePassword as boolean }
})

export const getCurrentUser = cache(async () => {
  const { userId } = await verifySession()
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, employeeId: true, name: true, roles: true },
  })
})
```

### Pattern 5: Server Actions for auth mutations
**What:** Login, logout, createUser, resetPassword as `'use server'` functions.
**When to use:** All form submissions that mutate auth state.

### Pattern 6: Forced password change flow
**What:** `mustChangePassword` boolean stored in JWT session and Prisma User model. On login, if `mustChangePassword === true`, redirect to `/change-password` instead of `/dashboard`. Only cleared after successful password change.
**When to use:** Seed admin first login (D-07) and admin-reset accounts (D-06).

### Pattern 7: Multi-role additive permissions
**What:** Roles stored as a Prisma enum array on User (`roles String[]` or a `UserRole` join table). Session JWT includes the roles array. Role checks in DAL use array inclusion (`roles.includes("ADMIN")`), never hierarchy.
**When to use:** All authorization checks across the application.

### Prisma User Schema for this phase
```prisma
enum UserRole {
  SUBJECT_TEACHER
  ADVISER
  PRINCIPAL
  REGISTRAR
  ADMIN
}

model User {
  id                 String     @id @default(cuid())
  employeeId         String     @unique
  name               String
  passwordHash       String
  roles              UserRole[]
  mustChangePassword Boolean    @default(true)
  isActive           Boolean    @default(true)
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt
}
```

### Anti-Patterns to Avoid
- **Using `middleware.ts`:** In Next.js 16, the file is `proxy.ts` and the export is `proxy`. Using the old name silently fails.
- **Auth checks only in proxy.ts:** Proxy is optimistic (reads cookie only); real authorization must be in the DAL, Server Actions, and Route Handlers.
- **Auth check in Layout:** Layouts don't re-render on navigation (Partial Rendering). Auth checks in layouts will not fire on every route change. Do auth checks in page components via the DAL.
- **Putting DATABASE_URL in schema.prisma:** Prisma 7 removed env() from the datasource block. It lives in `prisma.config.ts` now.
- **Importing `@prisma/client` directly:** In Prisma 7 with custom output, import from the generated path: `@/app/generated/prisma/client`.
- **Using `prisma-client-js` provider without the output field:** Prisma 7 requires `output` to be set explicitly when using `prisma-client` provider.
- **Storing roles array in JWT without a DB check:** For the dashboard, the session roles can be trusted for UI decisions (optimistic), but write operations must re-fetch roles from DB via DAL.
- **Using bcrypt (native) instead of bcryptjs:** bcrypt uses C++ native bindings that may fail in Next.js RSC/Server Action environment. bcryptjs is pure JS.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JWT signing/verification | Custom crypto | jose | Edge-compatible, handles algorithm selection, key encoding, expiry |
| Password hashing | Custom hash | bcryptjs | Bcrypt algorithm has proper work factor and salting; rolling your own is a security anti-pattern |
| DB connection singleton | New PrismaClient() per request | globalForPrisma singleton pattern | Next.js hot-reload creates multiple instances; singleton prevents connection pool exhaustion |
| Route protection | Manual checks in every page | proxy.ts + DAL | Proxy catches unauthenticated requests early; DAL provides secure re-verification close to data |
| Schema validation | Manual FormData checks | zod (already installed) | Type-safe, composable, returns structured errors that map to form fields |
| Session cookie options | Custom logic | createSession() helper with HttpOnly/SameSite/Secure flags | Easy to misconfigure cookie security attributes |

**Key insight:** The auth domain has a history of subtle security bugs in hand-rolled implementations. The officially recommended Next.js 16 pattern (jose + cookies API + proxy.ts) provides a solid, well-documented baseline without pulling in a full auth framework.

---

## Common Pitfalls

### Pitfall 1: middleware.ts silently ignored in Next.js 16
**What goes wrong:** You create `middleware.ts` with route protection. It appears to work in dev (webpack mode) but Turbopack silently ignores it. Routes are not protected.
**Why it happens:** Next.js 16 renamed the file convention to `proxy.ts`. The old name is deprecated.
**How to avoid:** Always use `proxy.ts` at the project root. Export `default async function proxy(...)`.
**Warning signs:** Unauthenticated users can access `/dashboard` without being redirected.

### Pitfall 2: Prisma 7 — URL still in schema.prisma
**What goes wrong:** `prisma migrate dev` fails or connects to wrong DB. Or dev server throws "Could not find datasource" errors.
**Why it happens:** Prisma 7 removed `env("DATABASE_URL")` from the datasource block in schema.prisma. The URL must live in `prisma.config.ts`.
**How to avoid:** Datasource block in schema.prisma has NO `url` field. Connection is configured only in `prisma.config.ts`.
**Warning signs:** `Error: Datasource URL was not found` or the default dev.db SQLite is used instead of PostgreSQL.

### Pitfall 3: Wrong import path for generated Prisma client
**What goes wrong:** TypeScript fails to find PrismaClient types; runtime errors like "Cannot find module '@prisma/client'".
**Why it happens:** Prisma 7 requires a custom `output` in the generator and the generated client is not at the default `@prisma/client` path.
**How to avoid:** Import from `"@/app/generated/prisma/client"` — not from `"@prisma/client"`.
**Warning signs:** TypeScript errors on PrismaClient import; runtime module not found errors.

### Pitfall 4: Turbopack bundling @prisma/client
**What goes wrong:** Build fails or dev server throws module resolution errors related to @prisma/client or pg.
**Why it happens:** Turbopack tries to bundle native Node packages that should stay external.
**How to avoid:** Add to `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "pg"],
}
```
**Warning signs:** Error messages like "Cannot create symlink to node_modules/@prisma/client" or cryptic webpack/turbopack resolution errors.

### Pitfall 5: Auth check in Layout component
**What goes wrong:** Auth check only runs on initial page load, not on navigation between routes. Attackers can navigate to protected routes after a session expires.
**Why it happens:** Next.js App Router Partial Rendering — layouts don't re-render on client-side navigation.
**How to avoid:** Never rely on a layout for auth checks. Use `verifySession()` from the DAL inside each page component and Server Action.
**Warning signs:** Protected content visible after session cookie expires without page reload.

### Pitfall 6: mustChangePassword bypass
**What goes wrong:** A user with `mustChangePassword: true` bypasses the forced password change by navigating directly to `/dashboard`.
**Why it happens:** Route protection in proxy.ts only checks authentication (is there a valid session?), not the mustChangePassword flag.
**How to avoid:** In proxy.ts, add a second check: if `session.mustChangePassword && path !== "/change-password"`, redirect to `/change-password`. Also check in the dashboard page via DAL.
**Warning signs:** Seed admin can access the full app with default credentials.

### Pitfall 7: Roles array — Prisma enum array vs join table
**What goes wrong:** PostgreSQL doesn't support enum arrays directly with Prisma in the same way as string arrays. Using `roles UserRole[]` requires `@db.Text` on SQLite but works differently on PostgreSQL with proper enum support.
**Why it happens:** Prisma's handling of enum arrays differs by database.
**How to avoid:** Use a many-to-many join table `UserRoleAssignment` with a `UserRole` enum for maximum query flexibility and future-proofing. Alternatively, verify Prisma 7 PostgreSQL enum array support before using `roles UserRole[]`.
**Warning signs:** Migration fails with type errors on the roles field.

### Pitfall 8: bcrypt vs bcryptjs in Server Actions
**What goes wrong:** `bcrypt` throws errors like "The edge runtime does not support Node.js 'crypto' module" or native binary binding errors.
**Why it happens:** `bcrypt` uses native C++ bindings; Next.js Server Actions may run in edge or restricted environments.
**How to avoid:** Use `bcryptjs` (pure JavaScript). Import as `import bcrypt from "bcryptjs"`.
**Warning signs:** Build errors mentioning native modules; runtime errors in Server Actions.

### Pitfall 9: Zod v4 API differences from v3
**What goes wrong:** Validation errors or TypeScript type mismatches when using Zod v4 schema definitions copied from v3 examples.
**Why it happens:** Zod v4 changed the error message API from `{ message: "..." }` to `{ error: "..." }` in some validators.
**How to avoid:** Use Zod v4 syntax: `z.string().min(2, { error: "..." })` not `{ message: "..." }`. The installed version is 4.3.6.
**Warning signs:** TypeScript errors on zod validation options; validation messages not appearing.

---

## Code Examples

Verified patterns from official sources:

### Login Server Action
```typescript
// app/actions/auth.ts
"use server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createSession } from "@/lib/session"

const LoginSchema = z.object({
  employeeId: z.string().min(1, { error: "Employee ID is required" }),
  password: z.string().min(1, { error: "Password is required" }),
})

export async function login(state: unknown, formData: FormData) {
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
    return { errors: { employeeId: ["Invalid credentials"] } }
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatch) {
    return { errors: { employeeId: ["Invalid credentials"] } }
  }

  await createSession(user.id, user.roles as string[], user.mustChangePassword)

  if (user.mustChangePassword) {
    redirect("/change-password")
  }

  redirect("/dashboard")
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}
```

### Seed Script
```typescript
// prisma/seed.ts
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  const passwordHash = await bcrypt.hash("Admin@1234", 12)
  await prisma.user.upsert({
    where: { employeeId: "admin" },
    update: {},
    create: {
      employeeId: "admin",
      name: "System Administrator",
      passwordHash,
      roles: ["ADMIN"],
      mustChangePassword: true,
    },
  })
  console.log("Seed complete. Admin employee ID: admin / Password: Admin@1234 (must change on first login)")
}

main().then(() => prisma.$disconnect()).catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
```

### Admin Create User Server Action (AUTH-01)
```typescript
// app/actions/users.ts
"use server"
import { verifySession } from "@/lib/dal"

export async function createUser(state: unknown, formData: FormData) {
  const session = await verifySession()

  // Only admins can create users
  if (!session.roles.includes("ADMIN")) {
    return { error: "Unauthorized" }
  }

  // ... validate and create user
}
```

### Role-Based Dashboard (AUTH-02)
```typescript
// app/(protected)/dashboard/page.tsx
import { verifySession } from "@/lib/dal"

export default async function DashboardPage() {
  const session = await verifySession()

  return (
    <div>
      {session.roles.includes("ADMIN") && <AdminSection />}
      {session.roles.includes("SUBJECT_TEACHER") && <TeacherSection />}
      {session.roles.includes("ADVISER") && <AdviserSection />}
      {session.roles.includes("PRINCIPAL") && <PrincipalSection />}
      {session.roles.includes("REGISTRAR") && <RegistrarSection />}
    </div>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` | `proxy.ts` (export: `proxy`) | Next.js 16 | Must rename file and export; old name silently ignored |
| URL in `schema.prisma` datasource | URL in `prisma.config.ts` | Prisma 7 | Cannot use `env("DATABASE_URL")` in schema anymore |
| `prisma-client-js` provider | `prisma-client` provider + required `output` | Prisma 7 | Import path changes to generated dir |
| `new PrismaClient()` directly | `new PrismaClient({ adapter })` | Prisma 7 | Driver adapter mandatory; no more built-in query engine |
| `import { PrismaClient } from "@prisma/client"` | `import { PrismaClient } from "@/app/generated/prisma/client"` | Prisma 7 | Generated client is no longer at the default package path |
| `prisma migrate dev` auto-runs generate + seed | Must run `prisma generate` and `prisma db seed` separately | Prisma 7 | Build scripts need updating |
| `z.string().min(2, { message: "..." })` | `z.string().min(2, { error: "..." })` | Zod v4 | Error key renamed from `message` to `error` in schema definitions |

**Deprecated/outdated:**
- `middleware.ts`: Deprecated in Next.js 16; replaced by `proxy.ts`
- `env("DATABASE_URL")` in schema.prisma datasource: Removed in Prisma 7
- `prisma-client-js` as generator provider: Deprecated in Prisma 7 (replaced by `prisma-client`)
- NextAuth.js v4 (current stable 4.x): Not recommended for new projects; Auth.js v5 beta exists but still in beta as of research date

---

## Open Questions

1. **Prisma 7 enum array for roles — join table vs scalar array**
   - What we know: `UserRole[]` on a model works in PostgreSQL. Prisma supports this.
   - What's unclear: Whether `prisma migrate dev` generates the correct PostgreSQL `UserRole[]` enum array column type, or whether a join table is safer for future queries (e.g., "find all teachers").
   - Recommendation: Use a join table `UserRoleAssignment` if the plan calls for complex role-based queries in later phases. For Phase 1 only, a scalar `roles UserRole[]` is simpler and Prisma 7 supports it on PostgreSQL.

2. **Turbopack compatibility with @prisma/adapter-pg**
   - What we know: Multiple sources confirm Turbopack issues with Prisma 7 in Next.js 16. `serverExternalPackages: ["@prisma/client", "pg"]` in next.config.ts is the fix.
   - What's unclear: Whether Next.js 16.2.1 (current version) has resolved these issues or still requires the config.
   - Recommendation: Add `serverExternalPackages` to next.config.ts as a defensive measure — it doesn't hurt if the issue is already fixed.

3. **Session cookie `secure: true` on local network (HTTP)**
   - What we know: The app is hosted locally on a school network, not HTTPS in dev/production.
   - What's unclear: Whether `secure: true` on the session cookie should be conditional on `NODE_ENV === "production"` or permanently `false` for this school intranet.
   - Recommendation: Use `secure: process.env.NODE_ENV === "production"` so local dev works over HTTP, and the production deployment over HTTPS (even on local network) gets the secure flag.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| PostgreSQL server | Prisma datasource | Yes | 17.2 | — |
| psql client | DB validation | Yes | 17.2 | — |
| Node.js | Runtime | Yes | 23.6.1 | — |
| pnpm | Package manager | Yes | 10.33.0 | — |
| Next.js | Framework | Yes | 16.2.1 | — |
| Zod | Form validation | Yes (installed) | 4.3.6 | — |
| @prisma/adapter-pg | Prisma 7 driver | Not installed | — | Install required |
| pg | PostgreSQL driver | Not installed | — | Install required |
| bcryptjs | Password hashing | Not installed | — | Install required |
| jose | JWT sessions | Not installed | — | Install required |
| dotenv | Env loading in seed/config | Not installed | — | Install required |
| tsx | Seed script runner | Not installed | — | Install required |
| server-only | DAL protection | Not installed | — | Install required |

**Missing dependencies with no fallback:**
- `@prisma/adapter-pg`, `pg`, `bcryptjs`, `jose`, `dotenv`, `tsx`, `server-only` — all must be installed in Wave 0 before any implementation tasks.

**No blocking external services:** PostgreSQL is running locally at localhost:5432 and accepting connections.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — Wave 0 must add |
| Config file | None — Wave 0 creates `vitest.config.ts` |
| Quick run command | `pnpm test` (after setup) |
| Full suite command | `pnpm test --run` |

No testing infrastructure exists in this project. Given Next.js 16 with RSC and Server Actions, the recommended test framework is **Vitest** (not Jest) because it supports ESM natively without transform configuration and aligns with the Vite ecosystem.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | Admin can create user with role | unit (Server Action) | `pnpm test -- tests/actions/users.test.ts` | No — Wave 0 |
| AUTH-02 | Login with Employee ID + password | unit (Server Action) | `pnpm test -- tests/actions/auth.test.ts` | No — Wave 0 |
| AUTH-02 | Role-appropriate dashboard sections render | smoke (manual) | Manual browser verification | N/A |
| AUTH-03 | Admin password reset sets mustChangePassword | unit (Server Action) | `pnpm test -- tests/actions/users.test.ts` | No — Wave 0 |
| AUTH-03 | Forced change flow redirects to /change-password | unit (proxy logic) | `pnpm test -- tests/lib/session.test.ts` | No — Wave 0 |
| AUTH-04 | Session cookie persists across refresh | smoke (manual) | Manual browser verification | N/A |

### Sampling Rate
- **Per task commit:** `pnpm test --run tests/lib/` (unit tests for session and dal)
- **Per wave merge:** `pnpm test --run` (full suite)
- **Phase gate:** Full suite green + manual smoke test of login/dashboard flow before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `vitest` + `@vitejs/plugin-react` — install as dev dependencies
- [ ] `vitest.config.ts` — framework configuration
- [ ] `tests/setup.ts` — shared test setup (mock prisma, mock cookies)
- [ ] `tests/lib/session.test.ts` — covers session encrypt/decrypt, mustChangePassword flag
- [ ] `tests/actions/auth.test.ts` — covers login happy path, wrong password, inactive user
- [ ] `tests/actions/users.test.ts` — covers createUser (admin only), resetPassword (admin only)

---

## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/01-app/02-guides/authentication.md` — full auth pattern: Server Actions, session management, DAL, proxy.ts, Role checks in Server Components
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` — proxy.ts API, migration from middleware.ts, export naming
- `https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7` — official Prisma 7 breaking changes list

### Secondary (MEDIUM confidence)
- `https://jb.desishub.com/blog/nextjs-with-prisma-7-and-postgres` — Prisma 7 + Next.js 16 setup walkthrough with `prisma.config.ts`, `db push` vs `migrate dev` note
- `https://medium.com/@gauravkmaurya09/guide-to-prisma-7-with-next-js-16-javascript-edition-99c8c4ca10be` — `prisma.config.mjs` variant, PrismaClient adapter pattern
- `https://better-auth.com/docs/integrations/next` — Better Auth proxy.ts setup for Next.js 16
- `https://better-auth.com/docs/plugins/username` — Username plugin limitations; does not support arbitrary non-email identifiers

### Tertiary (LOW confidence — for awareness)
- `https://medium.com/@chakhit.kanchana/fixes-the-issue-where-prisma-7-is-not-compatible-with-nextjs-16-564dc6979636` — Turbopack workaround via `--webpack` flag (drastic; `serverExternalPackages` is preferred)

---

## Project Constraints (from CLAUDE.md)

| Directive | Impact on This Phase |
|-----------|---------------------|
| Next.js 16 + PostgreSQL + Prisma decided | Auth approach must work with these; no SQLite fallback |
| shadcn/ui (radix-nova) for all UI components | Login form and change-password form use existing `Field`, `Input`, `Button` components — no raw HTML forms |
| No cloud dependency | No email-based password reset; session cookies work without cloud services |
| Role-based access control is mandatory | Multi-role array + additive permissions must be baked into the session JWT and DAL from day one |
| Read `node_modules/next/dist/docs/` before writing Next.js code | Done — key finding: `proxy.ts` replaces `middleware.ts` |
| `"use client"` on interactive components; RSC default | Login form must be `"use client"` to use `useActionState`; pages are RSC by default |
| No Prettier; ESLint with `strict: true` | Session/DAL code must pass strict TypeScript |
| `import type` for type-only imports | Use `import type { NextConfig }` etc. throughout |
| Tailwind v4 CSS-first (no tailwind.config.ts) | No Tailwind config changes needed for auth UI |

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Prisma 7 and Next.js 16 docs verified from local node_modules; package versions from npm registry
- Architecture: HIGH — patterns taken directly from official Next.js 16 authentication guide in node_modules/next/dist/docs/
- Pitfalls: HIGH for Next.js 16 / Prisma 7 breaking changes (verified from official docs); MEDIUM for Turbopack specifics (multiple community sources agree, not officially documented)

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (stable libraries; Prisma 7.x minor updates unlikely to break patterns)
