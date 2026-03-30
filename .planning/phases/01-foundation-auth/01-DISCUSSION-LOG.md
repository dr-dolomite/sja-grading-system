# Phase 1: Foundation & Auth - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-30
**Phase:** 01-foundation-auth
**Areas discussed:** Account provisioning, Password reset flow, User roles

---

## Account Provisioning

### Account Creation Method

| Option | Description | Selected |
|--------|-------------|----------|
| Admin-only creation (Recommended) | Only Admin role can create accounts and assign roles. No self-registration. Fits school hierarchy where IT/admin onboards staff. | ✓ |
| Admin creates + Principal assists | Admin and Principal can both create accounts. Spreads the workload for larger staff. | |
| Self-registration with approval | Teachers can register themselves, but Admin must approve and assign role before access is granted. | |

**User's choice:** Admin-only creation
**Notes:** None

### First Admin Bootstrap

| Option | Description | Selected |
|--------|-------------|----------|
| Seed command (Recommended) | A CLI command (e.g., pnpm db:seed) creates a default admin with known credentials. Admin changes password on first login. | ✓ |
| Setup wizard | On first launch, if no users exist, show a one-time setup page to create the initial admin account. | |
| Environment variable | Default admin credentials set via .env file. Simple but requires manual config. | |

**User's choice:** Seed command
**Notes:** None

### Bulk Account Creation

| Option | Description | Selected |
|--------|-------------|----------|
| One at a time (Recommended) | Simple form — create one account, assign role, done. Sufficient for 20-40 teachers. | ✓ |
| One at a time + CSV import | Single-create form plus a CSV upload option for bulk onboarding at start of school year. | |

**User's choice:** One at a time
**Notes:** None

### Login Credentials

| Option | Description | Selected |
|--------|-------------|----------|
| Username + password (Recommended) | Admin sets a username and temporary password. Simple, no email dependency. Works well for local-network deployment. | |
| Email + password | Users log in with email and password. Requires teachers to have email addresses on file. | |
| Employee ID + password | Uses school employee/teacher ID as the login identifier. Ties into existing school records. | ✓ |

**User's choice:** Employee ID + password
**Notes:** User chose Employee ID over username — ties into existing school record-keeping system.

---

## Password Reset Flow

### Reset Mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| Admin resets password (Recommended) | Teacher asks Admin to reset. Admin generates a temporary password from the admin panel. Teacher changes it on next login. Simple, fits school workflow. | ✓ |
| Self-service with security question | User answers a security question set during account creation, then sets a new password. No admin involvement needed. | |
| Admin reset + self-service option | Admin can reset from panel, AND users can reset via security question. Both paths available. | |

**User's choice:** Admin resets password
**Notes:** None

### Forced Password Change After Reset

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, force change (Recommended) | After admin resets password, user must set a new password on next login. Prevents shared temporary passwords from lingering. | ✓ |
| No, optional | User can keep the temporary password if they want. Less friction but less secure. | |

**User's choice:** Yes, force change
**Notes:** None

### Seed Admin Password Change

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, same rule (Recommended) | Seed admin gets a known default password and must change it on first login. Consistent behavior, prevents default credentials from staying active. | ✓ |
| No, seed is different | Seed admin can keep the default password. Simpler for dev/testing but less secure in production. | |

**User's choice:** Yes, same rule
**Notes:** None

---

## User Roles

### Multiple Roles Per User

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, multiple roles (Recommended) | A user can be assigned multiple roles. Common in schools — a teacher is often also an adviser. Each role grants its permissions additively. | ✓ |
| One role per account | Each account has exactly one role. If someone needs two roles, they get two accounts. | |
| Teacher + Adviser combined | Teacher and Adviser are automatically linked (all teachers can be advisers), but other roles are separate. | |

**User's choice:** Yes, multiple roles
**Notes:** None

### Role Hierarchy

| Option | Description | Selected |
|--------|-------------|----------|
| No hierarchy — explicit roles only (Recommended) | Each role grants specific permissions. Principal gets principal-specific access, not teacher access. If principal needs to enter grades, assign them Teacher role too. Cleaner, less ambiguity. | ✓ |
| Yes, hierarchical | Admin > Principal > Registrar > Adviser > Teacher. Higher roles can do everything below them. Simpler role assignment but may grant unintended access. | |

**User's choice:** No hierarchy — explicit roles only
**Notes:** None

### Multi-Role Dashboard

| Option | Description | Selected |
|--------|-------------|----------|
| Unified dashboard (Recommended) | One dashboard that combines sections from all assigned roles. A Teacher+Adviser sees both teacher tools and adviser tools in one place. | ✓ |
| Role switcher | User picks which role to "act as" from a dropdown. Dashboard changes based on active role. Keeps each view focused. | |
| You decide | Claude picks the best approach during implementation based on the UI complexity. | |

**User's choice:** Unified dashboard
**Notes:** None

---

## Claude's Discretion

- Dashboard landing experience (content, layout, widgets per role)
- Login page design and branding
- Auth library selection (NextAuth.js, Lucia, or custom)
- Session management strategy

## Deferred Ideas

None — discussion stayed within phase scope
