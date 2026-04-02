---
phase: 03-enrollment-assignment
plan: "01"
subsystem: data-schema-enrollment-ui
tags: [prisma, schema, server-actions, subject-assignment, enrollment-foundation]
dependency_graph:
  requires: [02-03]
  provides: [SubjectAssignment-model, Student-model, StudentEnrollment-model, TeacherAssignment-model, assignSubjectToGradeLevel-action, AssignSubjectSheet]
  affects: [prisma/schema.prisma, app/actions/school-structure.ts, components/subjects-tab.tsx, components/school-structure-tabs.tsx]
tech_stack:
  added: []
  patterns: [useActionState-with-hidden-form-submit, startTransition-setState-in-effect, SHS-vs-JHS-grade-level-branching]
key_files:
  created:
    - components/assign-subject-sheet.tsx
  modified:
    - prisma/schema.prisma
    - app/actions/school-structure.ts
    - components/subjects-tab.tsx
    - components/school-structure-tabs.tsx
decisions:
  - "03-01: Hidden form + programmatic button click pattern for checkbox-triggered Server Actions (avoids inline form submit in Checkbox onCheckedChange)"
  - "03-01: startTransition wraps setChecked/setPending setState calls in useEffect per established Phase 2 pattern"
  - "03-01: SubjectAssignment uses @@unique([subjectId, gradeLevelEntryId, strandId]) — strandId null for JHS, non-null for SHS strands"
metrics:
  duration_minutes: ~20
  completed_date: "2026-04-02"
  tasks_completed: 2
  tasks_total: 2
  files_created: 1
  files_modified: 4
---

# Phase 03 Plan 01: Schema Extension and SubjectAssignment UI Summary

**One-liner:** Phase 3 Prisma schema (Student, SubjectAssignment, StudentEnrollment, TeacherAssignment + Sex enum) with ADMIN-only Server Actions and checkbox-based "Assign to grade levels" Sheet on the Subjects tab.

---

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Extend Prisma schema with Phase 3 models | 0459bee | prisma/schema.prisma |
| 2 | SubjectAssignment Server Actions and linking UI | 9bf849b | app/actions/school-structure.ts, components/assign-subject-sheet.tsx, components/subjects-tab.tsx, components/school-structure-tabs.tsx |

---

## What Was Built

### Task 1 — Schema Extension

Added to `prisma/schema.prisma`:

- **`enum Sex`** — MALE / FEMALE for Student model
- **`model Student`** — LRN (unique), name fields, Sex enum, sectionId FK, back-relation to StudentEnrollment
- **`model SubjectAssignment`** — links subject to grade level entry (+ optional strandId for SHS). `@@unique([subjectId, gradeLevelEntryId, strandId])` enforces one record per subject/grade/strand combination
- **`model StudentEnrollment`** — links student to subject assignment. `@@unique([studentId, subjectAssignmentId])`
- **`model TeacherAssignment`** — links teacher (User) to a subject assignment + section. `@@unique([subjectAssignmentId, sectionId])`
- **Section model** — added `adviserId`, `adviser` (User relation), `students` (Student[]), `teacherAssignments` back-relation
- **User model** — added `teacherAssignments` and `advisedSections` back-relations
- **Subject model** — added `subjectAssignments` back-relation
- **GradeLevelEntry model** — added `subjectAssignments` back-relation
- **Strand model** — added `subjectAssignments` back-relation

Schema validates successfully (`npx prisma validate`).

### Task 2 — Server Actions and Assign UI

**`app/actions/school-structure.ts`:**
- `assignSubjectToGradeLevel` — ADMIN-only, Zod-validated, creates SubjectAssignment, catches Prisma P2002 unique constraint with friendly error
- `removeSubjectAssignment` — ADMIN-only, Zod-validated, deletes SubjectAssignment by id
- `getSchoolStructureData` — extended to fetch and return `subjectAssignments` with subject, gradeLevelEntry, and strand includes

**`components/assign-subject-sheet.tsx`** (new):
- `AssignSubjectSheet` — Sheet triggered from subject row; groups grade levels into JHS (G7–G10) and SHS (G11–G12) sections
- `JhsRow` — checkbox per JHS grade level; hidden form + programmatic button.click pattern for Server Action dispatch
- `ShsStrandRow` — checkbox per strand per SHS grade level; same hidden-form pattern
- `startTransition` wraps all `setState` calls inside `useEffect` (react-hooks/set-state-in-effect compliance)

**`components/subjects-tab.tsx`:**
- Added `gradeLevelEntries`, `strands`, `subjectAssignments` to `SubjectsTabProps`
- Added `BookmarkIcon` Assign button per subject row, opening `AssignSubjectSheet` pre-filtered to that subject's existing assignments

**`components/school-structure-tabs.tsx`:**
- Destructures `subjectAssignments` from props and passes it (along with `gradeLevelEntries` and `strands`) to `SubjectsTab`

---

## Decisions Made

1. **Hidden form + programmatic button.click for checkbox-triggered Server Actions** — Checkbox `onCheckedChange` finds the hidden form's submit button by `data-*` attribute and clicks it. This avoids wrapping the entire checkbox in a `<form>` while still using the `useActionState` pattern.

2. **startTransition for setState in useEffect** — Follows established Phase 2 pattern (`02-02`, `02-03`). All `setChecked` / `setPending` calls inside `useEffect` are wrapped in `startTransition`.

3. **SubjectAssignment.strandId = null for JHS** — JHS grade levels get a single SubjectAssignment with `strandId: null`. SHS grade levels get one SubjectAssignment per strand. The `@@unique([subjectId, gradeLevelEntryId, strandId])` constraint enforces this correctly since `null` is treated as distinct in PostgreSQL.

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed type error in removeSubjectAssignment error return**
- **Found during:** Task 2 TypeScript check
- **Issue:** `validated.error.flatten().fieldErrors` returns `{ id?: string[] }` but `RemoveSubjectAssignmentState.errors` only accepts `{ form?: string[] }` — type mismatch TS2559
- **Fix:** Return `{ errors: { form: ["Invalid assignment ID."] } }` instead of spreading fieldErrors
- **Files modified:** app/actions/school-structure.ts
- **Commit:** 9bf849b (included in Task 2 commit)

**2. [Rule 2 - Lint] Applied startTransition to setState in useEffect**
- **Found during:** Task 2 ESLint check
- **Issue:** 4 `react-hooks/set-state-in-effect` errors for `setChecked` / `setPending` in `useEffect` blocks in `JhsRow` and `ShsStrandRow`
- **Fix:** Wrapped all setState calls inside `useEffect` with `startTransition()`
- **Files modified:** components/assign-subject-sheet.tsx
- **Commit:** 9bf849b (included in Task 2 commit)

### Pre-existing Issues (not introduced by this plan)

- `app/actions/school-structure.ts:192` — `Type 'string | null' is not assignable to type 'string'` in `createSection` — pre-existing since Phase 2
- `prisma.subjectAssignment` TypeScript errors — expected; Prisma client not regenerated due to PostgreSQL credentials blocker (tracked in STATE.md)

---

## Known Stubs

None — all implemented functionality is fully wired. SubjectAssignment data flows from `getSchoolStructureData` → `SchoolStructureTabs` → `SubjectsTab` → `AssignSubjectSheet`. The assign/remove Server Actions are real (not mocked).

Note: `AssignSubjectSheet` will show "No active school year with grade levels found" if no school year exists, and "No active strands found" for SHS if no strands are configured — these are correct empty-state messages, not stubs.

---

## Self-Check: PASSED

Files created/modified:
- [x] FOUND: prisma/schema.prisma
- [x] FOUND: app/actions/school-structure.ts
- [x] FOUND: components/assign-subject-sheet.tsx
- [x] FOUND: components/subjects-tab.tsx
- [x] FOUND: components/school-structure-tabs.tsx

Commits:
- [x] FOUND: 0459bee (feat(03-01): extend Prisma schema with Phase 3 models)
- [x] FOUND: 9bf849b (feat(03-01): add SubjectAssignment Server Actions and Assign UI on Subjects tab)
