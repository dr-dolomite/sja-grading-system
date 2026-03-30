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
**Current Plan:** None (not started)
**Phase Status:** Not started
**Overall Status:** Not started

```
Progress: [          ] 0/6 phases complete
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

- Plans executed: 0
- Plans succeeded first try: 0
- Plans required repair: 0
- Phases completed: 0

---

## Accumulated Context

### Key Decisions
*(None yet — populated during implementation)*

### Active Blockers
*(None)*

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

**Last updated:** 2026-03-30 — Roadmap created, ready to begin Phase 1 planning
**Next action:** Run `/gsd:plan-phase 1` to plan Phase 1: Foundation & Auth

---
*State initialized: 2026-03-30*
