---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 2
current_plan: "3 (completed: 02-01, 02-02)"
status: in-progress
last_updated: "2026-03-31T07:52:00.000Z"
progress:
  total_phases: 6
  completed_phases: 1
  total_plans: 8
  completed_plans: 7
  percent: 25
---

# Project State: SJA Grading System

*This file is the project's memory. Updated at every phase transition and plan completion.*

---

## Project Reference

**Core Value:** Teachers can input raw scores and the system accurately computes DepEd-standard grades
**Milestone:** 1 — Initial Release
**Total Phases:** 6
**Total v1 Requirements:** 29

---

## Current Position

**Current Phase:** 2
**Current Plan:** 3 (completed: 02-01, 02-02)
**Phase Status:** In progress
**Overall Status:** In progress

```
Progress: [███               ] 25%
```

---

## Phase Checklist

| Phase | Status | Completed |
|-------|--------|-----------|
| 1. Foundation & Auth | Not started | - |
| 2. School Structure | Not started | - |
| 3. Enrollment & Assignment | Not started | - |
| 4. Grading Engine | Not started | - |
| 5. Attendance & Adviser Tools | Not started | - |
| 6. Staff Dashboards | Not started | - |

---

## Performance Metrics

- Plans executed: 3
- Plans succeeded first try: 3
- Plans required repair: 0
- Phases completed: 0 (Phase 1 complete pending human verification of auth flow)

---

## Accumulated Context

### Key Decisions

- 02-02: startTransition wraps setOpen() in useEffect to satisfy react-hooks/set-state-in-effect rule across all Sheet components
- 02-02: Local string literal types for GradeLevel/PeriodType in server actions (avoids importing from generated Prisma client which requires DB connection)
- 02-01: SHS_OLD_ACADEMIC_WORK_IMMERSION is 3-component (WW=35, PT=40, QA=25) per D-13; D-16 applies only to new curriculum TechPro Work Immersion
- 02-01: Subject type keys stored as String in Prisma (not enum) to keep presets decoupled from DB; validated at application layer via SUBJECT_TYPE_KEYS
- 02-01: Renamed SHS_OLD_WORK_IMMERSION to SHS_OLD_ACADEMIC_WORK_IMMERSION to clarify distinction from 2-component new curriculum variant
- 01-01: Custom auth (bcryptjs+jose+Prisma) over Better Auth/Auth.js — Employee ID as sole identifier avoids auth library assumption fighting
- 01-01: Stateless JWT sessions in HttpOnly cookie with 7-day expiry (jose library, official Next.js 16 recommendation)
- 01-01: proxy.ts at project root for route protection (Next.js 16 breaking change — middleware.ts silently ignored with Turbopack)
- 01-01: mustChangePassword flag in both DB and JWT session for enforcement without extra DB call per request
- 01-01: UserRole enum array on User model for Phase 1 simplicity; join table if complex queries needed later
- 01-01: bcryptjs (pure JS) over bcrypt (native) for Server Action environment compatibility
- 01-01: DATABASE_URL in prisma.config.ts only — never in schema.prisma (Prisma 7 breaking change)
- 01-02: RSC page + client form component split — login/change-password pages are RSC; only the form components are "use client"
- 01-02: Route group (auth) for change-password screen — keeps URL /change-password while grouping captive screens without layout inheritance
- 01-03: Dashboard layout uses getCurrentUser() for display data only — NOT an auth gate; each page independently calls verifySession() to avoid Next.js Partial Rendering auth bypass (Pitfall 5)
- 01-03: createUser auto-generates temporary password (not shown to admin) — user gets their Employee ID as identifier for first login
- 01-03: Sheet component used for all overlays (CreateUserSheet, ResetPasswordConfirm) — consistent pattern, no AlertDialog needed

### Active Blockers

- PostgreSQL credentials: `postgres` user password unknown. Must update `.env` DATABASE_URL with correct password before running `prisma migrate dev` and `prisma db seed`.

### Todos Carried Forward

*(None yet)*

### Discovered Constraints

- Next.js 16 App Router scaffold already exists with shadcn/ui and Tailwind CSS v4
- No backend, data layer, or auth exists yet — Phase 1 builds from scratch
- PostgreSQL + Prisma is the decided data stack
- Attendance is per-subject, not per-day — a student can be absent in one subject and present in another on the same day
- Deliberation is adviser-triggered, not automatic
- JHS uses Q1-Q4; SHS uses Sem 1/Sem 2 with different subject sets per semester
- Report card templates are deferred to v2 (RPTC-01, RPTC-02)

---

## Session Continuity

**Last updated:** 2026-03-31 — Completed 02-02-PLAN.md (School Structure Server Actions and UI: sidebar, page, tabs, School Year tab).
**Next action:** Run 02-03-PLAN.md (Grade Levels tab and Subjects tab UI).

---
*State initialized: 2026-03-30*
