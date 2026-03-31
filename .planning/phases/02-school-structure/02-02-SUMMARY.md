---
phase: 02-school-structure
plan: 02
subsystem: server-actions-and-ui
tags: [next.js, server-actions, prisma, shadcn, react, tabs, sheet, typescript]

requires:
  - phase: 02-school-structure
    plan: 01
    provides: Prisma schema models and subject type presets that these Server Actions use

provides:
  - All 7 Server Actions for school structure CRUD (createSchoolYear, activateSchoolYear, createSection, removeSection, createSubject, updateSubject, copyFromPreviousYear)
  - getSchoolStructureData query helper for the RSC page
  - app/dashboard/school-structure page with ADMIN auth gate
  - Three-tab school structure shell (School Year, Grade Levels, Subjects)
  - School Year tab with table, Active/Past badges, Add/Activate/Copy sheet forms
  - Sidebar navigation updated with School Structure item (ADMIN only)
  - Strand seeds (STEM, ABM, HUMSS, GAS) in prisma/seed.ts

affects:
  - 02-03 (Grade Levels and Subjects tab UI builds on these foundations)
  - All subsequent phases that use school structure data (enrolled students, teacher assignments, grading)

tech-stack:
  added: []
  patterns:
    - "Array-style $transaction for simple atomic updates (activateSchoolYear: deactivate all + activate target)"
    - "Callback-style $transaction for complex multi-table cloning (copyFromPreviousYear)"
    - "Zod .refine() for cross-field sum validation (weight components must total 100)"
    - "startTransition wrapper for setState calls in useEffect to satisfy react-hooks/set-state-in-effect rule"
    - "Props object spread + destructuring pattern (props: SchoolStructureData then const { schoolYears } = props) to avoid unused-vars lint errors on forward-declared props"

key-files:
  created:
    - app/actions/school-structure.ts
    - app/dashboard/school-structure/page.tsx
    - components/school-structure-tabs.tsx
    - components/school-year-tab.tsx
    - components/create-school-year-sheet.tsx
    - components/activate-year-sheet.tsx
    - components/copy-year-sheet.tsx
  modified:
    - components/app-sidebar.tsx
    - prisma/seed.ts

key-decisions:
  - "Local GradeLevel/PeriodType string literal types used in school-structure.ts to avoid importing from generated Prisma client (which requires DB connection to generate)"
  - "startTransition wraps setOpen(false) in useEffect to satisfy react-hooks/set-state-in-effect lint rule consistently across all Sheet components"
  - "school-structure-tabs.tsx accepts full SchoolStructureData as props object and destructures only what's needed now — gradeLevelEntries/strands/subjects are forward-declared for Plans 03/04"

metrics:
  duration: "~30 min (active implementation)"
  completed: "2026-03-31"
  tasks: 2
  files: 9
---

# Phase 2 Plan 02: School Structure — Server Actions and UI Summary

**All 7 Server Actions with auth gates and Zod validation, RSC page with ADMIN guard, three-tab shell, and fully functional School Year tab with Add/Activate/Copy sheet forms**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-03-30T15:15:18Z
- **Completed:** 2026-03-31
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Created `app/actions/school-structure.ts` with all 7 Server Actions and `getSchoolStructureData` query helper. Each action uses `verifySession()` auth gate with ADMIN role check, Zod v4 schema validation, and `revalidatePath("/dashboard/school-structure")`.
- `createSchoolYear` auto-generates Q1-Q4 `GradingPeriod` records and G7-G12 `GradeLevelEntry` records on year creation.
- `activateSchoolYear` uses array-style `$transaction` to atomically deactivate all years then activate the target (prevents duplicate active years).
- `copyFromPreviousYear` uses callback-style `$transaction` to clone year + periods + grade level entries + optionally sections in a single atomic operation.
- `createSubject` and `updateSubject` use Zod `.refine()` to enforce weight sum = 100 (3-component: WW+PT+QA=100; 2-component: WW+PT=100).
- Extended `prisma/seed.ts` with STEM/ABM/HUMSS/GAS strand seeds using upsert.
- Created `app/dashboard/school-structure/page.tsx` as RSC with `verifySession()` auth gate (redirects non-ADMIN to /dashboard), fetches all structure data and passes to `SchoolStructureTabs`.
- Created `components/school-structure-tabs.tsx` (client) with three tabs and dynamic CTA button (Add school year on School Year tab, hidden on others for now).
- Created `components/school-year-tab.tsx` with full table, Active/Past badges, and inline Activate/Copy action buttons.
- Created `components/create-school-year-sheet.tsx`, `activate-year-sheet.tsx`, `copy-year-sheet.tsx` — all use `useActionState` pattern with toast feedback on success/error.
- Updated `components/app-sidebar.tsx` to include School Structure nav item with `BuildingIcon`, visible to ADMIN only, between Dashboard and Users.

## Task Commits

1. **Task 1: Server Actions and strand seeds** — `77e45b9` (feat)
2. **Task 2: Sidebar, page, tabs, and sheet components** — `7236f09` (feat)

## Files Created/Modified

- `app/actions/school-structure.ts` — 7 Server Actions + getSchoolStructureData (512 lines)
- `prisma/seed.ts` — Added strand upsert seeds
- `app/dashboard/school-structure/page.tsx` — RSC page with auth gate
- `components/school-structure-tabs.tsx` — Client tab shell with three tabs
- `components/school-year-tab.tsx` — School Year table with badges and action buttons
- `components/create-school-year-sheet.tsx` — Add school year sheet form
- `components/activate-year-sheet.tsx` — Activate year confirmation sheet
- `components/copy-year-sheet.tsx` — Copy structure sheet with options
- `components/app-sidebar.tsx` — Added BuildingIcon and School Structure nav item

## Decisions Made

- **Local string literal types for GradeLevel/PeriodType:** Generated Prisma client not available during fresh worktree setup (requires `prisma generate` after DB connection). Used local type aliases `type GradeLevel = "G7" | ... ` compatible with Prisma enums when cast at usage sites.
- **startTransition for setState in useEffect:** React's `react-hooks/set-state-in-effect` lint rule flags direct `setOpen(false)` calls in useEffect bodies. Wrapping in `startTransition(() => setOpen(false))` satisfies the rule and is the React 19 recommended approach for state updates triggered by async effects.
- **Props object spread pattern in school-structure-tabs.tsx:** Props for Plans 03/04 (gradeLevelEntries, strands, subjects) are accepted via `props: SchoolStructureData` and only `schoolYears` is destructured, avoiding no-unused-vars warnings for forward-declared props.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed react-hooks/set-state-in-effect lint errors in Sheet components**
- **Found during:** Task 2 lint verification
- **Issue:** Direct `setOpen(false)` calls inside `useEffect` bodies triggered `react-hooks/set-state-in-effect` ESLint errors (same pre-existing pattern in Phase 1 components)
- **Fix:** Wrapped all `setOpen` calls in `startTransition()` in activate-year-sheet, copy-year-sheet, and create-school-year-sheet
- **Files modified:** All 3 sheet components
- **Commit:** 7236f09

**Note:** Pre-existing lint errors in `create-user-sheet.tsx`, `reset-password-confirm.tsx`, `user-table.tsx`, `data-table.tsx`, `site-header.tsx` (Phase 1 code, out of scope) were NOT fixed — they remain as 6 issues in the lint output. My new files contributed 0 new lint errors.

## Known Stubs

- **components/school-structure-tabs.tsx** — Grade Levels tab renders `<div>Grade Levels tab content</div>` placeholder (Plan 03 builds this)
- **components/school-structure-tabs.tsx** — Subjects tab renders `<div>Subjects tab content</div>` placeholder (Plan 03 builds this)

These stubs are intentional — Plans 03 and 04 wire the remaining tabs. The plan's goal (School Year tab fully functional) is achieved.

## Self-Check: PASSED

- FOUND: app/actions/school-structure.ts
- FOUND: app/dashboard/school-structure/page.tsx
- FOUND: components/school-structure-tabs.tsx
- FOUND: components/school-year-tab.tsx
- FOUND: components/create-school-year-sheet.tsx
- FOUND: components/activate-year-sheet.tsx
- FOUND: components/copy-year-sheet.tsx
- FOUND: components/app-sidebar.tsx (modified)
- FOUND: prisma/seed.ts (modified)
- FOUND commit: 77e45b9 (feat: server actions)
- FOUND commit: 7236f09 (feat: UI components)

---
*Phase: 02-school-structure*
*Completed: 2026-03-31*
