---
phase: 2
slug: school-structure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | STRUCT-01 | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | STRUCT-01 | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | STRUCT-02 | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 1 | STRUCT-02 | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 1 | STRUCT-03 | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | ❌ W0 | ⬜ pending |
| 02-04-01 | 04 | 1 | STRUCT-04 | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | ❌ W0 | ⬜ pending |
| 02-04-02 | 04 | 1 | STRUCT-04 | unit | `pnpm test -- --reporter=verbose tests/actions/school-structure.test.ts` | ❌ W0 | ⬜ pending |
| 02-04-03 | 04 | 1 | STRUCT-04 | unit | `pnpm test -- --reporter=verbose tests/lib/subject-type-presets.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/actions/school-structure.test.ts` — stubs for STRUCT-01, STRUCT-02, STRUCT-03, STRUCT-04
- [ ] `tests/lib/subject-type-presets.test.ts` — stubs for STRUCT-04 preset logic
- [ ] Extend `tests/setup.ts` mock for new Prisma models: `schoolYear`, `gradingPeriod`, `gradeLevelEntry`, `strand`, `section`, `subject`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Copy from previous year clones complete structure | STRUCT-01 | Complex multi-model transaction needs visual confirmation of clone fidelity | 1. Create SY with grades/sections/subjects 2. Create new SY and use "Copy" 3. Verify all entities cloned correctly |
| Sheet form UX for subject weight configuration | STRUCT-04 | Visual/interaction quality not testable by unit tests | 1. Open subject creation sheet 2. Select a subject type 3. Verify weights auto-fill 4. Override a weight, verify sum validation |
| Sidebar navigation shows only for ADMIN | ALL | Role-based visibility is an integration concern | 1. Log in as ADMIN — verify "School Structure" in sidebar 2. Log in as TEACHER — verify item absent |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
