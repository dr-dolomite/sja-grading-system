# Phase 3: Enrollment & Assignment - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Students have profiles, are enrolled in subjects, and teachers/advisers are assigned to sections and subjects. The system knows who teaches what and to whom. This phase bridges school structure (Phase 2) to grading (Phase 4) — without enrollment and assignment, there's no one to grade.

Note: Subject-to-grade-level assignment (which subjects belong to which grade level/strand) is part of school structure setup (Phase 2 extension) and must be in place before auto-enrollment can work. This phase may need to add that linking capability if not already present.

</domain>

<decisions>
## Implementation Decisions

### Student Profile Fields
- **D-01:** Minimal profile — name (first, middle, last), grade level, section, strand (SHS only), sex, LRN (Learner Reference Number, required), contact number (optional). No photo, address, or parent info for v1.
- **D-02:** LRN is required on every student profile. This is the DepEd standard student identifier.

### Student List & Navigation
- **D-03:** Filter-by-section pattern — Admin/Principal picks a grade level, then a section from dropdowns. Table shows students in that section. Global search bar to find any student across all sections.
- **D-04:** Both Admin and Principal can create, edit, and view all students (per ENRL-01).

### Student Creation
- **D-05:** One-at-a-time creation via Sheet form (consistent with Phase 1/2 pattern) PLUS CSV import for bulk onboarding at start of school year.

### Subject Enrollment
- **D-06:** Auto-enroll by section. When a student is assigned to a section, the system automatically enrolls them in all subjects configured for that grade level (JHS) or grade level + strand (SHS). No manual per-student subject enrollment.
- **D-07:** JHS subjects are assigned per grade level — all sections in the same grade share the same subject set. SHS subjects are assigned per grade level + strand — G11-STEM has different subjects from G11-ABM.
- **D-08:** Subject-to-grade-level (and strand for SHS) assignment happens during school structure setup. This extends Phase 2's subject management to include which subjects belong to which grade levels/strands. Auto-enrollment triggers when a student is placed into a section.

### Teacher Assignment
- **D-09:** Table of subject-section pairs (e.g., "Math — G7 Hope") with an "Assign Teacher" action button. Opens a Sheet to select from users with SUBJECT_TEACHER role. Consistent with existing Sheet pattern.
- **D-10:** Assignment table filtered by grade level dropdown — pick a grade level to see all subject-section pairs for that level with their assigned teachers. Consistent with student list filter pattern.
- **D-11:** A teacher can teach the same subject in multiple sections (e.g., Math in G7-Hope AND G7-Charity). Common school reality.

### Adviser Assignment
- **D-12:** Inline on section list — each section row displays its current adviser (or "Unassigned"). Click to open a Sheet to pick/change the adviser from users with ADVISER role. One adviser per section.

### Claude's Discretion
- Page organization: whether to use a single tabbed page (Students / Assignments tabs) or separate sidebar items — Claude decides based on what fits the navigation structure best
- CSV import UX: file picker, column mapping, validation/preview before import, error handling for bad rows
- Exact table columns and sort order for student list and assignment tables
- How the grade level + section filter dropdowns are laid out
- Empty states when no students or assignments exist yet

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Requirements
- `.planning/REQUIREMENTS.md` — ENRL-01 through ENRL-04 define acceptance criteria for this phase
- `.planning/PROJECT.md` — Project constraints, school context (300-800 students, 20-40 teachers, JHS/SHS structure)
- `.planning/ROADMAP.md` — Phase 3 success criteria and dependencies

### Prior Phase Context
- `.planning/phases/01-foundation-auth/01-CONTEXT.md` — Auth patterns (custom JWT, Employee ID login), Sheet form pattern, RSC + client split, sidebar navigation, role-based visibility
- `.planning/phases/02-school-structure/02-CONTEXT.md` — School structure decisions: tabbed page layout, Sheet pattern for forms, inline expansion, subject types and weight presets, strand configuration, dual curriculum support (D-22, D-23)

### Codebase Analysis
- `.planning/codebase/CONVENTIONS.md` — Coding conventions (naming, imports, component patterns)
- `.planning/codebase/STRUCTURE.md` — Directory layout and where to add new code

### DepEd Policy (for enrollment context)
- `DO_s2015_08.pdf` — DepEd Order No. 8, s. 2015: grading component structure that subjects follow
- `DM-74-s.-2025_Interim-Guidelines-for-the-Assessment-and-Grading-System-for-the-Pilot-Implementation-of-the-Strengthened-Senior-High-School-Curriculum.pdf` — Strengthened SHS curriculum subject classification

### Next.js 16
- `node_modules/next/dist/docs/` — Next.js 16 documentation (MUST read before writing Next.js code)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/ui/sheet.tsx`: Sheet (slide-over) for creation/edit forms — established pattern from Phase 1 and 2
- `components/ui/table.tsx`: Table component for listing entities
- `components/ui/tabs.tsx`: Tabs component if a tabbed page layout is used
- `components/ui/select.tsx`: Select dropdown for grade level/section filter pickers
- `components/ui/input.tsx`, `components/ui/label.tsx`, `components/ui/field.tsx`: Form elements with validation states
- `components/ui/badge.tsx`: Badge for status indicators (assigned/unassigned, JHS/SHS tags)
- `components/create-user-sheet.tsx`: Reference Sheet-based creation form (adapt for student/assignment forms)
- `components/user-table.tsx`: Reference data table with actions (adapt for student/assignment tables)
- `components/grade-levels-tab.tsx`: Reference for expandable grade level rows with inline section management — adviser assignment can follow this pattern

### Established Patterns
- RSC page + "use client" form component split
- `verifySession()` per page for auth gating + role check
- Server Actions in `app/actions/` for data mutations
- Sidebar navigation with role-based `visible` flag
- Sonner toast notifications for success/error feedback
- Sheet pattern for all create/edit overlays
- Filter dropdowns for scoping table data

### Integration Points
- `prisma/schema.prisma`: Needs new Student model, SubjectAssignment (subject-to-grade-level/strand link), TeacherAssignment (teacher-to-subject-section), AdviserAssignment (adviser-to-section), and StudentEnrollment models
- `components/app-sidebar.tsx`: Add enrollment/assignment nav item(s) with role-based visibility (ADMIN + PRINCIPAL)
- `app/dashboard/`: Add new page(s) for enrollment and assignment management
- `app/actions/`: Add Server Actions for student CRUD, CSV import, teacher assignment, adviser assignment
- Current Subject model has no link to GradeLevelEntry or Strand — needs junction table for subject-to-grade-level assignment

</code_context>

<specifics>
## Specific Ideas

- CSV import is important for start-of-year bulk onboarding — typing 300-800 students one by one would be impractical
- Auto-enroll by section eliminates a massive manual step — admin only needs to place students in sections, not individually assign subjects
- Subject-to-grade-level linking is a prerequisite for auto-enrollment and may need to be added to the Phase 2 school structure page as part of this phase's implementation
- Grade level + strand determines SHS subject sets — this mirrors how DepEd organizes curricula by track/strand

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-enrollment-assignment*
*Context gathered: 2026-04-01*
