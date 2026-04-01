# Phase 3: Enrollment & Assignment — Research

**Researched:** 2026-04-02
**Domain:** Next.js 16 App Router, Prisma 7, React 19, shadcn/ui — student profiles, auto-enrollment, teacher/adviser assignment, CSV bulk import
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Student Profile Fields**
- D-01: Minimal profile — name (first, middle, last), grade level, section, strand (SHS only), sex, LRN (required), contact number (optional). No photo, address, or parent info for v1.
- D-02: LRN is required on every student profile. DepEd standard student identifier.

**Student List & Navigation**
- D-03: Filter-by-section pattern — picks grade level, then section from dropdowns. Table shows students in that section. Global search bar to find any student across all sections.
- D-04: Both Admin and Principal can create, edit, and view all students.

**Student Creation**
- D-05: One-at-a-time via Sheet form PLUS CSV import for bulk onboarding.

**Subject Enrollment**
- D-06: Auto-enroll by section. Placing a student in a section automatically enrolls them in all subjects configured for that grade level (JHS) or grade level + strand (SHS). No manual per-student subject enrollment.
- D-07: JHS subjects assigned per grade level. SHS subjects assigned per grade level + strand.
- D-08: Subject-to-grade-level (and strand for SHS) assignment happens during school structure setup. This phase extends Phase 2 subject management to include which subjects belong to which grade levels/strands. Auto-enrollment triggers when student is placed in a section.

**Teacher Assignment**
- D-09: Table of subject-section pairs with an "Assign Teacher" action button. Opens a Sheet to select from SUBJECT_TEACHER role users.
- D-10: Assignment table filtered by grade level dropdown.
- D-11: A teacher can teach the same subject in multiple sections.

**Adviser Assignment**
- D-12: Inline on section list — each section row displays current adviser (or "Unassigned"). Click to open Sheet to pick/change adviser from ADVISER role users. One adviser per section.

### Claude's Discretion
- Page organization: whether to use a single tabbed page or separate sidebar items
- CSV import UX: file picker, column mapping, validation/preview before import, error handling for bad rows
- Exact table columns and sort order for student list and assignment tables
- How the grade level + section filter dropdowns are laid out
- Empty states when no students or assignments exist yet

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ENRL-01 | Admin/Principal can create and edit student profiles (name, grade level, section, strand, contact info) | Student model design, Sheet form pattern, role-check pattern (ADMIN \| PRINCIPAL), verifySession() |
| ENRL-02 | Admin/Principal can enroll students into specific subjects per quarter/semester | SubjectAssignment junction table (subject ↔ grade level + strand), auto-enrollment trigger in Server Action, StudentEnrollment model |
| ENRL-03 | Principal can assign teachers to subjects and sections | SubjectTeacherAssignment model, assignment table pattern, role-check (PRINCIPAL) |
| ENRL-04 | Principal can assign advisers to sections | AdviserAssignment on Section model, one-adviser-per-section constraint, role-check (PRINCIPAL) |
</phase_requirements>

---

## Summary

Phase 3 bridges school structure (Phase 2) to grading (Phase 4). The phase has four interconnected concerns: (1) student profile CRUD with CSV bulk import, (2) subject-to-grade-level assignment as a Phase 2 extension that enables auto-enrollment, (3) teacher-to-subject-section assignment, and (4) adviser-to-section assignment.

The codebase is well-established with clear patterns from Phases 1 and 2. All UI components needed are already installed. The main new work is: three new Prisma models (Student, SubjectAssignment, TeacherAssignment), extending the existing Section model with an adviser foreign key, implementing CSV parsing in a client component, and building four new Server Actions. The UI follows the tabbed page pattern from Phase 2 and the Sheet pattern from Phases 1 and 2 throughout.

The single most important architectural note is the **subject-to-grade-level link (SubjectAssignment)**. This does not exist in the current schema — Subject has no relationship to GradeLevelEntry or Strand. This junction table must be built before auto-enrollment can work, and it logically belongs in the Phase 2 School Structure page (Subjects tab) so admins can link subjects to grade levels/strands. This phase must therefore extend the School Structure page as a prerequisite before the Enrollment page can function.

**Primary recommendation:** Build the schema changes and SubjectAssignment linking UI first, then student CRUD, then assignment management, then CSV import. This dependency order prevents blocking.

---

## Standard Stack

### Core (all already in place — no new installs required)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.1 | App Router, RSC, Server Actions, routing | Established project stack |
| Prisma | 7.6.0 | ORM — schema, migrations, query builder | Established project stack |
| React | 19.2.4 | UI rendering, useActionState, startTransition | Established project stack |
| Zod | ^4.3.6 | Server Action schema validation | Established project pattern |
| shadcn/ui | 4.1.1 | Component library | Established project pattern |

### CSV Parsing

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| (native File API) | — | Read uploaded file | No install needed — runs in browser |
| (native string split) | — | Parse CSV rows | CSV template is fixed-column; a library adds no value for a fixed schema |

**CSV parsing strategy (verified):** The CSV import UX runs entirely in the browser client component. The file is read with `FileReader.readAsText()` or `file.text()`. Rows are split on newline, columns on comma. Validated rows are passed to a Server Action as a JSON-encoded string (not FormData file upload) to bypass the complexity of multipart uploads through Server Actions. This approach is consistent with the existing Server Action pattern in this project.

No new packages required. All tooling is already installed.

**Installation:** Nothing to install — all dependencies present.

---

## Architecture Patterns

### Recommended Project Structure (additions to existing layout)

```
app/
├── actions/
│   ├── enrollment.ts          # Student CRUD, CSV import, auto-enrollment
│   └── assignment.ts          # Teacher + adviser assignment mutations
├── dashboard/
│   └── enrollment/
│       └── page.tsx           # RSC page — verifySession, load data, render tabs
│
components/
├── enrollment-tabs.tsx         # "use client" — Students + Assignments tab switcher
├── student-table.tsx           # "use client" — filter bar + table with search
├── create-student-sheet.tsx    # "use client" — create/edit student Sheet form
├── csv-import-sheet.tsx        # "use client" — multi-step CSV import Sheet
├── teacher-assignment-table.tsx # "use client" — subject-section pairs with assign actions
├── assign-teacher-sheet.tsx    # "use client" — teacher picker Sheet
├── adviser-assignment-table.tsx # "use client" — section list with adviser assignment
└── assign-adviser-sheet.tsx    # "use client" — adviser picker Sheet

prisma/
└── schema.prisma               # Add: Student, SubjectAssignment, TeacherAssignment
                                # Modify: Section (add adviserId + adviser relation)
```

Additionally, `app/dashboard/school-structure` Subjects tab needs a UI extension to link subjects to grade levels/strands via the new SubjectAssignment table. The existing `subjects-tab.tsx` and `app/actions/school-structure.ts` require extension.

---

### Pattern 1: RSC Page + Client Component Data Split (established)

**What:** Page is a React Server Component. It calls verifySession() for auth+role, fetches all data needed for initial render, then passes data as props to a "use client" component.

**When to use:** Every dashboard page in this project. Confirmed pattern in Phase 1 (users page) and Phase 2 (school-structure page).

**Example (verified — from `app/dashboard/school-structure/page.tsx`):**
```typescript
// app/dashboard/enrollment/page.tsx
import { verifySession } from "@/lib/dal"
import { redirect } from "next/navigation"
import { getEnrollmentData } from "@/app/actions/enrollment"
import { EnrollmentTabs } from "@/components/enrollment-tabs"

export default async function EnrollmentPage() {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN") && !session.roles.includes("PRINCIPAL")) {
    redirect("/dashboard")
  }

  const data = await getEnrollmentData()
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <EnrollmentTabs {...data} />
      </div>
    </div>
  )
}
```

---

### Pattern 2: Server Action with Zod validation (established)

**What:** Server Actions in `app/actions/*.ts` use `"use server"` directive, call `verifySession()` for role check, validate with Zod, mutate via Prisma, call `revalidatePath()`.

**When to use:** All data mutations. Confirmed pattern across `auth.ts`, `users.ts`, `school-structure.ts`.

**Role check for ADMIN | PRINCIPAL (new for this phase):**
```typescript
// Pattern: either role is allowed
const session = await verifySession()
if (!session.roles.includes("ADMIN") && !session.roles.includes("PRINCIPAL")) {
  return { errors: { form: ["Unauthorized."] } }
}
```

**Principal-only check (for ENRL-03, ENRL-04):**
```typescript
if (!session.roles.includes("PRINCIPAL")) {
  return { errors: { form: ["Unauthorized."] } }
}
```

**Auto-enrollment trigger (fires inside createStudent action):**
```typescript
// After creating the Student record, find all SubjectAssignments for the section's grade level + strand
// Then createMany StudentEnrollment records
const subjectAssignments = await prisma.subjectAssignment.findMany({
  where: {
    gradeLevelEntryId: section.gradeLevelEntryId,
    strandId: student.strandId ?? null,
  },
})
await prisma.studentEnrollment.createMany({
  data: subjectAssignments.map((sa) => ({
    studentId: newStudent.id,
    subjectId: sa.subjectId,
  })),
})
```

---

### Pattern 3: useActionState with toast feedback (established)

**What:** Client components use `useActionState` hook. A `useEffect` watches state for `success` or `errors.form` and fires `toast.success()` or `toast.error()`. `startTransition` wraps `setOpen(false)` after success.

**When to use:** All Sheet forms in this project.

**Example (verified — from `create-subject-sheet.tsx`):**
```typescript
const [state, formAction, isPending] = useActionState<CreateStudentState, FormData>(
  createStudent,
  null,
)

useEffect(() => {
  if (state?.success) {
    toast.success("Student enrolled successfully")
    startTransition(() => setOpen(false))
  }
  if (state?.errors?.form) {
    toast.error(state.errors.form[0])
  }
}, [state])
```

---

### Pattern 4: Filtered table via URL search params or client state

**What:** The students tab has a grade level + section filter and a global search. Given all other pages in this project use client-side filtering (no URL params), client state (`useState`) is appropriate. The RSC page loads all students in the active school year; client component applies filters.

**Consideration for 300-800 students:** Loading all students at once is viable for this scale. PostgreSQL query with `include` on Section and GradeLevelEntry is fast. Client-side filtering on an array of 800 is instant. No pagination needed for v1.

**Alternative (URL search params):** Would require `useSearchParams()` and RSC re-fetch on filter change. More complex. Not needed for this scale.

**Recommendation:** Client-side filtering with `useState` for grade level, section, and search string. Consistent with Phase 2 pattern.

---

### Pattern 5: CSV Import (new in this phase)

**What:** CSV import is a multi-step flow in a Sheet component. All parsing happens client-side (no server file upload). Validated rows are sent to a Server Action as a JSON string.

**Steps:**
1. User drops/selects CSV file
2. Client reads file with `file.text()` (modern File API — supported in all current browsers)
3. Client parses: split on `\n`, skip header row, split each row on `,`, trim values
4. Client validates each row against the expected columns: `lrn, lastName, firstName, middleName, gradeLevel, sectionName, strand, sex, contactNumber`
5. Client shows preview table: valid rows (green check badge), invalid rows (destructive badge + error reason)
6. User clicks "Import N Students" button
7. Client calls Server Action with `JSON.stringify(validRows)` as a hidden form field value
8. Server Action parses JSON, creates Student records in a `prisma.$transaction`, triggers auto-enrollment for each

**CSV template columns (fixed schema — no column mapping UI needed):**
```
lrn,lastName,firstName,middleName,gradeLevel,sectionName,strand,sex,contactNumber
```
- `middleName`, `strand`, `contactNumber` are optional (can be blank)
- `gradeLevel` must be one of: G7, G8, G9, G10, G11, G12
- `sex` must be one of: Male, Female
- `strand` required if gradeLevel is G11 or G12; ignored for G7-G10
- LRN must be unique across all students

**Template download:** A static CSV file at `public/csv-templates/student-import-template.csv`. Downloaded via `<a href="/csv-templates/student-import-template.csv" download>`.

---

### Anti-Patterns to Avoid

- **Fetching users list in every Sheet open:** Fetch all SUBJECT_TEACHER / ADVISER users once in the page RSC and pass as props to the Sheet components. Don't fetch on Sheet open.
- **Blocking auto-enrollment on section change:** Auto-enrollment runs in the Server Action (server-side). The client Sheet just submits a grade level + section. The server resolves SubjectAssignments and creates enrollments atomically in a transaction.
- **Duplicate enrollment:** `prisma.studentEnrollment.createMany` with `skipDuplicates: true` prevents re-enrolling a student in a subject they're already enrolled in if createStudent is retried.
- **Manual per-student subject enrollment UI:** D-06 is explicit — no manual enrollment. The UI never shows individual subject checkboxes for a student.
- **CSV file upload via FormData through Server Action:** This requires multipart handling and doesn't play well with Server Actions in Next.js 16. Pass parsed data as JSON string instead.

---

## Prisma Schema Design

This is the most consequential research output. The schema requires careful design to support auto-enrollment correctly.

### New Models

```prisma
// Student profile — ENRL-01
model Student {
  id            String    @id @default(cuid())
  lrn           String    @unique               // DepEd Learner Reference Number
  lastName      String
  firstName     String
  middleName    String?
  sex           Sex
  contactNumber String?
  sectionId     String
  section       Section   @relation(fields: [sectionId], references: [id])
  enrollments   StudentEnrollment[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Sex {
  MALE
  FEMALE
}

// Subject-to-grade-level/strand assignment — prerequisite for ENRL-02
// One SubjectAssignment record = "this subject is taught at this grade level (+ optional strand)"
model SubjectAssignment {
  id                String          @id @default(cuid())
  subjectId         String
  gradeLevelEntryId String
  strandId          String?         // null = applies to all strands (JHS, or SHS when not strand-specific)
  subject           Subject         @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  gradeLevelEntry   GradeLevelEntry @relation(fields: [gradeLevelEntryId], references: [id], onDelete: Cascade)
  strand            Strand?         @relation(fields: [strandId], references: [id])
  enrollments       StudentEnrollment[]

  @@unique([subjectId, gradeLevelEntryId, strandId])
}

// Student enrollment record — created automatically when student is assigned to section — ENRL-02
model StudentEnrollment {
  id                  String            @id @default(cuid())
  studentId           String
  subjectAssignmentId String
  student             Student           @relation(fields: [studentId], references: [id], onDelete: Cascade)
  subjectAssignment   SubjectAssignment @relation(fields: [subjectAssignmentId], references: [id], onDelete: Cascade)
  createdAt           DateTime          @default(now())

  @@unique([studentId, subjectAssignmentId])
}

// Teacher-to-subject-section assignment — ENRL-03
model TeacherAssignment {
  id                  String            @id @default(cuid())
  subjectAssignmentId String
  teacherId           String
  subjectAssignment   SubjectAssignment @relation(fields: [subjectAssignmentId], references: [id], onDelete: Cascade)
  teacher             User              @relation("TeacherAssignments", fields: [teacherId], references: [id])
  createdAt           DateTime          @default(now())
  updatedAt           DateTime          @updatedAt

  @@unique([subjectAssignmentId])   // one teacher per subject-section pair
}
```

### Modified Models

```prisma
// Section — add adviser assignment — ENRL-04
model Section {
  id                String          @id @default(cuid())
  name              String
  gradeLevelEntryId String
  strandId          String?
  adviserId         String?         // NEW — one adviser per section
  gradeLevelEntry   GradeLevelEntry @relation(fields: [gradeLevelEntryId], references: [id], onDelete: Cascade)
  strand            Strand?         @relation(fields: [strandId], references: [id])
  adviser           User?           @relation("AdviserAssignments", fields: [adviserId], references: [id])  // NEW
  students          Student[]       // NEW

  @@unique([gradeLevelEntryId, name, strandId])
}

// User — add back-relations for assignments
model User {
  // ... existing fields ...
  teacherAssignments TeacherAssignment[] @relation("TeacherAssignments")  // NEW
  advisedSections    Section[]           @relation("AdviserAssignments")   // NEW
}

// Subject — add back-relation
model Subject {
  // ... existing fields ...
  subjectAssignments SubjectAssignment[]  // NEW
}

// GradeLevelEntry — add back-relation
model GradeLevelEntry {
  // ... existing fields ...
  subjectAssignments SubjectAssignment[]  // NEW
}
```

**Key design decision: SubjectAssignment as the central junction.**
Rather than a direct TeacherAssignment joining (teacherId, sectionId, subjectId) — which would require a three-way unique constraint — the TeacherAssignment points to a SubjectAssignment record. This means:
- A SubjectAssignment = "Subject X is taught in GradeLevel Y (for Strand Z)"
- A TeacherAssignment = "Teacher T teaches SubjectAssignment SA"
- A StudentEnrollment = "Student S is enrolled in SubjectAssignment SA"

This architecture naturally satisfies D-11 (teacher can teach the same subject in multiple sections) — one teacher can have multiple TeacherAssignment records pointing to different SubjectAssignment records (e.g., Math in G7-Hope and Math in G7-Charity are two different SubjectAssignment records in the same grade level, differentiated by their section context).

**Wait — reconsideration:** SubjectAssignment currently does NOT include a sectionId, only gradeLevelEntryId + strandId. That means multiple sections within the same grade level all share the same SubjectAssignment row. This is correct for auto-enrollment (all sections in G7 get the same subjects), but it means a single TeacherAssignment with `@@unique([subjectAssignmentId])` would only allow ONE teacher for ALL sections of G7 Math — which contradicts D-11.

**Correct fix:** TeacherAssignment must include a `sectionId` to distinguish "Math in G7-Hope" from "Math in G7-Charity":

```prisma
model TeacherAssignment {
  id                  String            @id @default(cuid())
  subjectAssignmentId String
  sectionId           String
  teacherId           String
  subjectAssignment   SubjectAssignment @relation(fields: [subjectAssignmentId], references: [id], onDelete: Cascade)
  section             Section           @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  teacher             User              @relation("TeacherAssignments", fields: [teacherId], references: [id])
  createdAt           DateTime          @default(now())
  updatedAt           DateTime          @updatedAt

  @@unique([subjectAssignmentId, sectionId])   // one teacher per subject per section
}
```

And Section needs a back-relation:
```prisma
model Section {
  // ... existing fields ...
  teacherAssignments  TeacherAssignment[]  // NEW
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form state + server round-trip | Custom fetch/XHR | `useActionState` (React 19) | Already proven in codebase; handles pending state, errors, success atomically |
| CSV row validation errors | Custom error state tree | Inline parse function returning `{row, errors}[]` | Simple enough for fixed-schema CSV; no library overhead needed |
| Unique constraint error handling | Manual pre-check query | Catch Prisma `P2002` error code | Prisma throws known error codes on constraint violations — catch and return user-friendly message |
| Role-based UI hiding | Custom permission utility | Inline `session.roles.includes(...)` check | Consistent with all existing pages; don't over-abstract |
| Table pagination | Custom paginator | Client-side array slice (not needed yet) | 800 students max — no pagination required for v1 |

**Key insight:** The codebase has a fully established Server Action pattern with Zod + useActionState + toast notifications. Do not deviate from it. All new actions follow the exact same structure as `createSubject`, `createSection`, etc.

---

## Common Pitfalls

### Pitfall 1: SubjectAssignment scope — JHS vs SHS strand handling

**What goes wrong:** For JHS, SubjectAssignment has `strandId = null` (subjects apply to all sections of that grade level). For SHS, SubjectAssignment has a specific `strandId`. When querying for auto-enrollment, a naive `findMany({ where: { gradeLevelEntryId, strandId } })` with a JHS student (strandId = null) will correctly match records where strandId IS null — but only if the query explicitly passes `strandId: null`, not `strandId: undefined`. Prisma treats `undefined` as "omit this filter" (matches everything), while `null` means "IS NULL".

**How to avoid:** In the auto-enrollment query:
```typescript
const strandId = student.strandId ?? null  // must be null, not undefined
const subjectAssignments = await prisma.subjectAssignment.findMany({
  where: { gradeLevelEntryId: section.gradeLevelEntryId, strandId },
})
```

### Pitfall 2: Section.strandId vs Student strand — don't double-store strand

**What goes wrong:** The Section model already has a `strandId`. A student in a section inherits the section's strand. Do NOT add a separate `strandId` field to the Student model — this creates a denormalization risk where section strand and student strand can diverge.

**How to avoid:** The Student model has no `strandId`. Strand is always resolved through `student.section.strand`. When auto-enrolling, look up the section's strandId, not a student-level one.

**Note from UI-SPEC:** The Create Student Sheet shows a "Strand" field (conditional for G11/G12). This strand is used to filter the section list — only sections matching the selected strand are shown. The strand value is ultimately stored on the Section, not the Student. The Sheet should derive/display the strand from the selected section.

**Revised approach per CONTEXT D-06, D-07, D-08:** The student's strand is implicit from section membership. The Sheet UX shows a strand picker to help filter the section dropdown — but the actual enrollment stores only a sectionId. The Student model does not need a strandId column.

### Pitfall 3: CSV import — LRN uniqueness across school years

**What goes wrong:** LRN is a DepEd-assigned permanent identifier per student. LRN should be unique in the Student table globally — not per-year. If a student repeats a grade level in a new school year, they retain the same LRN. The `@unique` constraint on `lrn` in the Student model is correct.

**How to avoid:** Enforce uniqueness at DB level (`@unique`). In CSV import, validate LRN uniqueness before calling Server Action. Catch Prisma P2002 error on conflict and return a user-friendly error. Do NOT use `upsert` for CSV import — an LRN collision should be an error, not a silent overwrite.

### Pitfall 4: Section filter must scope to active school year

**What goes wrong:** GradeLevelEntry is scoped to a SchoolYear. The student table filter offers "grade level" → "section", but multiple school years have G7 grade level entries and sections with the same names. Loading sections without filtering by the active school year shows historical sections.

**How to avoid:** The `getEnrollmentData()` query must filter sections through the active school year:
```typescript
const activeYear = await prisma.schoolYear.findFirst({ where: { isActive: true } })
// Then load gradeLevelEntries where schoolYearId = activeYear.id
```

### Pitfall 5: Role check — ADMIN or PRINCIPAL (not ADMIN-only)

**What goes wrong:** Existing pages check `session.roles.includes("ADMIN")` only. ENRL-01 through ENRL-04 require ADMIN *or* PRINCIPAL access. Using the wrong role check locks out Principals.

**How to avoid:**
```typescript
// Page level
if (!session.roles.includes("ADMIN") && !session.roles.includes("PRINCIPAL")) {
  redirect("/dashboard")
}
// Server Action level — same check
```

### Pitfall 6: Prisma 7 import path

**What goes wrong:** Importing from `@prisma/client` instead of the generated output path will fail in Prisma 7.

**How to avoid:** Use the established pattern from this codebase — import from `@/lib/prisma` (which uses the generated path `app/generated/prisma`). Never import `PrismaClient` directly from `@prisma/client`.

### Pitfall 7: useActionState dual-hook for create vs edit

**What goes wrong:** Using a conditional `useActionState` call (e.g., `if (mode === "edit") useActionState(...)`) violates React's rules of hooks.

**How to avoid:** The established solution in this codebase (confirmed in `create-subject-sheet.tsx`) is to always call both `useActionState` hooks (one for create, one for update) and select which one to use at render time:
```typescript
const [createState, createFormAction, createIsPending] = useActionState(createStudent, null)
const [updateState, updateFormAction, updateIsPending] = useActionState(updateStudent, null)
const state = mode === "create" ? createState : updateState
const formAction = mode === "create" ? createFormAction : updateFormAction
```

### Pitfall 8: startTransition required for setState in useEffect

**What goes wrong:** Calling `setOpen(false)` or other setState calls inside a `useEffect` that watches action state causes React's `react-hooks/set-state-in-effect` lint rule to fire.

**How to avoid:** Wrap setState calls inside `useEffect` with `startTransition`:
```typescript
useEffect(() => {
  if (state?.success) {
    toast.success("Student enrolled successfully")
    startTransition(() => setOpen(false))
  }
}, [state])
```

This is the established pattern in `create-subject-sheet.tsx` and `grade-levels-tab.tsx`.

---

## Code Examples

### Server Action — createStudent (with auto-enrollment)

```typescript
// Source: established pattern from app/actions/school-structure.ts
"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/dal"

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

  const { lrn, sectionId, ...rest } = validated.data

  const existing = await prisma.student.findUnique({ where: { lrn } })
  if (existing) {
    return { errors: { lrn: ["This LRN is already registered."] } }
  }

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: { gradeLevelEntry: true },
  })
  if (!section) {
    return { errors: { sectionId: ["Section not found."] } }
  }

  await prisma.$transaction(async (tx) => {
    const student = await tx.student.create({
      data: { lrn, sectionId, ...rest },
    })
    // Auto-enrollment: find all SubjectAssignments for this grade level + strand
    const subjectAssignments = await tx.subjectAssignment.findMany({
      where: {
        gradeLevelEntryId: section.gradeLevelEntryId,
        strandId: section.strandId ?? null,
      },
    })
    if (subjectAssignments.length > 0) {
      await tx.studentEnrollment.createMany({
        data: subjectAssignments.map((sa) => ({
          studentId: student.id,
          subjectAssignmentId: sa.id,
        })),
        skipDuplicates: true,
      })
    }
  })

  revalidatePath("/dashboard/enrollment")
  return { success: true }
}
```

### Server Action — assignTeacher

```typescript
// Source: established pattern from app/actions/school-structure.ts
export async function assignTeacher(
  _prevState: AssignTeacherState,
  formData: FormData,
): Promise<AssignTeacherState> {
  const session = await verifySession()
  if (!session.roles.includes("PRINCIPAL")) {
    return { errors: { form: ["Unauthorized."] } }
  }

  // upsert: create if no assignment, replace if changing teacher
  await prisma.teacherAssignment.upsert({
    where: {
      subjectAssignmentId_sectionId: {
        subjectAssignmentId: formData.get("subjectAssignmentId") as string,
        sectionId: formData.get("sectionId") as string,
      },
    },
    create: {
      subjectAssignmentId: formData.get("subjectAssignmentId") as string,
      sectionId: formData.get("sectionId") as string,
      teacherId: formData.get("teacherId") as string,
    },
    update: { teacherId: formData.get("teacherId") as string },
  })

  revalidatePath("/dashboard/enrollment")
  return { success: true }
}
```

### Sidebar nav extension (ADMIN | PRINCIPAL visibility)

```typescript
// Source: established pattern from components/app-sidebar.tsx
{
  title: "Enrollment & Assignments",
  url: "/dashboard/enrollment",
  icon: GraduationCapIcon,  // from lucide-react
  visible: user.roles.includes("ADMIN") || user.roles.includes("PRINCIPAL"),
}
```

### Client-side CSV parse (browser)

```typescript
// Source: standard File API + string manipulation
async function parseCSV(file: File): Promise<{ valid: ParsedRow[]; errors: ParseError[] }> {
  const text = await file.text()
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean)
  const [_header, ...rows] = lines
  const valid: ParsedRow[] = []
  const errors: ParseError[] = []

  rows.forEach((line, idx) => {
    const [lrn, lastName, firstName, middleName, gradeLevel, sectionName, strand, sex, contactNumber] =
      line.split(",").map((v) => v.trim())

    const rowErrors: string[] = []
    if (!lrn) rowErrors.push("LRN required")
    if (!lastName) rowErrors.push("Last name required")
    if (!firstName) rowErrors.push("First name required")
    if (!["G7","G8","G9","G10","G11","G12"].includes(gradeLevel)) rowErrors.push("Invalid grade level")
    if (!["Male","Female"].includes(sex)) rowErrors.push("Sex must be Male or Female")
    if (["G11","G12"].includes(gradeLevel) && !strand) rowErrors.push("Strand required for SHS")

    if (rowErrors.length > 0) {
      errors.push({ rowIndex: idx + 2, errors: rowErrors, raw: line })
    } else {
      valid.push({ lrn, lastName, firstName, middleName, gradeLevel, sectionName, strand, sex, contactNumber })
    }
  })

  return { valid, errors }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@prisma/client` import | Generated client from `app/generated/prisma` (Prisma 7) | Prisma 7.0 | Must import from `@/lib/prisma`, not directly from package |
| `middleware.ts` for route protection | `proxy.ts` at project root | Next.js 16 + Turbopack | `middleware.ts` silently ignored; use `proxy.ts` (confirmed working in Phase 1) |
| `import type` from Prisma enum | Local string literal types in Server Actions | Prisma 7 + build constraints | Importing from generated client in Server Actions fails during build; use `type GradeLevel = "G7" | ...` locally |
| `z.string().min(1, "msg")` | `z.string().min(1, { error: "msg" })` | Zod 4.x | Zod 4 changed the error format — object syntax required |

---

## Open Questions

1. **SubjectAssignment — should strand-specific vs grade-wide be explicit or inferred by null?**
   - What we know: D-07 says JHS is per grade level (all sections), SHS is per grade level + strand. Current schema design uses `strandId: null` to mean "applies to all sections of this grade level."
   - What's unclear: When an SHS grade level has sections of different strands, do they share any subjects? (e.g., does G11 STEM share any subjects with G11 ABM?) Current DepEd SHS curriculum: Core subjects are shared across strands. However, under the current schema, a Core subject assigned to G11 without strandId (null) would enroll ALL G11 students regardless of strand — which is correct for Core subjects.
   - Recommendation: The `strandId: null` = "all strands" approach works correctly for this use case. A Core subject gets one SubjectAssignment record with `strandId: null`. Strand-specific electives get one record per strand. This is the correct model.

2. **SubjectAssignment UI — where does it live?**
   - What we know: D-08 says it happens during school structure setup, extending Phase 2. The CONTEXT says this phase may add it to the Phase 2 school structure page.
   - What's unclear: Does this mean adding a new "Assign subjects to grade levels" section within the existing Subjects tab, or adding a new tab?
   - Recommendation: Add subject linking as a secondary action within the existing Subjects tab. For each subject row, an inline "Assign to grade level" Sheet shows checkboxes for grade levels (and strand selectors for G11/G12). This keeps the School Structure page as the home for curriculum configuration. The Planner should include this as a discrete task within Phase 3.

3. **Student deletion — what happens to enrollment records?**
   - What we know: CONTEXT D-01 and UI-SPEC describe "Remove Student" with copy "Removing this student will also remove their enrollment records." The StudentEnrollment model has `onDelete: Cascade` so this is automatic.
   - What's unclear: Does Phase 4 (grading) store grades directly on StudentEnrollment? If so, removing a student in Phase 3 would destroy grade data in Phase 4. For Phase 3, no grades exist yet, so cascade is safe. But the architecture should be noted.
   - Recommendation: Implement cascade delete for Phase 3. Add a "cannot delete student with grade records" guard in Phase 4 when grades are implemented.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Build/runtime | Yes | 23.6.1 | — |
| pnpm | Package management | Yes | 10.33.0 | — |
| Prisma CLI | Migrations | Yes | 7.6.0 | — |
| PostgreSQL | Data storage | Unknown (blocked by credential issue) | Unknown | — |
| Next.js dev server | Development | Yes | 16.2.1 | — |

**Missing dependencies with no fallback:**
- PostgreSQL connectivity: The active blocker from STATE.md ("PostgreSQL credentials: `postgres` user password unknown. Must update `.env` DATABASE_URL with correct password before running `prisma migrate dev`") remains unresolved. All schema migration tasks will fail until this is resolved. The Planner must include this as a prerequisite gating task.

**Missing dependencies with fallback:**
- None.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None — no test infrastructure exists yet |
| Config file | None |
| Quick run command | N/A |
| Full suite command | N/A |

**Note:** No test files or configuration were found in any directory of the project (confirmed by STRUCTURE.md: "Testing: Not present — no test files or test configuration exist yet"). The nyquist_validation config is `true`, but no automated test infrastructure exists. Planner should either: (a) create a Wave 0 task to set up a minimal test framework, or (b) treat validation as manual verification per the existing pattern from Phases 1 and 2 (no tests were required for those phases either).

### Phase Requirements → Test Map

Given no test infrastructure exists, all tests are manual verification:

| Req ID | Behavior | Test Type | Notes |
|--------|----------|-----------|-------|
| ENRL-01 | Create student, verify in table | Manual | Fill form → submit → table shows new student |
| ENRL-01 | Edit student, verify updated | Manual | Click edit → change field → submit → table shows update |
| ENRL-01 | Duplicate LRN rejected | Manual | Submit same LRN twice → error message shown |
| ENRL-02 | Auto-enroll on section assignment | Manual | Create student in section → check DB for StudentEnrollment records |
| ENRL-03 | Assign teacher to subject-section | Manual | Select teacher → submit → Assigned Teacher column shows name |
| ENRL-04 | Assign adviser to section | Manual | Select adviser → submit → section row shows adviser name |
| ENRL-01 | CSV import — valid rows enrolled | Manual | Upload valid CSV → import → count matches enrolled students |
| ENRL-01 | CSV import — invalid rows skipped | Manual | Upload CSV with bad rows → preview shows errors → skip count correct |

### Wave 0 Gaps

- No automated test framework — all validation for this phase is manual verification
- If nyquist_validation is to be truly satisfied, Wave 0 should add `vitest` or `jest` + a basic test for the grade calculation utilities. However, given that Phases 1 and 2 were completed without test infrastructure and the codebase has zero test files, this decision should be made at planning time, not imposed by research.

---

## Project Constraints (from CLAUDE.md)

The following CLAUDE.md directives apply to this phase. The Planner must verify all tasks comply.

| Directive | Impact on Phase 3 |
|-----------|-------------------|
| Tech stack: Next.js 16 + PostgreSQL + Prisma — already decided | All data access through Prisma. No direct SQL. No alternative ORMs. |
| UI components: shadcn/ui (radix-nova style) exclusively | All new components use shadcn/ui primitives. No third-party form libraries (e.g., react-hook-form, Formik). |
| TypeScript strict mode | All new files must pass `tsc --noEmit` with `strict: true`. No `any` types. |
| Zod 4 error format: `{ error: "msg" }` | All new Zod schemas use object syntax for error messages, not string shorthand. |
| Prisma 7: import from `@/lib/prisma`, not `@prisma/client` | All Server Actions import `prisma` from `@/lib/prisma`. |
| proxy.ts for route protection | No middleware.ts. Route protection via proxy.ts only for global auth; per-page role checks via verifySession(). |
| Local string literal types in Server Actions | Do not import Prisma-generated enum types in Server Actions — use local `type GradeLevel = "G7" | ...` etc. |
| No barrel files | Import components directly from their file paths. |
| Named exports for components, default exports for pages | `export function CreateStudentSheet(...)`, `export default function EnrollmentPage()` |
| useActionState pattern | No fetch/XHR. All mutations via Server Actions with useActionState. |
| startTransition for setState in useEffect | Wrap setOpen(false) and other setState calls in startTransition inside useEffect. |
| Semicolons absent in component files | Follow existing style in .tsx files — no semicolons in component files. |
| 2-space indentation | All new code uses 2-space indentation. |

---

## Sources

### Primary (HIGH confidence)
- `prisma/schema.prisma` — Verified current schema; confirms what models exist and what's missing
- `app/actions/school-structure.ts` — Verified Server Action patterns, Zod 4 syntax, Prisma 7 usage
- `app/actions/users.ts` — Verified role-check pattern, createMany usage
- `components/create-subject-sheet.tsx` — Verified dual-useActionState pattern, startTransition pattern
- `components/grade-levels-tab.tsx` — Verified RemoveSectionRow pattern, useActionState per-row
- `components/app-sidebar.tsx` — Verified nav item structure with role-based visibility
- `lib/dal.ts` — Verified verifySession() signature and return shape
- `proxy.ts` — Verified route protection approach
- `.planning/phases/03-enrollment-assignment/03-CONTEXT.md` — Source of truth for all locked decisions
- `.planning/phases/03-enrollment-assignment/03-UI-SPEC.md` — Verified component inventory, interaction contracts, copywriting
- `node_modules/next/dist/docs/01-app/02-guides/forms.md` — Confirmed Server Action + FormData pattern in Next.js 16
- `CLAUDE.md` — Project constraints verified

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — PostgreSQL blocker status
- `.planning/phases/01-foundation-auth/01-CONTEXT.md` — Auth patterns context
- `.planning/phases/02-school-structure/02-CONTEXT.md` — Phase 2 patterns context

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all dependencies verified against package.json, no installs required
- Schema design: HIGH — derived from existing schema + locked decisions; SubjectAssignment-as-central-junction cross-checked against D-06/D-07/D-11
- Architecture: HIGH — verified from existing codebase patterns (3 prior phases of consistent patterns)
- CSV import: HIGH — browser File API is standard; JSON-string-through-Server-Action approach verified against Next.js constraints
- Pitfalls: HIGH — derived from direct codebase observation (Prisma null vs undefined, startTransition pattern, dual useActionState) and confirmed bugs from STATE.md accumulated context

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable stack — no fast-moving dependencies)
