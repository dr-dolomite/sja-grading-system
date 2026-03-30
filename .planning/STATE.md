---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 1 — Foundation & Auth
current_plan: 3 of 3
status: unknown
last_updated: "2026-03-30T06:00:00.000Z"
progress:
  total_phases: 6
  completed_phases: 0
  total_plans: 4
  completed_plans: 3
  percent: 75
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

**Current Phase:** 1 — Foundation & Auth
**Current Plan:** 3 of 3
**Phase Status:** In progress
**Overall Status:** In progress

```
Progress: [████████░░] 75%
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

- Plans executed: 2
- Plans succeeded first try: 2
- Plans required repair: 0
- Phases completed: 0

---

## Accumulated Context

### Key Decisions

- 01-01: Custom auth (bcryptjs+jose+Prisma) over Better Auth/Auth.js — Employee ID as sole identifier avoids auth library assumption fighting
- 01-01: Stateless JWT sessions in HttpOnly cookie with 7-day expiry (jose library, official Next.js 16 recommendation)
- 01-01: proxy.ts at project root for route protection (Next.js 16 breaking change — middleware.ts silently ignored with Turbopack)
- 01-01: mustChangePassword flag in both DB and JWT session for enforcement without extra DB call per request
- 01-01: UserRole enum array on User model for Phase 1 simplicity; join table if complex queries needed later
- 01-01: bcryptjs (pure JS) over bcrypt (native) for Server Action environment compatibility
- 01-01: DATABASE_URL in prisma.config.ts only — never in schema.prisma (Prisma 7 breaking change)
- 01-02: RSC page + client form component split — login/change-password pages are RSC; only the form components are "use client"
- 01-02: Route group (auth) for change-password screen — keeps URL /change-password while grouping captive screens without layout inheritance

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

**Last updated:** 2026-03-30 — Completed 01-02-PLAN.md (login UI + change-password UI)
**Next action:** Continue Phase 1 with 01-03-PLAN.md (dashboard shell + admin user management)

---
*State initialized: 2026-03-30*
