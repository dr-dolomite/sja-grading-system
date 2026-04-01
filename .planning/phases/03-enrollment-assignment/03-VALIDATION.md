---
phase: 3
slug: enrollment-assignment
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no test infrastructure exists yet |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | N/A |
| **Full suite command** | N/A |
| **Estimated runtime** | N/A |

---

## Sampling Rate

- **After every task commit:** Manual verification via acceptance criteria
- **After every plan wave:** Manual verification of all wave outputs
- **Before `/gsd:verify-work`:** All manual verification steps must pass
- **Max feedback latency:** N/A (no automated tests)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | ENRL-01 | manual | N/A | N/A | pending |
| 03-01-02 | 01 | 1 | ENRL-01 | manual | N/A | N/A | pending |
| 03-02-01 | 02 | 1 | ENRL-02 | manual | N/A | N/A | pending |
| 03-03-01 | 03 | 2 | ENRL-01 | manual | N/A | N/A | pending |
| 03-04-01 | 04 | 2 | ENRL-02 | manual | N/A | N/A | pending |
| 03-05-01 | 05 | 3 | ENRL-03 | manual | N/A | N/A | pending |
| 03-06-01 | 06 | 3 | ENRL-04 | manual | N/A | N/A | pending |
| 03-07-01 | 07 | 3 | ENRL-01 | manual | N/A | N/A | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

*No automated test framework exists in the project. Phases 1 and 2 were completed without test infrastructure. If automated validation is desired, Wave 0 should add vitest + basic configuration. Decision deferred to planner.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Create student profile | ENRL-01 | No test infra | Fill form with valid data, submit, verify student appears in table |
| Edit student profile | ENRL-01 | No test infra | Click edit on existing student, modify field, submit, verify update |
| Duplicate LRN rejected | ENRL-01 | No test infra | Submit student with existing LRN, verify error message |
| Auto-enroll on section assignment | ENRL-02 | No test infra | Create student in section, check DB for StudentEnrollment records |
| Assign teacher to subject-section | ENRL-03 | No test infra | Select teacher, submit, verify Assigned Teacher column |
| Assign adviser to section | ENRL-04 | No test infra | Select adviser, submit, verify section row shows adviser |
| CSV import valid rows | ENRL-01 | No test infra | Upload valid CSV, import, verify count matches |
| CSV import invalid rows | ENRL-01 | No test infra | Upload CSV with bad rows, verify preview shows errors |

---

## Validation Sign-Off

- [ ] All tasks have manual verification steps or Wave 0 dependencies
- [ ] Sampling continuity: manual verification after each task
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency: N/A (manual)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
