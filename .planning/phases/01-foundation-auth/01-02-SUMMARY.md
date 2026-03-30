---
phase: 01-foundation-auth
plan: 02
subsystem: auth-ui
tags: [login, change-password, useActionState, server-actions, shadcn, next-image]
dependency_graph:
  requires: [01-01]
  provides: [login-page, change-password-page]
  affects: [app/login/page.tsx, components/login-form.tsx, app/(auth)/change-password/page.tsx, components/change-password-form.tsx]
tech_stack:
  added: []
  patterns: [useActionState, RSC-page + client-form split, route-group (auth)]
key_files:
  created:
    - app/(auth)/change-password/page.tsx
    - components/change-password-form.tsx
  modified:
    - app/login/page.tsx
    - components/login-form.tsx
decisions:
  - "RSC page + client form component split: login page is RSC, LoginForm is client — follows Next.js 16 pattern"
  - "Route group (auth) for change-password: groups captive auth screens without affecting URL path"
  - "useActionState<T, FormData> generic form: explicit generics required for TypeScript strict mode"
metrics:
  duration_minutes: 12
  completed: 2026-03-30
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 2
---

# Phase 1 Plan 2: Login UI and Change-Password UI Summary

Login and change-password pages wired to plan 01 Server Actions using useActionState, with SJA branding replacing all template placeholders.

---

## What Was Built

**Login Page (`/login`):** Adapted existing template — removed `"use client"` from page (it's now an RSC), replaced Acme Inc. branding with SJA logo via `next/image`, replaced email field with Employee ID (type="text"), removed GitHub OAuth button and signup/forgot-password links. The right panel uses the SJA logo as a faded watermark.

**LoginForm component:** Rewritten to use `useActionState` wired to the `login` Server Action from Plan 01. Shows `state.errors.form` (form-level errors) in a `role="alert"` div, and per-field errors below each input via `FieldError`. Button shows "Signing in..." while pending with `disabled` + `aria-busy`.

**Change Password Page (`app/(auth)/change-password/page.tsx`):** New captive screen — centered card layout with SJA logo above the card, `Card` + `CardHeader` with "Set your new password" heading, no sidebar or navigation.

**ChangePasswordForm component:** Uses `useActionState` with `changePassword` Server Action. New password field has always-visible `FieldDescription` "At least 8 characters." Both fields use `autoComplete="new-password"`. Button label is "Set new password" per UI-SPEC copywriting contract.

---

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Adapt login page with SJA branding and Employee ID field | 4a613a0 | app/login/page.tsx, components/login-form.tsx |
| 2 | Create forced password change page and form | c455088 | app/(auth)/change-password/page.tsx, components/change-password-form.tsx |

---

## Deviations from Plan

None — plan executed exactly as written.

---

## Known Stubs

None — both pages are fully wired to Server Actions from Plan 01. No placeholder data or hardcoded values.

---

## Self-Check: PASSED

Files verified:
- FOUND: app/login/page.tsx
- FOUND: components/login-form.tsx
- FOUND: app/(auth)/change-password/page.tsx
- FOUND: components/change-password-form.tsx

Commits verified:
- FOUND: 4a613a0 feat(01-02): adapt login page with SJA branding and Employee ID field
- FOUND: c455088 feat(01-02): create forced password change page and form

TypeScript: Zero errors in new/modified files (pre-existing Prisma client generation error from Plan 01 unrelated to this plan).
