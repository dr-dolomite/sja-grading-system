---
phase: 02-school-structure
plan: 03
subsystem: grade-levels-and-subjects-ui
tags: [next.js, react, shadcn, typescript, client-components, useActionState]

requires:
  - phase: 02-school-structure
    plan: 02
    provides: Server Actions (createSection, removeSection, createSubject, updateSubject), school-structure-tabs.tsx shell with placeholders, strands data from getSchoolStructureData

provides:
  - Grade Levels tab with expandable rows, inline section management, and strand badge display
  - CreateSectionSheet with optional strand selector for SHS sections
  - Subjects tab with type labels, WW/PT/QA weight columns, 2-component badge, and edit actions
  - CreateSubjectSheet with subject type groups, weight preset auto-population, and real-time sum indicator
  - Updated tab shell wiring all three tabs with real components (no placeholders remain)

affects:
  - 02-04 (Test coverage plan for these new UI components)
  - 03 (Enrollment/Assignment phase reads section and subject data configured here)

tech-stack:
  added: []
  patterns:
    - "startTransition wraps setState in useEffect for react-hooks/set-state-in-effect compliance (auto-fill weights on type change)"
    - "RemoveSectionRow sub-component encapsulates remove action state to avoid prop drilling"
    - "Nested Table inside TableCell for expandable sub-rows (pattern avoids DOM nesting errors)"
    - "SelectGroup + SelectLabel + SelectSeparator for grouped Select options with visual separators"
    - "Dual useActionState pattern for create/edit modes in single Sheet component"

key-files:
  created:
    - components/grade-levels-tab.tsx
    - components/create-section-sheet.tsx
    - components/subjects-tab.tsx
    - components/create-subject-sheet.tsx
  modified:
    - components/school-structure-tabs.tsx

key-decisions:
  - "RemoveSectionRow extracted as sub-component to scope removeSection useActionState per section row, avoiding a single shared state for all removal confirmations"
  - "Nested Table inside expandable TableCell: avoids invalid <tr> nesting in HTML while keeping style consistent"
  - "startTransition wraps weight auto-fill setters in useEffect body to satisfy react-hooks/set-state-in-effect ESLint rule (same pattern established in 02-02)"
  - "Dual useActionState (one for create, one for update) in CreateSubjectSheet: avoids conditional hook call which is invalid in React"

metrics:
  duration: "~10 min"
  completed: "2026-03-31"
  tasks: 2
  files: 5
---

# Phase 2 Plan 03: School Structure — Grade Levels and Subjects Tabs Summary

**Expandable Grade Levels table with inline section CRUD, strand badges for SHS sections, and Subjects table with DepEd preset weight auto-population and real-time sum validation**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-31
- **Completed:** 2026-03-31
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Created `components/grade-levels-tab.tsx`: Expandable table for G7-G12 entries. Each row has a chevron toggle (`aria-expanded`, `aria-controls`) that reveals section sub-rows with `bg-muted/30` tint and `pl-8` indent. Inline remove confirmation replaces the row with destructive/ghost button pair — no AlertDialog.
- Created `components/create-section-sheet.tsx`: Sheet form for adding sections with SHS-conditional strand `Select` (shown only for G11/G12). Uses `useActionState` with `createSection` Server Action. Toast feedback on success/error. `startTransition` wraps `setOpen(false)` in useEffect.
- Created `components/subjects-tab.tsx`: Table with Subject Name, Type (label + curriculum tag), WW, PT, QA columns. QA shows "—" for 2-component subjects with a "2-component" badge. Edit button per row uses `aria-label="Edit {name}"`. Pencil icon (`PencilIcon`). Empty state copy per spec.
- Created `components/create-subject-sheet.tsx`: Handles both create and edit modes. Subject type `Select` with four `SelectGroup` sections (JHS / SHS old / SHS new / School-specific) separated by `SelectSeparator`. Weight fields auto-populate on type change via `useEffect` + `startTransition`. Real-time weight sum indicator card using `CheckIcon` (green) / `XIcon` (red). QA field removed from DOM (not just hidden) for Work Immersion types; hidden input substituted. Two `useActionState` hooks (one create, one update) selected by `mode` prop.
- Updated `components/school-structure-tabs.tsx`: Replaced both tab placeholders with real components. Added `CreateSubjectSheet` CTA in header when subjects tab is active. Grade Levels tab: no header CTA (add section is inline per grade level as per UI-SPEC).

## Task Commits

1. **Task 1: Grade Levels tab with expandable sections and section CRUD** — `77c6618` (feat)
2. **Task 2: Subjects tab with weight presets and subject CRUD** — `848c705` (feat)

## Files Created/Modified

- `components/grade-levels-tab.tsx` — Expandable grade levels table with inline section management
- `components/create-section-sheet.tsx` — Add section sheet with optional strand selector
- `components/subjects-tab.tsx` — Subjects table with type labels, weight columns, and edit actions
- `components/create-subject-sheet.tsx` — Add/edit subject sheet with preset auto-fill and weight indicator
- `components/school-structure-tabs.tsx` — Updated to wire all three real tab components

## Decisions Made

- **RemoveSectionRow sub-component:** Each section row that shows the inline remove confirmation needs its own `useActionState` for `removeSection`. Extracting this to a sub-component scopes the action state per row, avoiding shared mutation state.
- **Dual useActionState in CreateSubjectSheet:** React prohibits conditional hooks. Using two `useActionState` calls (one for `createSubject`, one for `updateSubject`) and selecting between them by `mode` prop is the correct approach.
- **startTransition for weight auto-fill:** The `useEffect` that auto-populates WW/PT/QA when `subjectTypeKey` changes must wrap all three `setState` calls in `startTransition` to satisfy the `react-hooks/set-state-in-effect` ESLint rule.
- **Nested Table in expandable cell:** Placing expanded section rows inside a nested `<Table>` within a `<TableCell colSpan={5}>` avoids HTML DOM errors while allowing consistent table cell alignment.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical functionality] startTransition for weight auto-fill setters**
- **Found during:** Task 2 lint verification
- **Issue:** `setWw`, `setPt`, `setQa` called directly in `useEffect` body triggered `react-hooks/set-state-in-effect` ESLint error
- **Fix:** Wrapped all three setters in `startTransition(() => { ... })` within the effect — same fix as established in Plan 02-02 for `setOpen` calls
- **Files modified:** `components/create-subject-sheet.tsx`
- **Commit:** `848c705`

**Pre-existing lint errors (out of scope):** 6 lint issues (3 errors, 3 warnings) in `create-user-sheet.tsx`, `user-table.tsx`, `reset-password-confirm.tsx`, `data-table.tsx`, `site-header.tsx` from Phase 1/02-02 work remain unchanged. These were already documented in the 02-02 SUMMARY. My new files contribute 0 new lint errors.

**Pre-existing TypeScript errors (out of scope):** 4 type errors in `school-structure.ts`, `school-year-tab.tsx`, `prisma.ts`, `seed.ts` from previous plans — require `prisma generate` to resolve.

## Known Stubs

None. All three tabs now render real content:
- School Year tab: table with years, Active/Past badges, Activate/Copy actions (implemented in 02-02)
- Grade Levels tab: expandable G7-G12 with inline section management (implemented in this plan)
- Subjects tab: subjects table with weight display and edit actions (implemented in this plan)

## Self-Check: PASSED

- FOUND: components/grade-levels-tab.tsx
- FOUND: components/create-section-sheet.tsx
- FOUND: components/subjects-tab.tsx
- FOUND: components/create-subject-sheet.tsx
- FOUND: components/school-structure-tabs.tsx (modified)
- FOUND commit: 77c6618 (feat: Grade Levels tab)
- FOUND commit: 848c705 (feat: Subjects tab)

---
*Phase: 02-school-structure*
*Completed: 2026-03-31*
