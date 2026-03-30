---
phase: 1
slug: foundation-auth
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `pnpm vitest run --reporter=verbose` |
| **Full suite command** | `pnpm vitest run --reporter=verbose --coverage` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run --reporter=verbose`
- **After every plan wave:** Run `pnpm vitest run --reporter=verbose --coverage`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 0 | - | infra | `pnpm vitest --version` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | AUTH-01 | unit | `pnpm vitest run tests/lib/auth.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | AUTH-02 | unit | `pnpm vitest run tests/lib/session.test.ts` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 2 | AUTH-03 | integration | `pnpm vitest run tests/api/users.test.ts` | ❌ W0 | ⬜ pending |
| 01-03-02 | 03 | 2 | AUTH-04 | integration | `pnpm vitest run tests/api/password-reset.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest` + `@vitejs/plugin-react` — install test framework
- [ ] `vitest.config.ts` — test configuration with path aliases
- [ ] `tests/` directory — test root
- [ ] `tests/setup.ts` — shared test setup (env vars, mocks)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Login form renders and submits | AUTH-02 | Browser interaction | Navigate to /login, enter Employee ID + password, verify redirect to dashboard |
| Dashboard shows role-appropriate content | AUTH-02 | Visual verification | Log in as each role, verify dashboard sections match role |
| Session persists across refresh | AUTH-03 | Browser behavior | Log in, refresh page, verify still authenticated |
| Forced password change flow | AUTH-04 | Multi-step UI flow | Reset password as admin, log in as user, verify forced change prompt |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
