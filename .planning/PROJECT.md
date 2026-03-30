# SJA Grading System

## What This Is

A centralized grading system for St. Joseph's Academy of Malinao, Inc. (SJA) that enables teachers to input raw scores, automatically computes DepEd-compliant grades, and generates custom report cards. Locally hosted for the school network with planned Tailscale support for remote teacher access.

## Core Value

Teachers can input raw scores and the system accurately computes DepEd-standard grades — if grading doesn't work correctly, nothing else matters.

## Requirements

### Validated

- ✓ Next.js 16 App Router scaffold with shadcn/ui component system — existing
- ✓ Tailwind CSS v4 with design tokens and dark mode support — existing
- ✓ SJA brand logos available in public/sja-logos/ — existing

### Active

- [ ] Role-based authentication (Subject Teacher, Adviser, Principal, Registrar, Admin)
- [ ] School structure management (grade levels, sections, strands, subjects, school year/quarters/semesters)
- [ ] Student enrollment and profile management
- [ ] Subject-teacher assignment management
- [ ] Activity definition with max scores per grading component (Written Work, Performance Task, Quarterly Assessment)
- [ ] Raw score input per student per activity
- [ ] Auto-computation of grades following DepEd component weights
- [ ] Per-subject attendance tracking (mark absences at class start)
- [ ] Deliberation form generation (adviser-triggered, warns on incomplete grades)
- [ ] JHS quarterly deliberation (Q1-Q4, same subjects across quarters)
- [ ] SHS semester-based deliberation (Sem 1 and Sem 2 with distinct subject sets)
- [ ] Anecdotal record creation and commenting (DepEd-required student issue tracking)
- [ ] Honor roll computation and adviser validation (Highest: 98-100, High: 95-97, With Honors: 90-94)
- [ ] Custom report card generation (printable, SJA format — templates TBD)
- [ ] Principal dashboard: teacher action logs, attendance report timing, subject/enrollment management
- [ ] Registrar view: student details, cross-JHS/SHS grade viewing, ID photo downloads, anecdotal record commenting
- [ ] Admin panel: account management, system logs, student ID tracking, ID photo uploads

### Out of Scope

- Online deployment / cloud hosting — locally hosted, Tailscale for remote access later
- DepEd SF9 standard report card format — SJA uses custom format
- Real-time notifications / push alerts — not needed for v1
- Parent/student portal — teachers and staff only for now
- Mobile app — web-first, responsive design sufficient
- Printable template design — provided later, system must support pluggable templates

## Context

- **School:** St. Joseph's Academy of Malinao, Inc. (SJA), private school
- **Scale:** Medium — 300-800 students, 20-40 teachers
- **JHS:** Grades 7-10, multiple sections per grade level, quarterly grading (Q1-Q4)
- **SHS:** Grades 11-12, strands: STEM, ABM, HUMSS, GAS. Semester-based grading (Sem 1 and Sem 2 have different subject sets)
- **Grading system:** Standard DepEd component-based — Written Work, Performance Task, Quarterly Assessment with percentage weights varying by subject type
- **Grade input workflow:** Teachers define activities (name + max score) per component, then enter raw scores per student. System auto-computes component percentages and quarterly/semester grades.
- **Attendance:** Per-subject, tracked at start of class. A student can be absent in one subject but present in another on the same day.
- **Deliberation:** Adviser manually triggers generation after subject teachers submit grades. System warns if any grades are incomplete.
- **Existing codebase:** Next.js 16 App Router scaffold with shadcn/ui (radix-nova style), Tailwind CSS v4, TypeScript. No backend, data layer, or auth yet.
- **Target stack:** PostgreSQL database with Prisma ORM, locally hosted

## Constraints

- **Tech stack**: Next.js 16 + PostgreSQL + Prisma — already decided, existing scaffold in place
- **Hosting**: Local network deployment, no cloud dependency. Tailscale planned for future remote access
- **Compliance**: Must follow DepEd grading component weights and computation rules
- **Data sensitivity**: Student grades and records are confidential — role-based access control is mandatory
- **Templates**: Printable report card/form templates will be provided later — system must support pluggable template rendering

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| PostgreSQL + Prisma for data layer | User requirement; relational model fits school data well | — Pending |
| Local hosting with Tailscale option | School network first, remote access is secondary | — Pending |
| Standard DepEd grading components | SJA follows DepEd standards for WW/PT/QA | — Pending |
| Custom report card format over SF9 | SJA has its own report card design | — Pending |
| Raw score input (not pre-computed) | Teachers define activities, enter raw scores; system computes everything | — Pending |
| V1 = Grading core | First priority: teachers can input grades, compute, generate report cards for one quarter | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? Move to Out of Scope with reason
2. Requirements validated? Move to Validated with phase reference
3. New requirements emerged? Add to Active
4. Decisions to log? Add to Key Decisions
5. "What This Is" still accurate? Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-30 after initialization*
