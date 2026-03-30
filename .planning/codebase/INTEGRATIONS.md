# External Integrations

**Analysis Date:** 2026-03-30

## APIs & External Services

**None detected.**

No third-party API SDKs are installed or imported in the current codebase. The project is a freshly scaffolded Next.js application with only UI primitives in place.

## Data Storage

**Databases:**
- None - No database client, ORM, or connection configuration is present.

**File Storage:**
- Local filesystem only - Static assets served from `public/` (SVGs, SJA logo images in `public/sja-logos/`).

**Caching:**
- None - No Redis, Memcached, or in-memory cache layer configured.

## Authentication & Identity

**Auth Provider:**
- None - No auth library (NextAuth, Clerk, Supabase Auth, etc.) is installed or configured.

## Monitoring & Observability

**Error Tracking:**
- None - No Sentry, Datadog, or equivalent SDK present.

**Logs:**
- Console only - No structured logging library in use.

**Analytics:**
- None detected.

## CI/CD & Deployment

**Hosting:**
- Vercel is the implied deployment target (Vercel deploy links present in `app/page.tsx`; no config file present yet).

**CI Pipeline:**
- None configured - No `.github/workflows/`, `.gitlab-ci.yml`, or equivalent.

## Environment Configuration

**Required env vars:**
- None required at this stage.

**Secrets location:**
- No `.env` files present; no secrets configured.

## Webhooks & Callbacks

**Incoming:**
- None - No API route handlers exist under `app/api/`.

**Outgoing:**
- None.

## Google Fonts (CDN)

**Next.js Font Optimization:**
- Geist, Geist Mono, Manrope are loaded via `next/font/google` in `app/layout.tsx`.
- At build time Next.js downloads and self-hosts these fonts; no runtime external font CDN request occurs in production.

## Notes on Future Integration Points

The SJA brand assets (`public/sja-logos/`) and the project name (`sja-grading-system`) indicate the application will eventually require:
- A data persistence layer (database) for student/grade records.
- Likely an authentication system for instructor/student roles.
- Possible external grading or LMS API integration.

None of these are implemented yet.

---

*Integration audit: 2026-03-30*
