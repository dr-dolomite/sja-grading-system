# Phase 2: School Structure - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Admin can fully configure the school's organizational structure — school years, grading periods (quarters/semesters), grade levels, sections, strands, and subjects with DepEd grading component weights — before any data entry begins. This phase supports both the current DepEd curriculum (DO 8, s. 2015) and the Strengthened SHS Curriculum (DM 074, s. 2025) simultaneously, as Grade 12 will follow the old curriculum while Grade 11 adopts the new one starting SY 2025-2026.

</domain>

<decisions>
## Implementation Decisions

### Page Organization
- **D-01:** Single "School Structure" page under `/dashboard/school-structure` with tabs: School Year, Grade Levels, Subjects. Uses existing shadcn Tabs component.
- **D-02:** Sections are managed inline under Grade Levels tab — click a grade level row to expand and see/add its sections. No separate Sections tab.
- **D-03:** Admin-only access. No read-only view for other roles — they interact with structure through their own workflows (enrollment, grading) in later phases.
- **D-04:** Sheet (slide-over panel) pattern for all creation/edit forms, consistent with Phase 1 Users page pattern.
- **D-05:** New "School Structure" item added to sidebar navigation, visible only when user has ADMIN role.

### School Year Setup
- **D-06:** JHS grading periods (Q1-Q4) are auto-generated when a school year is created. Standard DepEd structure.
- **D-07:** SHS grading periods are also auto-generated (Sem 1: Q1-Q2, Sem 2: Q3-Q4) but strands and subjects are manually configurable per grade level per year to support curriculum changes (Strengthened SHS Curriculum).
- **D-08:** One active school year at a time. Past years are viewable but not editable. Admin can set up next year and "activate" it when ready.
- **D-09:** "Copy from previous year" feature — admin creates a new year and can optionally clone grade levels, sections, subjects, and strands from the previous year, then adjust as needed.
- **D-10:** No explicit curriculum version tracking. Manual configuration of subjects/strands per grade level per year naturally reflects different curricula (old for G12, new for G11).

### Subject Weight Configuration
- **D-11:** System provides DepEd weight presets per subject type. Admin picks a type when creating a subject, weights auto-fill, and can be overridden. Must sum to 100% (enforced on save with real-time sum display).
- **D-12:** JHS subject types (per DO 8, s. 2015 Table 4):
  - Languages (Filipino, English): WW 30%, PT 50%, QA 20%
  - AP/EsP: WW 40%, PT 40%, QA 20%
  - Science/Math: WW 40%, PT 40%, QA 20%
  - MAPEH/EPP/TLE: WW 20%, PT 60%, QA 20%
- **D-13:** SHS subject types — old curriculum (per DO 8, s. 2015 Table 5):
  - Core Subjects: WW 25%, PT 50%, QA 25%
  - Academic Track (All other): WW 25%, PT 45%, QA 30%
  - Academic Track (Work Immersion/Research/etc.): WW 35%, PT 40%, QA 25%
- **D-14:** SHS subject types — new Strengthened curriculum (per DM 074, s. 2025):
  - Core: WW 25%, PT 50%, QA 25%
  - Academic Electives: WW 25%, PT 45%, QA 30%
  - Academic Electives (Field Experience/Exposure/Sports and Arts): WW 20%, PT 60%, QA 20%
  - TechPro Electives: WW 15%, PT 65%, QA 20%
  - TechPro (Work Immersion): WW 20%, PT 80%, QA **none** (2 components only)
- **D-15:** School-specific subject type for Religious Education with custom default weights (admin configurable). Available for both JHS and SHS.
- **D-16:** Work Immersion subjects automatically use WW+PT only (no QA field) when typed as Work Immersion. System enforces this rule — not left to manual configuration.

### Section & Strand
- **D-17:** JHS vs SHS auto-detected by grade level: G7-G10 = JHS (quarterly), G11-G12 = SHS (semester-based). No manual tagging needed.
- **D-18:** Strand assignment is per-section. Each G11/G12 section belongs to one strand (e.g., "Grade 11 — STEM A"). Students in that section follow the same strand subjects.
- **D-19:** Sections use named convention (e.g., "St. John", "Charity", "Hope") — admin types a name when creating a section.
- **D-20:** Strands are fully configurable (admin can create/rename/remove). System pre-populates current 4 Academic strands (STEM, ABM, HUMSS, GAS) as defaults. This supports the Strengthened SHS Curriculum which will introduce different strands.
- **D-21:** SJA currently offers Academic track only (STEM, ABM, HUMSS, GAS). TechPro subject types included in the system for completeness/future use.

### Dual Curriculum Support
- **D-22:** Effective Communication / Mabisang Komunikasyon modeled as two linked subjects, each graded independently. System auto-computes the combined average for report card consolidation (per DM 074, s. 2025 §8).
- **D-23:** Subject duration rules per new curriculum (DM 074, s. 2025 §12):
  - Core Subjects: 4 quarters across 2 semesters → Final Grade = avg of 4 quarterly grades
  - Academic Electives: 2 quarters per semester → Semester Grade computed
  - TechPro Electives (G11): 4 quarters → Final Grade = avg of 4 quarterly grades
  - TechPro Electives (G12): 2 quarters per semester → Semester Grade computed

### Claude's Discretion
- Tab order and default active tab on the School Structure page
- Exact layout of the expandable grade level → sections inline view
- How the "copy from previous year" workflow is presented (modal confirmation, preview of what will be copied, etc.)
- Default weight values for the School-specific (Religious Education) subject type

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### DepEd Grading Policy (CRITICAL)
- `DO_s2015_08.pdf` (user-provided) — DepEd Order No. 8, s. 2015: Policy Guidelines on Classroom Assessment for K-12. Contains JHS weight tables (Table 4), old SHS weight tables (Table 5), transmutation table (Appendix B), grading scale (Table 10), grade computation steps (Tables 6-7), MAPEH special handling, and report card templates (Appendices C-D)
- `DM-74-s.-2025_Interim-Guidelines-for-the-Assessment-and-Grading-System-for-the-Pilot-Implementation-of-the-Strengthened-Senior-High-School-Curriculum.pdf` (user-provided) — DM 074, s. 2025: Strengthened SHS Curriculum grading guidelines. Contains new subject classification (Core/Academic Electives/TechPro), new weight distribution table (§7b), Work Immersion 2-component rule, Effective Communication/Mabisang Komunikasyon combined subject handling (§8), grade computation matrix (§12), and sample School Form 9 (Annex A)

### Project Requirements
- `.planning/REQUIREMENTS.md` — STRUCT-01 through STRUCT-04 define acceptance criteria
- `.planning/PROJECT.md` — Project constraints, school context (scale, roles, local hosting)
- `.planning/ROADMAP.md` — Phase 2 success criteria and dependencies

### Codebase Analysis
- `.planning/codebase/ARCHITECTURE.md` — Current app architecture
- `.planning/codebase/STACK.md` — Technology stack details
- `.planning/codebase/CONVENTIONS.md` — Coding conventions to follow

### Next.js 16
- `node_modules/next/dist/docs/` — Next.js 16 documentation (MUST read before writing Next.js code)

### Phase 1 Context
- `.planning/phases/01-foundation-auth/01-CONTEXT.md` — Phase 1 decisions: auth patterns, Sheet component usage, dashboard layout, sidebar navigation, RSC+client component split

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/ui/tabs.tsx`: Tabs component for the tabbed page layout
- `components/ui/sheet.tsx`: Sheet (slide-over) for creation/edit forms — established pattern from Phase 1
- `components/ui/table.tsx`: Table component for listing entities
- `components/ui/card.tsx`: Card component for summary/info displays
- `components/ui/select.tsx`: Select dropdown for subject type picker, strand selector
- `components/ui/input.tsx`, `components/ui/label.tsx`, `components/ui/field.tsx`: Form elements with validation states
- `components/ui/badge.tsx`: Badge for status indicators (active/archived year, JHS/SHS tags)
- `components/user-table.tsx`: Reference implementation for data table with actions — adapt pattern for school structure tables
- `components/create-user-sheet.tsx`: Reference implementation for Sheet-based creation form

### Established Patterns
- RSC page + "use client" form component split (Phase 1 pattern)
- `verifySession()` per page for auth gating + role check (see `app/dashboard/users/page.tsx`)
- Server Actions in `app/actions/` for data mutations
- Sidebar navigation with role-based `visible` flag (`components/app-sidebar.tsx`)
- `getCurrentUser()` in layout for display data, NOT auth gating
- Sonner toast notifications for success/error feedback

### Integration Points
- `prisma/schema.prisma`: Needs new models for SchoolYear, GradingPeriod, GradeLevel, Section, Strand, Subject, SubjectType
- `components/app-sidebar.tsx`: Add "School Structure" nav item with `visible: user.roles.includes("ADMIN")`
- `app/dashboard/`: Add `school-structure/page.tsx` route
- `app/actions/`: Add Server Actions for CRUD operations on school structure entities

</code_context>

<specifics>
## Specific Ideas

- Religious Education is a school-specific subject for both JHS and SHS — not part of standard DepEd curriculum but required by SJA
- SY 2025-2026 will have split curricula: G11 uses Strengthened SHS (new subject types, new strands), G12 uses old curriculum (Applied/Specialized). System must handle both simultaneously through manual configuration per grade level
- The Strengthened SHS Curriculum replaces "Applied" and "Specialized" with "Academic Electives" and "TechPro Electives" — these are fundamentally different subject categories, not just renamed
- MAPEH is special: quarterly grade = average of Music, Arts, PE, Health quarterly grades (per DO 8, s. 2015). This affects how MAPEH sub-subjects are modeled
- Transmutation table from DO 8 Appendix B converts Initial Grade to report card grade (floor = 60). This applies to both old and new curricula (per DM 074, s. 2025 §11a)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-school-structure*
*Context gathered: 2026-03-30*
