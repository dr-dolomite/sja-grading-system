# Phase 2: School Structure - Research

**Researched:** 2026-03-30
**Domain:** Prisma 7 schema design, Next.js 16 Server Actions, shadcn/ui tabbed admin UI
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Page Organization**
- D-01: Single "School Structure" page under `/dashboard/school-structure` with tabs: School Year, Grade Levels, Subjects. Uses existing shadcn Tabs component.
- D-02: Sections are managed inline under Grade Levels tab — click a grade level row to expand and see/add its sections. No separate Sections tab.
- D-03: Admin-only access. No read-only view for other roles.
- D-04: Sheet (slide-over panel) pattern for all creation/edit forms, consistent with Phase 1 Users page pattern.
- D-05: New "School Structure" item added to sidebar navigation, visible only when user has ADMIN role.

**School Year Setup**
- D-06: JHS grading periods (Q1-Q4) are auto-generated when a school year is created.
- D-07: SHS grading periods also auto-generated (Sem 1: Q1-Q2, Sem 2: Q3-Q4); subjects are manually configurable per grade level per year.
- D-08: One active school year at a time. Past years viewable but not editable. Admin sets up next year and "activates" it when ready.
- D-09: "Copy from previous year" feature — clone grade levels, sections, subjects, strands, then adjust.
- D-10: No explicit curriculum version tracking. Manual configuration naturally reflects different curricula.

**Subject Weight Configuration**
- D-11: DepEd weight presets per subject type. Admin picks type, weights auto-fill, can be overridden. Must sum to 100%.
- D-12: JHS subject types (DO 8, s. 2015 Table 4):
  - Languages (Filipino, English): WW 30%, PT 50%, QA 20%
  - AP/EsP: WW 40%, PT 40%, QA 20%
  - Science/Math: WW 40%, PT 40%, QA 20%
  - MAPEH/EPP/TLE: WW 20%, PT 60%, QA 20%
- D-13: SHS subject types — old curriculum (DO 8, s. 2015 Table 5):
  - Core Subjects: WW 25%, PT 50%, QA 25%
  - Academic Track (All other): WW 25%, PT 45%, QA 30%
  - Academic Track (Work Immersion/Research/etc.): WW 35%, PT 40%, QA 25%
- D-14: SHS subject types — new Strengthened curriculum (DM 074, s. 2025):
  - Core: WW 25%, PT 50%, QA 25%
  - Academic Electives: WW 25%, PT 45%, QA 30%
  - Academic Electives (Field Experience/Exposure/Sports and Arts): WW 20%, PT 60%, QA 20%
  - TechPro Electives: WW 15%, PT 65%, QA 20%
  - TechPro (Work Immersion): WW 20%, PT 80%, QA none (2-component only)
- D-15: School-specific Religious Education type, custom default weights, available for both JHS and SHS.
- D-16: Work Immersion subjects use WW+PT only (no QA). System enforces — not left to manual config.

**Section & Strand**
- D-17: JHS vs SHS auto-detected by grade level: G7-G10 = JHS, G11-G12 = SHS.
- D-18: Strand assignment is per-section. Each G11/G12 section belongs to one strand.
- D-19: Sections use named convention (admin types a name, e.g., "St. John", "Charity").
- D-20: Strands are fully configurable. System pre-populates STEM, ABM, HUMSS, GAS as defaults.
- D-21: SJA currently offers Academic track only. TechPro subject types included for future use.

**Dual Curriculum Support**
- D-22: Effective Communication / Mabisang Komunikasyon modeled as two linked subjects, each graded independently. System auto-computes combined average for report card.
- D-23: Subject duration rules (DM 074, s. 2025 §12):
  - Core Subjects: 4 quarters → Final Grade = avg of 4 quarterly grades
  - Academic Electives: 2 quarters per semester → Semester Grade
  - TechPro Electives (G11): 4 quarters → Final Grade = avg of 4 quarterly grades
  - TechPro Electives (G12): 2 quarters per semester → Semester Grade

### Claude's Discretion
- Tab order and default active tab on the School Structure page
- Exact layout of expandable grade level → sections inline view
- How the "copy from previous year" workflow is presented (modal confirmation, preview of what will be copied, etc.)
- Default weight values for the School-specific (Religious Education) subject type

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| STRUCT-01 | Admin can define school years with quarters (Q1-Q4) for JHS and semesters (Sem 1-2) for SHS | Schema: SchoolYear + GradingPeriod with periodType enum; auto-generation logic in Server Action |
| STRUCT-02 | Admin can manage grade levels (G7-G12) with multiple sections per level | Schema: GradeLevel (fixed enum G7-G12) + Section model; inline expand pattern from D-02 |
| STRUCT-03 | Admin can assign SHS strands (STEM, ABM, HUMSS, GAS) to sections | Schema: Strand model (user-configurable) + Section.strandId FK; pre-seeded defaults |
| STRUCT-04 | Admin can register subjects with type and DepEd grading component weights | Schema: Subject + SubjectType with weight fields; preset system from D-11; 2-component enforcement from D-16 |
</phase_requirements>

---

## Summary

Phase 2 establishes all structural master data that every subsequent phase depends on. It is primarily a data-modeling and admin-CRUD problem: design a Prisma schema that captures the DepEd-mandated school hierarchy, build Server Actions to mutate it, and wire a multi-tab admin UI using patterns already established in Phase 1.

The most complex parts are (1) the `SubjectType` preset system — many hardcoded weight combinations that must be modeled clearly — and (2) the two-component Work Immersion enforcement (D-16), which requires a database-level distinction between 2-component and 3-component subjects. The "copy from previous year" feature (D-09) is the largest atomic Server Action: it must clone multiple related records in one transaction.

The UI surface is well-defined: one page, three tabs, Sheet forms for creation, inline section expansion under Grade Levels. All required shadcn/ui components already exist. The Prisma + Server Action + RSC page pattern is identical to Phase 1's Users page.

**Primary recommendation:** Design the schema first — every other decision follows from it. Use a `SubjectTypeKey` enum to drive preset lookup; store weights as plain integers (not floats) representing percentage points; enforce Work Immersion's 2-component rule at the schema level with a boolean `hasQuarterlyAssessment` flag.

---

## Standard Stack

### Core (already installed — no new installations needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Prisma | 7.6.0 | Schema definition, migrations, type-safe queries | Project standard; Prisma 7 breaking changes already accounted for (adapter-pg, no DATABASE_URL in schema) |
| Next.js | 16.2.1 | App Router, RSC pages, Server Actions | Project standard |
| React | 19.2.4 | useActionState, useOptimistic for form state | Project standard |
| Zod | 4.3.6 | Server Action input validation | Already used in Phase 1; v4 syntax in use |
| shadcn/ui | 4.1.1 | Tabs, Sheet, Table, Badge, Select, Input components | Already installed; all needed components present |

### Supporting (already installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| sonner | 2.0.7 | Toast notifications for success/error feedback | Every Server Action mutation |
| lucide-react | 1.7.0 | Icons for UI chrome | ChevronDown for expand, PlusIcon for add, etc. |
| vitest | 4.1.2 | Unit tests for business logic | Weight preset computation, sum validation |

### Alternatives Considered

None applicable — all decisions locked to existing stack.

**Installation:** No new packages required. Everything needed is already installed.

---

## Architecture Patterns

### Recommended Project Structure

```
app/
├── dashboard/
│   └── school-structure/
│       └── page.tsx             # RSC page — auth gate + data fetch + tab shell
app/actions/
│   └── school-structure.ts      # All Server Actions for this phase
components/
│   ├── school-year-tab.tsx      # "use client" tab content component
│   ├── grade-levels-tab.tsx     # "use client" expandable grade levels
│   ├── subjects-tab.tsx         # "use client" subjects list
│   ├── create-school-year-sheet.tsx
│   ├── create-section-sheet.tsx
│   └── create-subject-sheet.tsx
prisma/
│   └── schema.prisma            # Extended with 7 new models
```

### Pattern 1: RSC Page + Client Tab Shell (established in Phase 1)

**What:** The page.tsx is a server component that verifies the session, fetches all initial data (school years, grade levels, sections, subjects), and passes it as props to a client component. The client component owns tab state.

**When to use:** When a page has multiple views (tabs) sharing the same auth context but different data subsets.

**Example (from Phase 1 baseline):**
```typescript
// app/dashboard/school-structure/page.tsx (RSC)
import { verifySession } from "@/lib/dal"
import { redirect } from "next/navigation"
import { getSchoolStructureData } from "@/app/actions/school-structure"
import { SchoolStructureTabs } from "@/components/school-structure-tabs"

export default async function SchoolStructurePage() {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    redirect("/dashboard")
  }

  const data = await getSchoolStructureData()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-semibold">School Structure</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure school years, grade levels, sections, and subjects.
        </p>
      </div>
      <div className="px-4 lg:px-6">
        <SchoolStructureTabs {...data} />
      </div>
    </div>
  )
}
```

### Pattern 2: Server Action with Nested Transaction (new in this phase)

**What:** The "copy from previous year" action must clone SchoolYear, GradingPeriod, GradeLevel, Section, Strand, and Subject records in a single `prisma.$transaction()` call.

**When to use:** Any mutation that touches multiple related tables and must succeed or fail atomically.

**Example:**
```typescript
// app/actions/school-structure.ts
"use server"

export async function copyFromPreviousYear(
  _prevState: CopyYearState,
  formData: FormData
): Promise<CopyYearState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const sourceYearId = formData.get("sourceYearId") as string
  const newYearLabel = (formData.get("yearLabel") as string)?.trim()

  // validate ...

  await prisma.$transaction(async (tx) => {
    const newYear = await tx.schoolYear.create({ data: { label: newYearLabel } })
    // create grading periods
    // clone grade levels + sections + strands + subjects
  })

  revalidatePath("/dashboard/school-structure")
  return { success: true }
}
```

### Pattern 3: Inline Expand (new UI pattern — Claude's discretion)

**What:** Grade Levels tab shows a table row per grade level. Clicking a row (or a chevron) expands an inline section showing that level's sections. No navigation or modal.

**When to use:** Parent-child relationships where child count is small (sections per grade level: typically 3-8).

**Implementation approach:** Client component with a `Set<string>` of expanded grade level IDs in `useState`. Toggle on row click, render child rows immediately below the parent row in the same `<Table>`.

```typescript
// Sketch — expandable pattern
"use client"
const [expanded, setExpanded] = useState<Set<string>>(new Set())

function toggleExpand(id: string) {
  setExpanded(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
}
```

### Pattern 4: Weight Preset System

**What:** When admin selects a SubjectTypeKey (e.g., "JHS_SCIENCE_MATH"), the form auto-populates WW/PT/QA percentage fields from a client-side lookup table. Admin can override values. On submit, the Server Action validates that values sum to 100 (or 100 for 3-component, and WW+PT=100 for Work Immersion).

**Client-side lookup (no round-trip):**
```typescript
// lib/subject-type-presets.ts
export const SUBJECT_TYPE_PRESETS: Record<string, {
  label: string
  curriculum: "JHS" | "SHS_OLD" | "SHS_NEW" | "SCHOOL"
  hasQuarterlyAssessment: boolean
  defaultWW: number
  defaultPT: number
  defaultQA: number | null
}> = {
  JHS_LANGUAGES: {
    label: "Languages (Filipino, English)",
    curriculum: "JHS",
    hasQuarterlyAssessment: true,
    defaultWW: 30, defaultPT: 50, defaultQA: 20,
  },
  JHS_AP_ESP: {
    label: "AP / EsP",
    curriculum: "JHS",
    hasQuarterlyAssessment: true,
    defaultWW: 40, defaultPT: 40, defaultQA: 20,
  },
  JHS_SCIENCE_MATH: {
    label: "Science / Math",
    curriculum: "JHS",
    hasQuarterlyAssessment: true,
    defaultWW: 40, defaultPT: 40, defaultQA: 20,
  },
  JHS_MAPEH_EPP_TLE: {
    label: "MAPEH / EPP / TLE",
    curriculum: "JHS",
    hasQuarterlyAssessment: true,
    defaultWW: 20, defaultPT: 60, defaultQA: 20,
  },
  SHS_OLD_CORE: {
    label: "Core Subjects (old curriculum)",
    curriculum: "SHS_OLD",
    hasQuarterlyAssessment: true,
    defaultWW: 25, defaultPT: 50, defaultQA: 25,
  },
  SHS_OLD_ACADEMIC_OTHER: {
    label: "Academic Track — Other",
    curriculum: "SHS_OLD",
    hasQuarterlyAssessment: true,
    defaultWW: 25, defaultPT: 45, defaultQA: 30,
  },
  SHS_OLD_WORK_IMMERSION: {
    label: "Work Immersion / Research (old curriculum)",
    curriculum: "SHS_OLD",
    hasQuarterlyAssessment: false,
    defaultWW: 35, defaultPT: 40, defaultQA: null,
  },
  SHS_NEW_CORE: {
    label: "Core (Strengthened)",
    curriculum: "SHS_NEW",
    hasQuarterlyAssessment: true,
    defaultWW: 25, defaultPT: 50, defaultQA: 25,
  },
  SHS_NEW_ACADEMIC_ELECTIVE: {
    label: "Academic Electives",
    curriculum: "SHS_NEW",
    hasQuarterlyAssessment: true,
    defaultWW: 25, defaultPT: 45, defaultQA: 30,
  },
  SHS_NEW_ACADEMIC_FIELD: {
    label: "Academic Electives — Field Experience / Sports & Arts",
    curriculum: "SHS_NEW",
    hasQuarterlyAssessment: true,
    defaultWW: 20, defaultPT: 60, defaultQA: 20,
  },
  SHS_NEW_TECHPRO_ELECTIVE: {
    label: "TechPro Electives",
    curriculum: "SHS_NEW",
    hasQuarterlyAssessment: true,
    defaultWW: 15, defaultPT: 65, defaultQA: 20,
  },
  SHS_NEW_WORK_IMMERSION: {
    label: "TechPro — Work Immersion",
    curriculum: "SHS_NEW",
    hasQuarterlyAssessment: false,
    defaultWW: 20, defaultPT: 80, defaultQA: null,
  },
  SCHOOL_RELIGIOUS_ED: {
    label: "Religious Education (school-specific)",
    curriculum: "SCHOOL",
    hasQuarterlyAssessment: true,
    defaultWW: 30, defaultPT: 50, defaultQA: 20, // Claude discretion defaults
  },
}
```

### Anti-Patterns to Avoid

- **Storing weights as floats:** Use integers (percentage points). `30 + 50 + 20 = 100` is exact. Float arithmetic can produce `99.99999...` and break validation.
- **Encoding subject type as a free-text string:** Use an enum or fixed key. Free text means preset lookup breaks when admin types "jhs languages" vs "JHS Languages".
- **Separate API routes for CRUD:** The project uses Server Actions exclusively. No `app/api/` routes.
- **Fetching data in client components:** Data fetched in the RSC page and passed as props. Client components mutate via Server Actions + `revalidatePath`.
- **Middleware for auth gating:** Phase 1 established `proxy.ts` for middleware (Next.js 16 Turbopack incompatibility with `middleware.ts`); page-level `verifySession()` for role gating.
- **Using `prisma.schoolYear.findMany()` inside a Server Action that also mutates:** Separate read helpers (non-actions) from write actions. See Phase 1 pattern: `getUsers()` is a plain `async function`, not a Server Action.

---

## Prisma Schema Design

### Recommended Schema (complete)

This is the definitive model set for Phase 2. All subsequent phases depend on it being correct.

```prisma
// Append to prisma/schema.prisma

enum GradeLevel {
  G7
  G8
  G9
  G10
  G11
  G12
}

enum PeriodType {
  Q1
  Q2
  Q3
  Q4
}

// A named school year, e.g., "2025-2026"
model SchoolYear {
  id            String          @id @default(cuid())
  label         String          @unique // e.g., "2025-2026"
  isActive      Boolean         @default(false)
  gradingPeriods GradingPeriod[]
  gradeLevels   GradeLevelEntry[]
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

// Q1-Q4 for JHS; Q1-Q4 for SHS (grouped into Sem1/Sem2 by convention)
model GradingPeriod {
  id           String     @id @default(cuid())
  schoolYearId String
  periodType   PeriodType
  schoolYear   SchoolYear @relation(fields: [schoolYearId], references: [id], onDelete: Cascade)

  @@unique([schoolYearId, periodType])
}

// Links a GradeLevel to a SchoolYear (G7-G12 must be set up per year)
model GradeLevelEntry {
  id           String    @id @default(cuid())
  schoolYearId String
  gradeLevel   GradeLevel
  schoolYear   SchoolYear @relation(fields: [schoolYearId], references: [id], onDelete: Cascade)
  sections     Section[]

  @@unique([schoolYearId, gradeLevel])
}

// A configurable strand (STEM, ABM, HUMSS, GAS, or admin-defined)
model Strand {
  id        String    @id @default(cuid())
  name      String    @unique // e.g., "STEM", "ABM"
  isActive  Boolean   @default(true)
  sections  Section[]
  createdAt DateTime  @default(now())
}

// A named section within a grade level for a school year
model Section {
  id               String          @id @default(cuid())
  name             String          // e.g., "St. John", "Charity"
  gradeLevelEntryId String
  strandId         String?         // null for JHS sections
  gradeLevelEntry  GradeLevelEntry @relation(fields: [gradeLevelEntryId], references: [id], onDelete: Cascade)
  strand           Strand?         @relation(fields: [strandId], references: [id])

  @@unique([gradeLevelEntryId, name])
}

// A subject registered in the system
model Subject {
  id                    String   @id @default(cuid())
  name                  String
  subjectTypeKey        String   // FK to SubjectTypePreset key (e.g., "JHS_SCIENCE_MATH")
  writtenWorkPct        Int      // integer percentage, e.g., 40
  performanceTaskPct    Int      // integer percentage, e.g., 40
  quarterlyAssessmentPct Int?    // null for Work Immersion subjects (D-16)
  hasQuarterlyAssessment Boolean @default(true)
  linkedSubjectId       String?  // for Effective Communication pairing (D-22)
  linkedSubject         Subject? @relation("LinkedSubjects", fields: [linkedSubjectId], references: [id])
  linkedBy              Subject[] @relation("LinkedSubjects")
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

### Key Schema Decisions

**GradeLevelEntry vs. a fixed GradeLevel model:**
G7-G12 are fixed by DepEd — they do not change. But their existence per school year must be tracked (each year, admin sets up which grade levels operate). `GradeLevelEntry` is the join table between `SchoolYear` and a `GradeLevel` enum value. This avoids a separate `GradeLevel` model with no user-configurable fields.

**Strand as a separate model:**
Strands are user-configurable (D-20). The system pre-seeds STEM/ABM/HUMSS/GAS but admin can add or rename. A separate `Strand` model with a seeded migration handles this.

**SubjectTypeKey as a plain String, not a Prisma enum:**
The preset keys live in `lib/subject-type-presets.ts` (client + server shared). Using a Prisma enum would require a migration for every new subject type. Using a validated string constant avoids that. The Server Action validates the key against `Object.keys(SUBJECT_TYPE_PRESETS)` before saving.

**Weights as Int, not Float:**
All weight values are whole percentages (0-100). `Int` prevents floating-point precision errors in the 100% sum check.

**`hasQuarterlyAssessment` boolean + nullable `quarterlyAssessmentPct`:**
Two fields encode the Work Immersion rule (D-16). `hasQuarterlyAssessment = false` means the system enforces 2-component grading downstream. `quarterlyAssessmentPct = null` makes the constraint machine-readable. Both together are redundant but explicit — the boolean is the single source of truth for the grading engine in Phase 4.

**Subject linking for Effective Communication (D-22):**
Self-referential optional FK `linkedSubjectId`. Phase 4 will use this to auto-compute the combined average. Storing the link at subject creation avoids needing it to be set up at grading time.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Weight sum validation | Custom sum checker | Zod `.refine()` in the Server Action schema | Zod handles conditional validation (2-component vs 3-component) cleanly |
| Cascading deletes | Manual delete of children | `onDelete: Cascade` on Prisma relations | Prisma handles the SQL FK cascade; safe for this data model |
| Transaction for copy | Sequential individual creates | `prisma.$transaction(async tx => ...)` | Atomic — if any clone step fails, nothing is saved |
| Tab state | Custom state machine | React `useState` with a tab string | shadcn Tabs already manages its own state via `value` prop |
| Preset lookup on client | API route for presets | Static `lib/subject-type-presets.ts` module | No network round-trip; the presets are compile-time constants |

**Key insight:** The weight preset system is pure data — a TypeScript object literal. Don't make it a database table or an API call. Import it directly in both the form component and the Server Action validator.

---

## Common Pitfalls

### Pitfall 1: Zod v4 Syntax Change

**What goes wrong:** Using Zod v3 error message syntax `z.string().min(1, "message")` — the second argument was a string in v3, now it's `{ error: "message" }` in v4.

**Why it happens:** Training data reflects Zod v3. The project already uses Zod 4.3.6 and v4's `{ error: ... }` syntax (visible in `app/actions/users.ts`).

**How to avoid:** Follow the exact pattern already in `app/actions/users.ts`:
```typescript
z.string().min(1, { error: "School year label is required." })
```

**Warning signs:** TypeScript error on the second argument to `.min()`, `.max()`, etc.

---

### Pitfall 2: prisma.$transaction vs Interactive Transactions

**What goes wrong:** Using a sequential array transaction (`prisma.$transaction([op1, op2])`) when operations inside need to read newly created IDs.

**Why it happens:** The "copy from previous year" action creates a SchoolYear, then needs its ID for GradingPeriod creates, then needs GradeLevelEntry IDs for Section creates, etc.

**How to avoid:** Always use the callback form for dependent operations:
```typescript
await prisma.$transaction(async (tx) => {
  const newYear = await tx.schoolYear.create({ ... })
  await tx.gradingPeriod.createMany({
    data: ["Q1","Q2","Q3","Q4"].map(p => ({ schoolYearId: newYear.id, periodType: p }))
  })
  // ... continue using newYear.id
})
```

**Warning signs:** TypeScript error "result may be undefined" when trying to use IDs from the array form.

---

### Pitfall 3: Active School Year Uniqueness

**What goes wrong:** Two school years both have `isActive = true` after an "activate" operation, because the activation doesn't first deactivate the previous active year in a transaction.

**Why it happens:** Two separate Prisma calls — deactivate old, activate new — can interleave if two admin sessions act simultaneously, or fail midway.

**How to avoid:** Use a transaction that first sets all years inactive, then sets the target active:
```typescript
await prisma.$transaction([
  prisma.schoolYear.updateMany({ data: { isActive: false } }),
  prisma.schoolYear.update({ where: { id: targetId }, data: { isActive: true } }),
])
```

**Warning signs:** `@@unique` cannot enforce this — it's a business rule, not a DB constraint. The transaction is mandatory.

---

### Pitfall 4: Section Unique Constraint Across Years

**What goes wrong:** Making section names globally unique, when they only need to be unique within a grade level entry (which is already year-scoped).

**Why it happens:** Thinking of sections as globally named entities, when they are year-and-level scoped.

**How to avoid:** The composite unique is `@@unique([gradeLevelEntryId, name])` — not a global unique on `name`. This allows "St. John" to exist in both G7 2024-2025 and G7 2025-2026.

---

### Pitfall 5: Weight Sum for 2-Component Subjects

**What goes wrong:** Validating that WW + PT + QA = 100 for Work Immersion subjects, when QA should be null and WW + PT should sum to 100.

**Why it happens:** Generic "sum must be 100" validation doesn't account for the 2-component case.

**How to avoid:** In the Zod schema, use `.superRefine()` or `.refine()` with conditional logic:
```typescript
.refine(
  (data) => {
    if (!data.hasQuarterlyAssessment) {
      return data.writtenWorkPct + data.performanceTaskPct === 100
    }
    return data.writtenWorkPct + data.performanceTaskPct + (data.quarterlyAssessmentPct ?? 0) === 100
  },
  { error: "Component weights must sum to 100%." }
)
```

---

### Pitfall 6: Prisma 7 — DATABASE_URL in prisma.config.ts only

**What goes wrong:** Adding `url = env("DATABASE_URL")` to the `datasource db {}` block in `schema.prisma`.

**Why it happens:** Prisma 7 breaking change: connection string is now configured in `prisma.config.ts` via the adapter, not in `schema.prisma`. Phase 1 already established this pattern in `lib/prisma.ts` and `prisma/seed.ts`.

**How to avoid:** Never add `url` to the datasource block. The existing `prisma.config.ts` pattern is correct. When adding new models, only edit `schema.prisma` for model definitions.

---

### Pitfall 7: revalidatePath after Server Action

**What goes wrong:** After a Server Action mutates the database, the UI does not refresh because `revalidatePath` was not called.

**Why it happens:** Next.js caches RSC page output. Without invalidation, the stale data is served.

**How to avoid:** Every Server Action that mutates data must call `revalidatePath("/dashboard/school-structure")` before returning. See Phase 1 pattern in `app/actions/users.ts`.

---

### Pitfall 8: Sidebar navigation — client component constraint

**What goes wrong:** Trying to pass server-only data (like calling `verifySession()`) directly inside `app-sidebar.tsx` to determine nav visibility.

**Why it happens:** `app-sidebar.tsx` is `"use client"`. Server functions cannot run in client components.

**How to avoid:** The established pattern (from Phase 1) is: the dashboard layout calls `getCurrentUser()` (server side) and passes `user.roles` as a prop to `AppSidebar`. Add the "School Structure" nav item inside `AppSidebar.navItems` with `visible: user.roles.includes("ADMIN")`. No changes to the layout data-fetching layer needed — only add to the nav array.

---

## Code Examples

Verified patterns from project source (Phase 1):

### Server Action with Auth Gate and Zod v4 Validation

```typescript
// Source: app/actions/users.ts (Phase 1 — verified pattern)
"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/dal"

const CreateSchoolYearSchema = z.object({
  label: z.string().min(1, { error: "School year label is required." }),
})

export type CreateSchoolYearState = {
  errors?: { label?: string[]; form?: string[] }
  success?: boolean
} | null

export async function createSchoolYear(
  _prevState: CreateSchoolYearState,
  formData: FormData
): Promise<CreateSchoolYearState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const validated = CreateSchoolYearSchema.safeParse({ label: formData.get("label") })
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const existing = await prisma.schoolYear.findUnique({ where: { label: validated.data.label } })
  if (existing) {
    return { errors: { label: ["A school year with this label already exists."] } }
  }

  const newYear = await prisma.schoolYear.create({
    data: { label: validated.data.label },
  })

  // Auto-generate Q1-Q4 grading periods (D-06)
  await prisma.gradingPeriod.createMany({
    data: (["Q1", "Q2", "Q3", "Q4"] as const).map(p => ({
      schoolYearId: newYear.id,
      periodType: p,
    })),
  })

  revalidatePath("/dashboard/school-structure")
  return { success: true }
}
```

### Client Sheet Form with useActionState

```typescript
// Source: components/create-user-sheet.tsx (Phase 1 — verified pattern)
"use client"

import { useActionState, useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createSchoolYear } from "@/app/actions/school-structure"
import type { CreateSchoolYearState } from "@/app/actions/school-structure"

export function CreateSchoolYearSheet() {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState<CreateSchoolYearState, FormData>(
    createSchoolYear, null
  )

  useEffect(() => {
    if (state?.success) {
      toast.success("School year created.")
      setOpen(false)
    }
    if (state?.errors?.form) toast.error(state.errors.form[0])
  }, [state])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button><PlusIcon className="size-4" />Add School Year</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader><SheetTitle>Add School Year</SheetTitle></SheetHeader>
        <form action={formAction} className="flex flex-col gap-4 px-4 pt-4">
          {/* fields */}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
```

### Activating a School Year (transaction pattern)

```typescript
// Atomic activation — deactivate all, then activate target
export async function activateSchoolYear(
  _prevState: ActivateYearState,
  formData: FormData
): Promise<ActivateYearState> {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  const targetId = formData.get("schoolYearId") as string
  if (!targetId) return { errors: { form: ["School year ID is required."] } }

  await prisma.$transaction([
    prisma.schoolYear.updateMany({ data: { isActive: false } }),
    prisma.schoolYear.update({ where: { id: targetId }, data: { isActive: true } }),
  ])

  revalidatePath("/dashboard/school-structure")
  return { success: true }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Middleware for auth (middleware.ts) | proxy.ts at root (Phase 1 established) | Next.js 16 + Turbopack | Don't add middleware.ts; proxy.ts is the route guard |
| DATABASE_URL in schema.prisma datasource | adapter-pg + prisma.config.ts | Prisma 7 | Already in place; don't break it |
| Zod v3 `.min(1, "message")` string errors | Zod v4 `.min(1, { error: "message" })` | Zod 4.0 | Already in use; follow existing pattern |
| API routes for data mutations | Server Actions | Next.js 13.4+ | All mutations go in `app/actions/` |

---

## Open Questions

1. **MAPEH sub-subject modeling**
   - What we know: DO 8, s. 2015 specifies that MAPEH quarterly grade = average of Music, Arts, PE, Health quarterly grades. The CONTEXT.md `<specifics>` section confirms this affects subject modeling.
   - What's unclear: Should MAPEH be modeled as one subject with 4 sub-subjects in Phase 2, or as 4 separate subjects that Phase 4 (grading) computes an average from? The CONTEXT.md `<specifics>` mentions this affects "how MAPEH sub-subjects are modeled" but deferred the decision.
   - Recommendation: Create a flag `isMapehComponent` on `Subject` and a `parentSubjectId` self-referential FK, identical to the Effective Communication link pattern (D-22). Phase 4 will handle the averaging. This is low-risk to add now and avoids a migration during Phase 4. If the planner wants to defer, the `linkedSubjectId` approach from D-22 already covers the self-reference pattern.

2. **Strand seeding strategy**
   - What we know: D-20 says pre-populate STEM, ABM, HUMSS, GAS as defaults.
   - What's unclear: Should default strands be added to the Phase 2 migration seed, or to `prisma/seed.ts` (which only runs once on first setup)?
   - Recommendation: Add a migration that inserts the 4 strands if they don't exist (`INSERT ... ON CONFLICT DO NOTHING`). This ensures they exist in all environments including test/CI without requiring manual seed re-runs.

3. **"Copy from previous year" — what exactly gets cloned**
   - What we know: D-09 says "clone grade levels, sections, subjects, and strands from the previous year." Strands are global (not year-scoped), so they don't need copying — just the association.
   - What's unclear: Does subject assignment (which subjects belong to which grade level in a year) exist in Phase 2, or only in Phase 3 (enrollment)?
   - Recommendation: Phase 2 only needs subjects to be registered in the system (not yet assigned to sections/grade levels). "Copy from previous year" for subjects means cloning Subject records with the same names and weights. Grade-level-to-subject assignment is an enrollment concern (Phase 3).

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| PostgreSQL | Prisma migrations | Unknown — active blocker from STATE.md | — | None — must resolve credentials first |
| Node.js | All | Available | 23.6.1 | — |
| pnpm | Package management | Available | 10.24.0 | — |
| Prisma CLI | Schema migrations | Available (devDependency) | 7.6.0 | — |

**Active blocker from STATE.md:** "PostgreSQL credentials: `postgres` user password unknown. Must update `.env` DATABASE_URL with correct password before running `prisma migrate dev`."

**Impact on planning:** Every plan that touches the database (migration, seed) must either (a) note this blocker and instruct the executor to resolve it first, or (b) be structured so schema changes come before the migration step with an explicit checkpoint.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.ts` |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| STRUCT-01 | School year creation auto-generates Q1-Q4 grading periods | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | No — Wave 0 |
| STRUCT-01 | Activating a school year deactivates all others atomically | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | No — Wave 0 |
| STRUCT-01 | Duplicate school year label is rejected | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | No — Wave 0 |
| STRUCT-02 | Admin can create a section under a grade level entry | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | No — Wave 0 |
| STRUCT-02 | Duplicate section name within same grade level entry is rejected | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | No — Wave 0 |
| STRUCT-03 | Section can be assigned a strand; JHS sections must not require strand | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | No — Wave 0 |
| STRUCT-04 | Subject weight sum validates to 100 (3-component) | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | No — Wave 0 |
| STRUCT-04 | Work Immersion subject WW+PT sums to 100, QA is null | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | No — Wave 0 |
| STRUCT-04 | Subject type preset system returns correct weights for each key | unit | `pnpm test -- --reporter=verbose tests/lib/subject-type-presets.test.ts` | No — Wave 0 |

### Sampling Rate

- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/actions/school-structure.test.ts` — covers STRUCT-01, STRUCT-02, STRUCT-03, STRUCT-04
- [ ] `tests/lib/subject-type-presets.test.ts` — covers STRUCT-04 preset logic
- [ ] Extend `tests/setup.ts` mock for new Prisma models: `schoolYear`, `gradingPeriod`, `gradeLevelEntry`, `strand`, `section`, `subject`

---

## Sources

### Primary (HIGH confidence)

- Project source: `app/actions/users.ts` — verified Zod v4 syntax, Server Action pattern, revalidatePath usage
- Project source: `components/create-user-sheet.tsx` — verified Sheet form + useActionState pattern
- Project source: `prisma/schema.prisma` — verified Prisma 7 model syntax without datasource url
- Project source: `lib/prisma.ts` — verified adapter-pg pattern
- Project source: `tests/setup.ts` — verified Vitest mock setup pattern
- Project source: `components/app-sidebar.tsx` — verified role-based nav item pattern
- Phase 1 CONTEXT.md decisions D-01 through D-10 — established patterns for auth gating, sidebar, Sheet
- `node_modules/next/dist/docs/01-app/02-guides/forms.md` — Next.js 16 Server Actions guide
- `package.json` — verified all dependency versions

### Secondary (MEDIUM confidence)

- CONTEXT.md D-11 through D-23 — user-locked decisions for subject weight presets and dual curriculum rules (from discussion, not independently verified against DepEd PDFs — PDFs not available in this environment)
- Prisma 7 `$transaction` callback form — known from training data, consistent with Phase 1 `prisma.user.create` patterns

### Tertiary (LOW confidence)

- MAPEH sub-subject modeling approach — proposed solution, no prior precedent in codebase

---

## Project Constraints (from CLAUDE.md)

| Constraint | Directive |
|------------|-----------|
| Tech stack | Next.js 16 + PostgreSQL + Prisma — already decided |
| UI components | shadcn/ui (radix-nova style) exclusively — no other UI libraries |
| Hosting | Local network — no cloud services |
| Compliance | Must follow DepEd grading component weights and computation rules |
| Data sensitivity | Role-based access control mandatory — admin-only for school structure |
| Templates | System must support pluggable template rendering (future) — no impact on Phase 2 |
| GSD Workflow | All changes must go through GSD workflow — no direct repo edits |
| TypeScript | strict: true — all code must pass strict type checks |
| Module resolution | `@/*` resolves to project root |
| Components | Named exports for utilities/components; default exports for pages/layouts |
| No Prettier | No auto-formatting — follow 2-space indent, no trailing semicolons in component files |
| Import type | Use `import type` syntax for type-only imports |
| Next.js docs | MUST read `node_modules/next/dist/docs/` before writing Next.js code |

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages are already installed and in use
- Schema design: HIGH — follows established Prisma 7 patterns from Phase 1; model relationships are straightforward relational design
- Architecture patterns: HIGH — directly extends Phase 1 patterns with no new frameworks
- Preset system: HIGH — pure TypeScript constants, no external dependency
- Pitfalls: HIGH — sourced from Phase 1 codebase and Prisma 7 breaking changes already observed
- MAPEH sub-subject modeling: LOW — proposed but not validated against DepEd PDF specifics

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (stable tech stack; no moving parts)
