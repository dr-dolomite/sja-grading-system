# Phase 1: Foundation & Auth - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can securely authenticate using Employee ID + password and land on role-appropriate unified dashboards. The PostgreSQL database and Prisma backend layer are operational. Admin can create and manage user accounts. This phase establishes the authentication foundation that all subsequent phases build on.

</domain>

<decisions>
## Implementation Decisions

### Account Provisioning
- **D-01:** Admin-only account creation. No self-registration. Only users with the Admin role can create new accounts and assign roles.
- **D-02:** One account at a time via a form. No bulk import or CSV upload for v1.
- **D-03:** Login credentials are Employee ID + password. Employee ID is the unique login identifier (not username or email).
- **D-04:** First admin account is bootstrapped via a CLI seed command (e.g., `pnpm db:seed`) with known default credentials.

### Password Reset
- **D-05:** Admin-assisted password reset only. No self-service reset (no email, no security questions). Teacher contacts Admin, Admin resets from admin panel.
- **D-06:** Forced password change after admin reset. When Admin resets a user's password, the user must set a new password on next login.
- **D-07:** Seed admin also requires forced password change on first login. Same rule applies to the bootstrapped admin account — default credentials cannot persist.

### User Roles
- **D-08:** Five roles: Subject Teacher, Adviser, Principal, Registrar, Admin.
- **D-09:** Multi-role support. A single user can hold multiple roles (e.g., Teacher + Adviser). Permissions are additive across assigned roles.
- **D-10:** No role hierarchy. Each role grants specific, explicit permissions. Higher roles do NOT inherit lower role capabilities. A Principal who needs to enter grades must also be assigned the Teacher role.
- **D-11:** Unified dashboard for multi-role users. One dashboard that combines sections from all assigned roles. No role switcher.

### Claude's Discretion
- Dashboard landing experience: What each role sees on their dashboard (summary cards, action shortcuts, navigation) — Claude decides based on what's built in later phases.
- Login page design: Layout, branding, use of SJA logos — Claude decides, incorporating SJA brand assets from `public/sja-logos/`.
- Auth library choice: Whether to use NextAuth.js/Auth.js, Lucia, or custom auth — Claude decides based on Next.js 16 compatibility and local-hosting constraints.
- Session management strategy: Cookie-based sessions, JWT, or framework-provided — Claude decides based on the auth library chosen.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Requirements
- `.planning/REQUIREMENTS.md` — AUTH-01 through AUTH-04 define the acceptance criteria for this phase
- `.planning/PROJECT.md` — Project constraints, context (school scale, roles, local hosting)
- `.planning/ROADMAP.md` — Phase 1 success criteria and dependencies

### Codebase Analysis
- `.planning/codebase/ARCHITECTURE.md` — Current app architecture (greenfield, no backend yet)
- `.planning/codebase/STACK.md` — Technology stack details (Next.js 16, React 19, shadcn/ui)
- `.planning/codebase/CONVENTIONS.md` — Coding conventions to follow

### Next.js 16
- `node_modules/next/dist/docs/` — Next.js 16 documentation (MUST read before writing Next.js code — version is ahead of training data)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/ui/button.tsx`: Button component with CVA variants — use for login form, admin panel actions
- `lib/utils.ts`: `cn()` utility for class merging — use everywhere
- `public/sja-logos/`: SJA brand logos — use on login page
- `app/globals.css`: Design tokens (colors, radius, fonts) already defined — use existing theme

### Established Patterns
- shadcn/ui radix-nova style for all UI components — add more via `shadcn` CLI as needed (Input, Card, Form, etc.)
- Tailwind v4 CSS-first configuration — no tailwind.config file, all tokens in CSS custom properties
- React Server Components by default, `"use client"` opt-in for interactive components
- Named exports for components, default exports for pages/layouts

### Integration Points
- `app/layout.tsx`: Root layout — will need auth provider/session wrapper
- `app/page.tsx`: Currently scaffold placeholder — will become login page or redirect to dashboard
- No `middleware.ts` yet — will need for route protection
- No `prisma/` directory yet — schema and client setup needed from scratch
- No `.env` file yet — will need for database connection string

</code_context>

<specifics>
## Specific Ideas

- Employee ID as login identifier aligns with school's existing record-keeping system
- Forced password change on first login (both seed admin and admin-reset accounts) ensures no default credentials persist in production
- Multi-role with additive permissions matches school reality where teachers often serve as section advisers

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-auth*
*Context gathered: 2026-03-30*
