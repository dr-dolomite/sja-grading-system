---
phase: 03-enrollment-assignment
plan: 03
subsystem: enrollment
tags: [server-actions, assignment, teacher-assignment, adviser-assignment, sheet, table]
dependency_graph:
  requires: [03-01, 03-02]
  provides: [teacher-assignment-crud, adviser-assignment-crud]
  affects: [app/dashboard/enrollment, components/enrollment-tabs]
tech_stack:
  added: []
  patterns: [useActionState-with-assignTeacher, useActionState-with-assignAdviser, prisma-upsert-pattern, RSC-parallel-data-fetch]
key_files:
  created:
    - app/actions/assignment.ts
    - components/teacher-assignment-table.tsx
    - components/assign-teacher-sheet.tsx
    - components/adviser-assignment-table.tsx
    - components/assign-adviser-sheet.tsx
  modified:
    - components/enrollment-tabs.tsx
    - app/dashboard/enrollment/page.tsx
decisions:
  - "EnrollmentTabs props split into enrollmentData/assignmentData to avoid name collision on sections field (both EnrollmentData and AssignmentData have a sections property with different shapes)"
  - "page.tsx fetches getEnrollmentData and getAssignmentData in parallel via Promise.all for optimal performance"
  - "assignTeacher uses Prisma upsert on TeacherAssignment to create or overwrite without unique constraint errors"
  - "assignAdviser uses section.update with adviserId field — one adviser per section enforced by schema"
metrics:
  duration_seconds: 224
  completed_date: "2026-04-02"
  tasks_completed: 2
  files_modified: 7
---

# Phase 03 Plan 03: Assignments Tab — Teacher and Adviser Assignment Summary

PRINCIPAL can assign teachers to subject-section pairs and advisers to sections via two assignment tables (with grade level filter and Unassigned badges) and Sheet forms backed by PRINCIPAL-only Server Actions using Prisma upsert and section update.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Assignment Server Actions | 70d5c44 | app/actions/assignment.ts |
| 2 | Assignment tables and Sheet forms, wire into Assignments tab | 47fef23 | components/teacher-assignment-table.tsx, components/assign-teacher-sheet.tsx, components/adviser-assignment-table.tsx, components/assign-adviser-sheet.tsx, components/enrollment-tabs.tsx, app/dashboard/enrollment/page.tsx |

## What Was Built

**Server Actions (`app/actions/assignment.ts`):**
- `getAssignmentData()` — query helper that builds subject-section pairs by crossing each SubjectAssignment with its matching sections (respecting strandId filter for SHS), plus all sections with adviser info
- `assignTeacher` — PRINCIPAL-only Server Action using `prisma.teacherAssignment.upsert` to create or overwrite assignments without unique constraint errors
- `assignAdviser` — PRINCIPAL-only Server Action using `prisma.section.update` to set adviserId on the section model

**Components:**
- `TeacherAssignmentTable` — client component with grade level filter dropdown, table of subject-section pairs with "Assigned Teacher" or "Unassigned" badge, and "Assign Teacher"/"Change Teacher" buttons opening AssignTeacherSheet
- `AssignTeacherSheet` — Sheet form with read-only subject/section display, teacher Select showing name + employee ID, backed by useActionState with assignTeacher, closes on success with toast
- `AdviserAssignmentTable` — client component showing sections with strand column, "Current Adviser" or "Unassigned" badge, and "Assign Adviser"/"Change Adviser" buttons opening AssignAdviserSheet
- `AssignAdviserSheet` — Sheet form with section display, adviser Select showing name + employee ID, backed by useActionState with assignAdviser, closes on success with toast

**Updated files:**
- `EnrollmentTabs` — props split into `enrollmentData` and `assignmentData` to avoid `sections` property collision; Assignments tab now renders TeacherAssignmentTable, Separator, and AdviserAssignmentTable
- `EnrollmentPage` — fetches both `getEnrollmentData()` and `getAssignmentData()` in parallel via `Promise.all`

## Decisions Made

1. **EnrollmentTabs props split** — Both `getEnrollmentData` and `getAssignmentData` return a `sections` field with different shapes. Using an intersection type `EnrollmentData & AssignmentData` would cause a type collision. Solution: Accept `{ enrollmentData, assignmentData }` as separate named props and destructure each independently.

2. **Promise.all in page.tsx** — Both data fetches are independent, so parallelizing via `Promise.all` avoids waterfall latency on page load.

3. **Prisma upsert for teacher assignment** — The `@@unique([subjectAssignmentId, sectionId])` constraint means repeated assignments to the same pair would fail with a P2002 unique violation. Upsert handles create + update in one call cleanly.

4. **section.update for adviser assignment** — Adviser is stored as a foreign key (`adviserId`) directly on the Section model. The one-adviser-per-section constraint is enforced by the schema (single FK column). A plain update is sufficient.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all tables and forms are wired to real data from the database.

## Self-Check: PASSED

Files exist:
- app/actions/assignment.ts — FOUND
- components/teacher-assignment-table.tsx — FOUND
- components/assign-teacher-sheet.tsx — FOUND
- components/adviser-assignment-table.tsx — FOUND
- components/assign-adviser-sheet.tsx — FOUND

Commits exist:
- 70d5c44 — feat(03-03): add assignment server actions — FOUND
- 47fef23 — feat(03-03): add assignment tables and sheet forms for Assignments tab — FOUND
