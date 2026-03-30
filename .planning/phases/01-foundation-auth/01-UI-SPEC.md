---
phase: 1
name: "Foundation & Auth"
status: draft
created: 2026-03-30
---

# UI-SPEC: Phase 1 — Foundation & Auth

**Visual and interaction contract for the login, forced-password-change, and role-appropriate dashboard screens.**

---

## Design System

| Property | Value | Source |
|----------|-------|--------|
| Tool | shadcn/ui | components.json |
| Style | radix-nova | components.json |
| Base color | mist | components.json |
| Config mode | CSS-first (Tailwind v4 @theme) | app/globals.css |
| RSC | true | components.json |
| Icon library | lucide-react | components.json |
| Third-party registries | none | components.json `"registries": {}` |

### Registry Safety Gate
No third-party registries declared. Gate not applicable.

---

## Spacing Scale

8-point scale. All spacing values must be multiples of 4px.

| Token | Value | Use |
|-------|-------|-----|
| space-1 | 4px | Icon gap, tight inline spacing |
| space-2 | 8px | Field internal padding, badge padding |
| space-3 | 12px | Compact list items |
| space-4 | 16px | Standard gap between fields, card padding |
| space-5 | 20px | — |
| space-6 | 24px | Section padding, card gaps |
| space-8 | 32px | Page section vertical rhythm |
| space-10 | 40px | — |
| space-12 | 48px | Large section breaks |
| space-16 | 64px | Page-level top/bottom padding |

**Touch targets:** Interactive elements (buttons, sidebar menu items, dropdown items) must be a minimum of 44px tall. Sidebar uses `size="lg"` on `SidebarMenuButton` which satisfies this.

**Exception:** The login form card uses `max-w-xs` (320px) width constraint as established in the existing `app/login/page.tsx` template.

---

## Typography

Font stack defined in `app/layout.tsx`:
- **Body / UI:** Manrope (`--font-sans`) — loaded via `next/font/google`
- **Mono:** Geist Mono (`--font-geist-mono`) — for code/IDs if needed

### Type Scale (4 sizes)

| Role | Size | Weight | Line-height | Element |
|------|------|--------|-------------|---------|
| Heading large | 24px (text-2xl) | 700 (bold) | 1.2 | Login page h1, page titles |
| Heading medium | 20px (text-xl) | 600 (semibold) | 1.2 | Card titles, section headings |
| Body | 16px (text-base) | 400 (regular) | 1.5 | General content, field values |
| Small / Label | 14px (text-sm) | 400 (regular) | 1.4 | Field labels, descriptions, badges, muted text |

### Font Weights (2 weights)
- **Regular:** 400 — body text, descriptions, muted labels
- **Semibold:** 600 — headings, button labels, nav item titles, card titles

**Bold (700) exception:** Login page h1 only (`font-bold`), following the existing template pattern.

### Tabular numerals
Use `tabular-nums` class on any numeric stat displayed in dashboard summary cards (matches existing `SectionCards` pattern).

---

## Color Contract

Tokens are defined in `app/globals.css` using `oklch()`. All values below reference these CSS custom properties.

### 60 / 30 / 10 Split

| Role | Token | Value (light) | Usage |
|------|-------|---------------|-------|
| 60% Dominant surface | `--background` | `oklch(1 0 0)` — white | Page backgrounds, login right panel background via `bg-muted` |
| 30% Secondary | `--card`, `--sidebar`, `--muted` | Near-white mist tones | Cards, sidebar surface, input backgrounds, muted panels |
| 10% Accent | `--primary` | `oklch(0.532 0.157 131.589)` — forest green | Reserved for: primary CTA buttons, active sidebar item indicator, sidebar brand logo area, focus ring on inputs |

### Accent Reserved For (exhaustive list for this phase)
1. Primary "Sign in" button background
2. "Save Password" / "Set New Password" button background on change-password screen
3. Active/selected state of sidebar nav items (`sidebar-primary` token)
4. Input focus ring (`--ring` token, which maps to a muted version)
5. Role badge borders (optional, only if role pills are rendered on dashboard)

### Semantic Colors

| Token | Value (light) | Reserved For |
|-------|---------------|-------------|
| `--destructive` | `oklch(0.577 0.245 27.325)` — red | Destructive actions only: "Disable Account" confirmation button (Phase 1 Admin panel), field validation error text |
| `--muted-foreground` | `oklch(0.56 0.021 213.5)` — slate | Placeholder text, helper text, secondary metadata |

### Dark Mode
All tokens have dark-mode counterparts in `app/globals.css` under `.dark`. Dark mode is supported via `.dark` class strategy. Phase 1 does not implement a mode toggle — the app defaults to light mode. Dark mode CSS is present but not surfaced in UI.

---

## Component Inventory

All components from the existing scaffold. No new shadcn components need to be added for this phase.

### Login Screen

| Component | Import | Usage |
|-----------|--------|-------|
| `Field`, `FieldGroup`, `FieldLabel`, `FieldError`, `FieldDescription` | `@/components/ui/field` | Form field wrapper with vertical orientation |
| `Input` | `@/components/ui/input` | Employee ID field (type="text"), Password field (type="password") |
| `Button` | `@/components/ui/button` | Primary "Sign in" CTA (default variant, full-width) |
| `Toaster` / `sonner` | `@/components/ui/sonner` | Toast for non-field errors (e.g. account disabled) |

### Change Password Screen (forced flow)

| Component | Import | Usage |
|-----------|--------|-------|
| `Field`, `FieldGroup`, `FieldLabel`, `FieldError` | `@/components/ui/field` | New password + confirm password fields |
| `Input` | `@/components/ui/input` | Both password fields (type="password") |
| `Button` | `@/components/ui/button` | Primary "Set new password" CTA |

### Dashboard Shell

| Component | Import | Usage |
|-----------|--------|-------|
| `SidebarProvider`, `SidebarInset` | `@/components/ui/sidebar` | Layout wrapper — `variant="inset"` |
| `AppSidebar` | `@/components/app-sidebar` | Main nav sidebar with SJA branding |
| `SiteHeader` | `@/components/site-header` | Top bar with sidebar toggle and page title |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardFooter`, `CardAction` | `@/components/ui/card` | Role-section summary cards |
| `Badge` | `@/components/ui/badge` | Role pills shown in user profile area |
| `Avatar`, `AvatarFallback` | `@/components/ui/avatar` | User initials in sidebar footer |
| `DropdownMenu`, `DropdownMenuItem`, `DropdownMenuSeparator` | `@/components/ui/dropdown-menu` | Nav-user menu (Account, Log out) |
| `Skeleton` | `@/components/ui/skeleton` | Loading state for dashboard sections while session resolves |

### Admin: User Management Panel

| Component | Import | Usage |
|-----------|--------|-------|
| `Field`, `FieldGroup`, `FieldLabel`, `FieldError` | `@/components/ui/field` | Create User form fields |
| `Input` | `@/components/ui/input` | Employee ID, Full Name fields |
| `Select` | `@/components/ui/select` | Role multi-select (rendered as repeatable select or checkbox group) |
| `Checkbox` | `@/components/ui/checkbox` | Role checkboxes (five roles, multi-select) |
| `Button` | `@/components/ui/button` | "Create account" primary, "Reset password" secondary |
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` | `@/components/ui/table` | User list with Employee ID, Name, Roles, Status, Actions |
| `Badge` | `@/components/ui/badge` | Role tags in user list rows |
| `Sheet` | `@/components/ui/sheet` | "Create User" slide-in panel from the right |

---

## Screen Layouts

### 1. Login Page (`/login`)

**Layout:** Full-viewport split grid — left column (form), right column (decorative).

```
┌──────────────────┬──────────────────┐
│  Logo + App name │                  │
│                  │  SJA logo /      │
│  [Employee ID]   │  decorative bg   │
│  [Password]      │  (bg-muted)      │
│  [Sign in btn]   │                  │
│                  │                  │
└──────────────────┴──────────────────┘
```

- Left column: `flex flex-col gap-4 p-6 md:p-10`
- Right column: `hidden lg:block` — hidden below lg breakpoint
- Form container: `w-full max-w-xs` centered vertically in left column
- Logo area: SJA logo from `public/sja-logos/sja-logo-transparent.png` using `next/image`, 32px height, with "SJA Grading System" text beside it
- Remove GitHub OAuth button and "Don't have an account? Sign up" link from the template — these are not applicable

### 2. Forced Password Change Page (`/change-password`)

**Layout:** Centered single-column card. No sidebar. No decorative panel.

```
┌────────────────────────────────────┐
│         SJA logo + app name        │
│                                    │
│  [Card]                            │
│   "Set your new password"          │
│   [New password]                   │
│   [Confirm new password]           │
│   [Set new password btn]           │
│   helper: requirements listed      │
└────────────────────────────────────┘
```

- Outer: `min-h-svh flex items-center justify-center p-6`
- Card: `w-full max-w-sm`
- No navigation, no sidebar — this is a captive screen

### 3. Dashboard Page (`/dashboard`)

**Layout:** Sidebar + inset content area. Matches existing template structure.

```
┌────────────┬──────────────────────────────────┐
│            │  [SiteHeader]                    │
│  Sidebar   │  Role-section cards (grid)       │
│  ─────     │                                  │
│  nav items │  [Only sections for user's roles]│
│  ─────     │                                  │
│  [user]    │                                  │
└────────────┴──────────────────────────────────┘
```

- Sidebar width: `calc(var(--spacing) * 72)` (established in template)
- Header height: `calc(var(--spacing) * 12)` (established in template)
- Content padding: `py-4 px-4 md:gap-6 md:py-6 lg:px-6`
- Role sections: rendered conditionally based on `session.roles` array — no content rendered for roles the user does not hold

### 4. Admin: User Management (`/dashboard/users`)

**Layout:** Full-width within the sidebar shell. Sheet slide-in for create/edit.

- User table: full-width within `SidebarInset` content area
- "Create user" action: `Button` variant="default" in page header area, triggers `Sheet` from right
- Sheet width: 400px (default sheet width)
- Table columns: Employee ID | Full Name | Roles | Status | Actions

---

## Interaction Contracts

### Login Form

| State | Visual |
|-------|--------|
| Default | Employee ID and password fields, "Sign in" button enabled |
| Submitting | Button shows loading spinner (`disabled` + `aria-busy="true"`); fields remain filled |
| Field error | `FieldError` below each invalid field in `text-destructive`; field border shifts to destructive ring |
| Auth failure | Generic error: "Invalid credentials. Check your Employee ID and password." rendered via `FieldError` above the form (not specific to either field — prevents user enumeration) |
| Account disabled | Toast (sonner): "Your account has been deactivated. Contact your administrator." |
| Success + mustChangePassword=true | Redirect to `/change-password` |
| Success + mustChangePassword=false | Redirect to `/dashboard` |

### Change Password Form

| State | Visual |
|-------|--------|
| Default | Two password fields, helper text listing requirements, "Set new password" button |
| Mismatch | `FieldError` on confirm field: "Passwords do not match." |
| Too short | `FieldError` on new password field: "Password must be at least 8 characters." |
| Submitting | Button disabled + spinner |
| Success | Redirect to `/dashboard`; toast: "Password updated. Welcome to SJA Grading System." |

Password requirements display (shown as static helper text below new-password field):
- At least 8 characters
- Rendered as `FieldDescription` component, always visible (not tooltip)

### Dashboard — Role Sections

| Role | Section shown |
|------|---------------|
| SUBJECT_TEACHER | "My Subjects" placeholder card (content built in Phase 4) |
| ADVISER | "My Section" placeholder card (content built in Phase 5) |
| PRINCIPAL | "School Overview" placeholder card (content built in Phase 6) |
| REGISTRAR | "Grade Records" placeholder card (content built in Phase 6) |
| ADMIN | "User Management" card with "Manage users" quick-link |

Multi-role users see all applicable sections stacked vertically. Each section uses the `Card` component with `CardHeader` + `CardDescription` noting "Available in a later phase" for non-Admin sections in Phase 1.

### Sidebar Navigation (Phase 1 scope)

| Item | Icon | Route | Visible To |
|------|------|-------|------------|
| Dashboard | `LayoutDashboardIcon` | `/dashboard` | All roles |
| Users | `UsersIcon` | `/dashboard/users` | ADMIN only |
| Settings | `Settings2Icon` | `/dashboard/settings` | All roles (placeholder) |

Non-Admin users do not see the "Users" nav item. Use conditional rendering based on session roles.

### Nav User Dropdown (sidebar footer)

| Item | Behavior |
|------|----------|
| Display name | Full name from session |
| Sub-label | Employee ID (not email — users have no email in this system) |
| Avatar | `AvatarFallback` with 2-letter initials (no photo in Phase 1) |
| "Account" menu item | Placeholder — no action yet |
| "Log out" | Calls `logout()` Server Action → deletes session cookie → redirects to `/login` |

Remove "Billing" and "Notifications" from the `NavUser` dropdown template — not applicable to this system.

### Admin: Create User Flow

| Step | Visual |
|------|--------|
| Trigger | "Create account" button in Users page header |
| Panel opens | `Sheet` from right, title "Create account" |
| Form fields | Employee ID (text, required), Full Name (text, required), Roles (checkboxes for all 5 roles, at least 1 required) |
| Submitting | Submit button disabled + spinner |
| Success | Sheet closes; toast: "Account created. Employee ID: [ID]"; table row added |
| Duplicate Employee ID | `FieldError` on Employee ID field: "This Employee ID is already in use." |

### Admin: Reset Password Flow

| Step | Visual |
|------|--------|
| Trigger | "Reset password" button in user table row Actions column |
| Confirmation | Inline confirmation within the row or a small `Sheet` — no modal dialog component installed |
| Copy: confirm prompt | "Reset [Full Name]'s password? They will be required to set a new password on next login." |
| CTA label | "Reset password" (destructive Button variant) |
| Cancel | "Cancel" (outline Button variant) |
| Success | Toast: "Password reset. [Name] will be prompted to set a new password on next login." |

---

## Copywriting Contract

### Primary CTAs

| Screen | CTA Label | Button Variant |
|--------|-----------|---------------|
| Login | "Sign in" | default (primary) |
| Change password | "Set new password" | default (primary) |
| Create user (Admin) | "Create account" | default (primary) |
| Reset password confirm | "Reset password" | destructive |

### Empty States

| Context | Copy |
|---------|-------|
| User table (no users yet) | "No user accounts yet. Create the first account to get started." |
| Dashboard role section (non-Admin in Phase 1) | "[Section name] — available in a later phase." |

### Error States

| Context | Copy |
|---------|-------|
| Login: invalid credentials | "Invalid credentials. Check your Employee ID and password." |
| Login: account disabled | "Your account has been deactivated. Contact your administrator." |
| Change password: mismatch | "Passwords do not match." |
| Change password: too short | "Password must be at least 8 characters." |
| Create user: duplicate ID | "This Employee ID is already in use." |
| Create user: no role selected | "Select at least one role." |
| Generic server error | "Something went wrong. Please try again." |

### Destructive Actions in This Phase

| Action | Trigger | Confirmation Approach | Confirm CTA | Cancel CTA |
|--------|---------|----------------------|-------------|------------|
| Reset user password | "Reset password" button in user table row | Inline confirmation text in the same row area or right-side Sheet | "Reset password" (destructive variant) | "Cancel" (outline variant) |
| Disable account | "Disable" button in user table row (AUTH-01 scope) | Same inline/Sheet confirmation pattern | "Disable account" (destructive variant) | "Cancel" (outline variant) |

**Note:** No `AlertDialog` component is installed. Use `Sheet` or inline row state for confirmations. Do not add `AlertDialog` for Phase 1.

---

## Branding

### SJA Logo Usage
- **Login page:** `public/sja-logos/sja-logo-transparent.png` via `next/image` — height 32px, auto width, placed top-left of the form column alongside "SJA Grading System" text (replaces the generic "Acme Inc." placeholder in the template)
- **Sidebar header:** Same logo asset, height 24px, beside "SJA Grading System" span text in the `SidebarMenuButton`
- **Change password page:** Same logo, height 32px, centered above the card

### App Name
Canonical string: **"SJA Grading System"**
Display in: sidebar header, login page logo area, change-password page, `<title>` metadata.

---

## Accessibility

- All form fields use `FieldLabel` with `htmlFor` matching the `Input` `id` — no unlabeled inputs
- Error messages use `role="alert"` (provided by `FieldError` component's `role="alert"` attribute)
- Login button has `aria-busy="true"` when submitting
- Sidebar navigation items use `aria-current="page"` on the active route
- Color contrast: shadcn radix-nova mist tokens are designed to meet WCAG AA at minimum — do not override these values with lighter variants
- Focus ring: `outline-ring/50` applied globally via `app/globals.css` `@layer base`

---

## Responsive Behavior

| Breakpoint | Login Page | Dashboard |
|------------|------------|-----------|
| < 1024px (lg) | Single column — right panel hidden | Sidebar collapses to offcanvas (hamburger trigger in SiteHeader) |
| >= 1024px | Split two-column | Sidebar visible inline |

Dashboard sidebar uses `collapsible="offcanvas"` (established in template). No changes needed.

---

## What This Phase Does NOT Include

- Dark mode toggle (tokens exist but no UI control in Phase 1)
- User profile photo upload
- "Forgot password" self-service link (admin-assisted only — remove from login template)
- GitHub / OAuth login buttons (remove from login template)
- "Don't have an account? Sign up" link (remove from login template)
- Notification bell or billing items in nav-user dropdown (remove from template)

---

## Pre-population Sources

| Field | Source |
|-------|--------|
| Design system (shadcn, radix-nova, mist) | `components.json` — detected automatically |
| Color tokens (all) | `app/globals.css` `@theme` + `:root` block |
| Font stack (Manrope primary) | `app/layout.tsx` |
| Sidebar layout dimensions | `app/dashboard/page.tsx` template |
| Existing component inventory (24 components) | `components/ui/` directory scan |
| Login page layout | `app/login/page.tsx` template |
| Login form structure | `components/login-form.tsx` template |
| Sidebar structure | `components/app-sidebar.tsx`, `components/nav-user.tsx` templates |
| Dashboard card pattern | `components/section-cards.tsx` template |
| Employee ID as login identifier | `01-CONTEXT.md` D-03 |
| Admin-only account creation | `01-CONTEXT.md` D-01 |
| No self-service password reset | `01-CONTEXT.md` D-05 |
| Forced password change flow | `01-CONTEXT.md` D-06, D-07 |
| Five roles, multi-role additive | `01-CONTEXT.md` D-08, D-09 |
| Unified dashboard (no role switcher) | `01-CONTEXT.md` D-11 |
| SJA logos available | `public/sja-logos/` directory scan |

---

*Phase: 01-foundation-auth*
*UI-SPEC created: 2026-03-30*
*Status: draft — pending checker validation*
