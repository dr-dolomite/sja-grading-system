# Technology Stack

**Analysis Date:** 2026-03-30

## Languages

**Primary:**
- TypeScript 5.x - All application code (`.ts`, `.tsx`)

**Secondary:**
- CSS - Global styles via `app/globals.css` (Tailwind v4 CSS-first config)

## Runtime

**Environment:**
- Node.js 23.6.1 (detected on dev machine; no `.nvmrc` or `.node-version` pinned)

**Package Manager:**
- pnpm 10.24.0
- Lockfile: `pnpm-lock.yaml` (lockfileVersion 9.0) — present and committed
- Workspace config: `pnpm-workspace.yaml` (ignores sharp, unrs-resolver in built deps)

## Frameworks

**Core:**
- Next.js 16.2.1 - Full-stack React framework, App Router with React Server Components
- React 19.2.4 - UI rendering (RSC-first; `rsc: true` in `components.json`)

**Styling:**
- Tailwind CSS 4.x - CSS-first utility framework; configured entirely via `app/globals.css` `@theme` block (no `tailwind.config.*` file)
- tw-animate-css 1.4.0 - Animation utility classes, imported in `app/globals.css`
- shadcn 4.1.1 - Component registry/CLI for generating UI primitives

**Component Primitives:**
- radix-ui 1.4.3 - Headless primitive components (used directly as `radix-ui` package, not scoped `@radix-ui/*`)
- class-variance-authority 0.7.1 - Variant-based className composition (CVA)
- clsx 2.1.1 - Conditional className merging
- tailwind-merge 3.5.0 - Tailwind class conflict resolution
- lucide-react 1.7.0 - Icon library (configured as icon library in `components.json`)

**Build/Dev:**
- TypeScript compiler (via Next.js build pipeline) - Type checking with `strict: true`
- ESLint 9 - Linting; config at `eslint.config.mjs` using flat config format
- eslint-config-next 16.2.1 - Next.js rules (core-web-vitals + typescript presets)
- PostCSS - CSS processing via `@tailwindcss/postcss` plugin; config at `postcss.config.mjs`

## Key Dependencies

**Critical:**
- `next` 16.2.1 - Routing, rendering, image optimization, font loading; note this is a **major version ahead of training data** — read `node_modules/next/dist/docs/` before writing Next.js code
- `react` / `react-dom` 19.2.4 - RSC, concurrent features, new hooks API

**Infrastructure:**
- `shadcn` 4.1.1 - CLI tool for adding pre-built components; config at `components.json` (style: `radix-nova`, base color: `mist`)
- `radix-ui` 1.4.3 - Slot and primitive components used directly (e.g., `Slot.Root` in `components/ui/button.tsx`)

## Configuration

**Build:**
- `next.config.ts` - Minimal Next.js config; no custom options set
- `tsconfig.json` - `strict: true`, `moduleResolution: bundler`, path alias `@/*` → `./`
- `postcss.config.mjs` - Single plugin: `@tailwindcss/postcss`
- `eslint.config.mjs` - ESLint flat config (core-web-vitals + typescript, ignores `.next/`, `out/`, `build/`)

**Styling:**
- `app/globals.css` - Tailwind v4 `@theme inline` block defines all design tokens as CSS custom properties; light + dark mode variables; `@custom-variant dark` for `.dark` class strategy
- `components.json` - shadcn config: style `radix-nova`, RSC enabled, aliases for `@/components`, `@/lib`, `@/hooks`

**Environment:**
- No `.env` files detected; no environment variables required at this stage
- No runtime secrets configured

## Platform Requirements

**Development:**
- Node.js (23.x on dev machine; no constraint pinned)
- pnpm 10.x

**Production:**
- Compatible with Vercel (default create-next-app target; Vercel deploy links present in `app/page.tsx`)
- No deployment configuration files present (no `vercel.json`, `Dockerfile`, etc.)

**Fonts:**
- Google Fonts loaded via `next/font/google`: Geist, Geist Mono, Manrope

---

*Stack analysis: 2026-03-30*
