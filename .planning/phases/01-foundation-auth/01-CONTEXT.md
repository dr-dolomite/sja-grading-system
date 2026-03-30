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

### Foundational Frontend Templates (user-provided, use as base)
- `app/login/page.tsx` + `components/login-form.tsx`: Login page with split layout (form left, image right). Adapt fields to use Employee ID instead of email.
- `app/dashboard/page.tsx`: Dashboard page with sidebar integration, metric cards, interactive chart, and data table. Use as the role-appropriate dashboard shell.
- `components/app-sidebar.tsx`: Main sidebar wrapper with branding and navigation structure — foundational navigation component.
- `components/nav-main.tsx`: Primary navigation menu with icons and quick-create button.
- `components/nav-user.tsx`: User profile dropdown in sidebar footer (Account, Notifications, Logout).
- `components/nav-documents.tsx`: Document/resource section with actions dropdown.
- `components/nav-secondary.tsx`: Secondary navigation (Settings, Help, Search).
- `components/site-header.tsx`: Top header bar with sidebar trigger and page title.
- `components/section-cards.tsx`: Metric summary cards — adapt for role-specific dashboard data.
- `components/chart-area-interactive.tsx`: Interactive area chart with Recharts — available for dashboard analytics.
- `components/data-table.tsx`: Complex data table with sorting, filtering, pagination, drag-reorder (TanStack React Table + dnd-kit).

### Reusable UI Components (24 shadcn/ui components installed)
- Form elements: `input.tsx`, `label.tsx`, `field.tsx` (custom, with vertical/horizontal variants, error states), `select.tsx`, `checkbox.tsx`
- Navigation: `sidebar.tsx`, `breadcrumb.tsx`, `dropdown-menu.tsx`
- Display: `card.tsx`, `badge.tsx`, `avatar.tsx`, `separator.tsx`, `skeleton.tsx`, `table.tsx`
- Interactive: `button.tsx`, `tabs.tsx`, `toggle.tsx`, `toggle-group.tsx`, `sheet.tsx`, `drawer.tsx`
- Feedback: `tooltip.tsx`, `sonner.tsx` (toast notifications)
- Data visualization: `chart.tsx` (Recharts integration)

### Utilities & Hooks
- `lib/utils.ts`: `cn()` utility for class merging
- `hooks/use-mobile.ts`: Mobile breakpoint detection (768px threshold)
- `public/sja-logos/`: SJA brand logos
- `app/globals.css`: Design tokens (colors, radius, fonts) with light/dark mode

### Established Patterns
- shadcn/ui radix-nova style with CVA variants and `data-slot` attributes
- Compound component pattern (Field, Card, Sidebar with context providers)
- `SidebarProvider` / `useSidebar` for sidebar state management
- Tailwind v4 CSS-first configuration with container queries (`@container`)
- `"use client"` directive on interactive components; RSC by default for pages/layouts
- `app/layout.tsx` already wraps with `TooltipProvider` and Sonner `<Toaster>`

### Integration Points
- `app/layout.tsx`: Root layout — already has TooltipProvider/Toaster, will need auth provider/session wrapper added
- `app/login/page.tsx`: Login page exists — adapt Employee ID field, wire to auth backend
- `app/dashboard/page.tsx`: Dashboard exists — wire to auth-gated route, adapt content per role
- `components/nav-user.tsx`: User dropdown exists — wire Logout action to auth signout
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
