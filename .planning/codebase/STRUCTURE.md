# Codebase Structure

**Analysis Date:** 2026-03-30

## Directory Layout

```
sja-grading-system/
├── app/                    # Next.js App Router — routes, layouts, global CSS
│   ├── favicon.ico         # Browser tab icon
│   ├── globals.css         # Global CSS, Tailwind v4 @theme tokens, :root + .dark vars
│   ├── layout.tsx          # Root layout — HTML shell, fonts, body wrapper
│   └── page.tsx            # Home route (/)
├── components/             # Reusable React components
│   └── ui/                 # shadcn/ui primitive components
│       └── button.tsx      # Button with CVA variant map
├── lib/                    # Shared non-component utilities
│   └── utils.ts            # cn() helper (clsx + tailwind-merge)
├── public/                 # Static assets served at /
│   ├── sja-logos/          # SJA brand images (PNG)
│   │   ├── sja-logo-solid-bg.png
│   │   └── sja-logo-transparent.png
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── .planning/              # GSD planning docs (not shipped)
│   └── codebase/           # Codebase analysis documents
├── .next/                  # Next.js build output (generated, not committed)
├── node_modules/           # Dependencies (generated, not committed)
├── AGENTS.md               # AI agent instructions
├── CLAUDE.md               # Claude-specific project instructions
├── README.md               # Project readme
├── components.json         # shadcn/ui CLI configuration
├── eslint.config.mjs       # ESLint flat config (Next.js core-web-vitals + TS)
├── next.config.ts          # Next.js configuration (minimal)
├── next-env.d.ts           # Next.js TypeScript ambient declarations (generated)
├── package.json            # Dependency manifest
├── pnpm-lock.yaml          # Lockfile (pnpm)
├── pnpm-workspace.yaml     # pnpm workspace config
├── postcss.config.mjs      # PostCSS config for Tailwind v4
└── tsconfig.json           # TypeScript compiler config
```

## Directory Purposes

**`app/`:**
- Purpose: All Next.js App Router routes, layouts, and global styles
- Contains: `page.tsx` (route segments), `layout.tsx` (shared shells), `globals.css`, `favicon.ico`
- Key files: `app/layout.tsx` (root shell), `app/globals.css` (all design tokens)

**`components/ui/`:**
- Purpose: shadcn/ui primitive UI components — accessible, styled with CVA + Tailwind
- Contains: One file per component, each exporting the component and its CVA variant config
- Key files: `components/ui/button.tsx`

**`lib/`:**
- Purpose: Shared utility functions used across the app
- Contains: Pure TypeScript helper modules (no React)
- Key files: `lib/utils.ts` (`cn()`)

**`public/`:**
- Purpose: Static files served as-is at the root URL path
- Contains: SVG icons, SJA brand logos
- Key files: `public/sja-logos/sja-logo-transparent.png`, `public/sja-logos/sja-logo-solid-bg.png`

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis documents for AI-assisted planning
- Generated: Yes (by GSD map-codebase)
- Committed: Yes

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root HTML shell, applies to every page
- `app/page.tsx`: Home route at `/`

**Configuration:**
- `next.config.ts`: Next.js configuration
- `tsconfig.json`: TypeScript settings; defines `@/*` path alias mapped to project root
- `components.json`: shadcn/ui CLI config — controls style (`radix-nova`), aliases, icon library
- `eslint.config.mjs`: ESLint flat config with Next.js core web vitals + TypeScript rules
- `postcss.config.mjs`: PostCSS pipeline for Tailwind v4
- `pnpm-workspace.yaml`: pnpm workspace definition

**Core Logic:**
- `lib/utils.ts`: `cn()` — the single shared utility; import everywhere class merging is needed

**Styling:**
- `app/globals.css`: All Tailwind v4 imports, `@theme` token mapping, `:root` and `.dark` CSS variable definitions

**UI Primitives:**
- `components/ui/`: All shadcn/ui components live here; add new primitives here when running `pnpm dlx shadcn add <component>`

**Testing:**
- Not present — no test files or test configuration exist yet

## Naming Conventions

**Files:**
- Route segments: `page.tsx`, `layout.tsx` (Next.js reserved names, lowercase)
- UI components: `kebab-case.tsx` (e.g., `button.tsx`, `input.tsx`)
- Utilities: `kebab-case.ts` (e.g., `utils.ts`)

**Components:**
- Exported component functions: `PascalCase` (e.g., `Button`, `RootLayout`)
- CVA variant maps: `camelCase` + `Variants` suffix (e.g., `buttonVariants`)

**CSS variables:**
- Design tokens: `--kebab-case` following shadcn/ui conventions (e.g., `--primary`, `--sidebar-ring`)

**TypeScript path alias:**
- `@/*` maps to the project root — use `@/components/...`, `@/lib/...`, `@/app/...` for all internal imports

## Where to Add New Code

**New route/page:**
- Create directory under `app/` matching the URL path
- Add `page.tsx` (Server Component by default) inside that directory
- Example: `app/grades/page.tsx` → route at `/grades`

**New layout for a route group:**
- Add `layout.tsx` inside the route directory
- Example: `app/grades/layout.tsx` wraps all pages under `/grades`

**New UI primitive (shadcn/ui component):**
- Run `pnpm dlx shadcn add <component-name>` — it writes to `components/ui/` automatically
- Manual additions also go in `components/ui/<component-name>.tsx`

**New feature/domain component:**
- Place in `components/<feature-name>/` (directory does not exist yet — create it)
- Example: `components/grading/ScoreCard.tsx`

**New shared utility:**
- Add to `lib/utils.ts` for small helpers, or create `lib/<module-name>.ts` for larger utilities
- Example: `lib/grade-calculations.ts`

**New API route:**
- Create `app/api/<route>/route.ts` using Next.js Route Handlers
- Example: `app/api/grades/route.ts`

**Static assets:**
- Place images, fonts, or documents in `public/`
- Reference via root-relative path: `/sja-logos/sja-logo-transparent.png`

## Special Directories

**`.next/`:**
- Purpose: Next.js build cache and compiled output
- Generated: Yes (by `next build` / `next dev`)
- Committed: No (listed in `.gitignore`)

**`node_modules/`:**
- Purpose: Installed npm dependencies
- Generated: Yes (by `pnpm install`)
- Committed: No

**`.planning/`:**
- Purpose: GSD AI planning documents
- Generated: Yes (by GSD tooling)
- Committed: Yes

---

*Structure analysis: 2026-03-30*
