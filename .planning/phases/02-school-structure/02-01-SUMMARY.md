---
phase: 02-school-structure
plan: 01
subsystem: database
tags: [prisma, postgresql, schema, deped, grading, typescript]

requires:
  - phase: 01-foundation-auth
    provides: User model and Prisma scaffold that this extends

provides:
  - Prisma schema models for all Phase 2 entities (SchoolYear, GradingPeriod, GradeLevelEntry, Strand, Section, Subject)
  - GradeLevel (G7-G12) and PeriodType (Q1-Q4) enums
  - lib/subject-type-presets.ts with all 13 DepEd subject type presets and correct weights
  - Extended Prisma mock setup for test infrastructure
  - Test stubs for all school structure Server Actions

affects:
  - 02-02 (Server Actions use these models and presets)
  - 02-03 (UI components read from these models)
  - 02-04 (Sidebar nav depends on phase completion)
  - All subsequent phases that use school structure data

tech-stack:
  added: []
  patterns:
    - "Subject type preset lookup: typed constant Record<SubjectTypeKey, SubjectTypePreset> with getPreset() helper"
    - "hasQuarterlyAssessment boolean flag enforces 2-component vs 3-component subject distinction at schema level"
    - "Prisma mock with $transaction supporting both callback and array styles for test isolation"

key-files:
  created:
    - lib/subject-type-presets.ts
    - tests/lib/subject-type-presets.test.ts
    - tests/actions/school-structure.test.ts
  modified:
    - prisma/schema.prisma
    - tests/setup.ts

key-decisions:
  - "SHS_OLD_ACADEMIC_WORK_IMMERSION is 3-component (WW=35, PT=40, QA=25) per D-13; only SHS_NEW_WORK_IMMERSION is 2-component per D-14/D-16"
  - "Subject type keys use string (not Prisma enum) to keep presets decoupled from DB — subjectTypeKey stored as String in schema"
  - "Religious Education default weights match JHS_LANGUAGES (WW=30, PT=50, QA=20) per Claude discretion"

patterns-established:
  - "SubjectTypeKey union type + SUBJECT_TYPE_PRESETS Record for type-safe preset lookup"
  - "Extend Prisma mock as named object so $transaction can reference it for callback-style transactions"

requirements-completed: [STRUCT-01, STRUCT-02, STRUCT-03, STRUCT-04]

duration: 4min
completed: 2026-03-30
---

# Phase 2 Plan 01: School Structure — Data Foundation Summary

**Prisma schema with 6 new school structure models, 13 DepEd subject type presets with validated weight sums, and extended test infrastructure for Phase 2**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-03-30T07:34:01Z
- **Completed:** 2026-03-30T07:38:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Extended `prisma/schema.prisma` with GradeLevel/PeriodType enums and 6 new models (SchoolYear, GradingPeriod, GradeLevelEntry, Strand, Section, Subject) with correct cascade deletes and composite unique constraints
- Created `lib/subject-type-presets.ts` with all 13 DepEd-mandated subject type presets; all weight sums validated (3-component: WW+PT+QA=100, 2-component: WW+PT=100, QA=null)
- Extended `tests/setup.ts` Prisma mock to cover all new models including a $transaction mock that supports both callback-style and array-style usage
- 9 preset validation tests pass; 17 school structure action stub tests registered as todo for Plan 02

## Task Commits

1. **Task 1: Prisma schema models and subject type presets module** - `f24495a` (feat)
2. **Task 2: Extend test infrastructure for Phase 2 models** - `d1e3a00` (feat)

## Files Created/Modified

- `prisma/schema.prisma` - Extended with GradeLevel/PeriodType enums and 6 school structure models
- `lib/subject-type-presets.ts` - All 13 DepEd subject type presets with weights, exported as typed constant
- `tests/setup.ts` - Added Prisma mocks for schoolYear, gradingPeriod, gradeLevelEntry, strand, section, subject, and $transaction
- `tests/lib/subject-type-presets.test.ts` - 9 tests verifying preset count, weight sums, and individual values
- `tests/actions/school-structure.test.ts` - 17 todo stubs covering all planned Server Actions

## Decisions Made

- **SHS_OLD_ACADEMIC_WORK_IMMERSION is 3-component:** D-13 (old curriculum Academic Track Work Immersion/Research) uses WW=35, PT=40, QA=25. D-16 applies only to the new curriculum TechPro Work Immersion. The PLAN.md CORRECTION section confirmed this interpretation.
- **Renamed key to SHS_OLD_ACADEMIC_WORK_IMMERSION:** The original `SHS_OLD_WORK_IMMERSION` was ambiguous — renaming clarifies it is the old curriculum's 3-component academic track variant, distinct from `SHS_NEW_WORK_IMMERSION` (2-component).
- **Religious Education default weights:** Used WW=30, PT=50, QA=20 (same as JHS_LANGUAGES) as the baseline — both are language/humanities-adjacent subjects. Matches Claude's discretion noted in CONTEXT.md.

## Deviations from Plan

None — plan executed exactly as written. The CORRECTION section in the plan itself guided the correct interpretation of SHS_OLD_WORK_IMMERSION, which was followed.

## Issues Encountered

- Worktree had empty node_modules; ran `pnpm install` to get vitest before running tests. This is normal for a fresh worktree and not a deviation.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All 6 Prisma models are defined and validated — Plan 02 can immediately build Server Actions against them
- Subject type presets module is the authoritative lookup for weight configuration — Plan 02 Server Actions should import `SUBJECT_TYPE_PRESETS` and `SUBJECT_TYPE_KEYS` for validation
- The 17 todo stubs in `tests/actions/school-structure.test.ts` define the exact behaviors Plan 02 must implement and test
- No blockers — schema-first approach means data contracts are locked

---
*Phase: 02-school-structure*
*Completed: 2026-03-30*
