@AGENTS.md

<!-- GSD:project-start source:PROJECT.md -->
## Project

**SJA Grading System**

A centralized grading system for St. Joseph's Academy of Malinao, Inc. (SJA) that enables teachers to input raw scores, automatically computes DepEd-compliant grades, and generates custom report cards. Locally hosted for the school network with planned Tailscale support for remote teacher access.

**Core Value:** Teachers can input raw scores and the system accurately computes DepEd-standard grades — if grading doesn't work correctly, nothing else matters.

### Constraints

- **Tech stack**: Next.js 16 + PostgreSQL + Prisma — already decided, existing scaffold in place
- **UI components**: shadcn/ui (radix-nova style) for all frontend components — already installed, use exclusively
- **Hosting**: Local network deployment, no cloud dependency. Tailscale planned for future remote access
- **Compliance**: Must follow DepEd grading component weights and computation rules
- **Data sensitivity**: Student grades and records are confidential — role-based access control is mandatory
- **Templates**: Printable report card/form templates will be provided later — system must support pluggable template rendering
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.x - All application code (`.ts`, `.tsx`)
- CSS - Global styles via `app/globals.css` (Tailwind v4 CSS-first config)
## Runtime
- Node.js 23.6.1 (detected on dev machine; no `.nvmrc` or `.node-version` pinned)
- pnpm 10.24.0
- Lockfile: `pnpm-lock.yaml` (lockfileVersion 9.0) — present and committed
- Workspace config: `pnpm-workspace.yaml` (ignores sharp, unrs-resolver in built deps)
## Frameworks
- Next.js 16.2.1 - Full-stack React framework, App Router with React Server Components
- React 19.2.4 - UI rendering (RSC-first; `rsc: true` in `components.json`)
- Tailwind CSS 4.x - CSS-first utility framework; configured entirely via `app/globals.css` `@theme` block (no `tailwind.config.*` file)
- tw-animate-css 1.4.0 - Animation utility classes, imported in `app/globals.css`
- shadcn 4.1.1 - Component registry/CLI for generating UI primitives
- radix-ui 1.4.3 - Headless primitive components (used directly as `radix-ui` package, not scoped `@radix-ui/*`)
- class-variance-authority 0.7.1 - Variant-based className composition (CVA)
- clsx 2.1.1 - Conditional className merging
- tailwind-merge 3.5.0 - Tailwind class conflict resolution
- lucide-react 1.7.0 - Icon library (configured as icon library in `components.json`)
- TypeScript compiler (via Next.js build pipeline) - Type checking with `strict: true`
- ESLint 9 - Linting; config at `eslint.config.mjs` using flat config format
- eslint-config-next 16.2.1 - Next.js rules (core-web-vitals + typescript presets)
- PostCSS - CSS processing via `@tailwindcss/postcss` plugin; config at `postcss.config.mjs`
## Key Dependencies
- `next` 16.2.1 - Routing, rendering, image optimization, font loading; note this is a **major version ahead of training data** — read `node_modules/next/dist/docs/` before writing Next.js code
- `react` / `react-dom` 19.2.4 - RSC, concurrent features, new hooks API
- `shadcn` 4.1.1 - CLI tool for adding pre-built components; config at `components.json` (style: `radix-nova`, base color: `mist`)
- `radix-ui` 1.4.3 - Slot and primitive components used directly (e.g., `Slot.Root` in `components/ui/button.tsx`)
## Configuration
- `next.config.ts` - Minimal Next.js config; no custom options set
- `tsconfig.json` - `strict: true`, `moduleResolution: bundler`, path alias `@/*` → `./`
- `postcss.config.mjs` - Single plugin: `@tailwindcss/postcss`
- `eslint.config.mjs` - ESLint flat config (core-web-vitals + typescript, ignores `.next/`, `out/`, `build/`)
- `app/globals.css` - Tailwind v4 `@theme inline` block defines all design tokens as CSS custom properties; light + dark mode variables; `@custom-variant dark` for `.dark` class strategy
- `components.json` - shadcn config: style `radix-nova`, RSC enabled, aliases for `@/components`, `@/lib`, `@/hooks`
- No `.env` files detected; no environment variables required at this stage
- No runtime secrets configured
## Platform Requirements
- Node.js (23.x on dev machine; no constraint pinned)
- pnpm 10.x
- Compatible with Vercel (default create-next-app target; Vercel deploy links present in `app/page.tsx`)
- No deployment configuration files present (no `vercel.json`, `Dockerfile`, etc.)
- Google Fonts loaded via `next/font/google`: Geist, Geist Mono, Manrope
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Page files follow Next.js App Router conventions: `page.tsx`, `layout.tsx` — lowercase, kebab-case directories
- Component files: PascalCase matching the exported component name (e.g., `button.tsx` exports `Button`)
- Utility modules: camelCase (e.g., `utils.ts`)
- Config files: kebab-case with extension (e.g., `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`)
- React components: PascalCase function declarations (e.g., `function Button(...)`, `export default function Home()`, `export default function RootLayout(...)`)
- Utility functions: camelCase (e.g., `cn(...)` in `lib/utils.ts`)
- CVA variant objects: camelCase constant with `Variants` suffix (e.g., `buttonVariants`)
- camelCase throughout (e.g., `geistSans`, `geistMono`, `manrope`)
- Font variables use descriptive names matching the font (e.g., `geistSans`, `geistMono`, `manrope`)
- PascalCase (e.g., `Metadata`, `ClassValue`, `VariantProps`)
- Type imports use the `import type` syntax (e.g., `import type { Metadata } from "next"`)
- Kebab-case with double dash prefix (e.g., `--font-sans`, `--color-primary`, `--radius-sm`)
- Design token names mirror Tailwind/shadcn conventions: `--background`, `--foreground`, `--primary`, etc.
## Code Style
- No Prettier config found — formatting is not enforced by a dedicated formatter tool
- ESLint enforces code quality via `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Indentation: 2 spaces (observed in all source files)
- Trailing commas: present in multi-line objects/arrays
- Semicolons: absent in component files (e.g., `button.tsx`, `utils.ts`); present in some config files
- Tool: ESLint 9 with flat config (`eslint.config.mjs`)
- Config: `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- Run command: `pnpm lint` (calls `eslint` with no extra flags)
- Ignored paths: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`
- `strict: true` is enabled — all code must pass strict type checks
- `noEmit: true` — TypeScript is transpile-only via Next.js/Turbopack
- `moduleResolution: "bundler"` — modern bundler module resolution
- `isolatedModules: true` — each file must be independently compilable
- Type-only imports are separated using `import type` syntax
## Import Organization
- `@/*` resolves to the project root (configured in `tsconfig.json` paths)
- Use `@/components`, `@/lib`, `@/hooks` as defined in `components.json` aliases
## Error Handling
- No error handling patterns established yet — the codebase is at scaffolding stage
- No try/catch blocks, error boundaries, or error pages observed in current source files
- Next.js App Router error boundaries (`error.tsx`, `not-found.tsx`) are not yet created
## Logging
- No logging framework in use
- No `console.*` calls present in source files
- Not applicable at current scaffolding stage
## Comments
- No JSDoc or TSDoc comments observed in any source files
- No inline comments in application code
- Comments appear only in config boilerplate (e.g., `/* config options here */` in `next.config.ts`)
## Function Design
- Defined as named function declarations: `function ComponentName(props) { ... }`
- Props destructured directly in the parameter list
- `React.ComponentProps<"element">` used for native element prop spreading (seen in `button.tsx`)
- Spread operator `...props` used to forward remaining props to the underlying element
- Small, single-purpose (e.g., `cn()` in `lib/utils.ts` is a one-liner)
- Named exports preferred for utilities: `export function cn(...)`
- Named exports for components and their variants: `export { Button, buttonVariants }` in `components/ui/button.tsx`
- Default exports for page/layout files: `export default function Home()`, `export default function RootLayout()`
## Module Design
- UI components: named exports from individual files (no barrel files yet)
- Page/layout: default exports (required by Next.js App Router)
- Utilities: named exports
- None present yet — each component is imported directly from its file path
## Component Patterns
- Style: `radix-nova` (configured in `components.json`)
- Components use `cva` (class-variance-authority) for variant management
- `cn()` utility (`@/lib/utils`) used universally for class merging
- `asChild` pattern via `Slot.Root` from `radix-ui` for polymorphic components
- `data-slot`, `data-variant`, `data-size` attributes applied to roots for CSS targeting
- Version 4 with `@tailwindcss/postcss` plugin (configured in `postcss.config.mjs`)
- Utility classes applied directly in JSX; no separate CSS modules
- Design tokens defined as CSS custom properties in `app/globals.css` under `:root` and `.dark`
- `oklch()` color space used throughout design tokens
- `tw-animate-css` imported for animation utilities
- Dark mode via `.dark` class selector (custom variant: `@custom-variant dark (&:is(.dark *))`)
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- File-system-based routing under `app/`
- React 19 with full RSC support
- Component library built on Radix UI primitives via shadcn/ui (radix-nova style)
- Tailwind CSS v4 for styling, driven entirely by CSS custom properties
- No backend API routes, data layer, or authentication yet — this is a greenfield scaffold
## Layers
- Purpose: Defines URL routes and page-level UI composition
- Location: `app/`
- Contains: `page.tsx` files (route segments), `layout.tsx` (shared shells), `globals.css` (global tokens)
- Depends on: Components layer, lib utilities
- Used by: Next.js router (no explicit callers)
- Purpose: Provides the HTML document shell, font loading, and body wrapper applied to every route
- Location: `app/layout.tsx`
- Contains: `<html>`, `<body>`, font variable injection via `next/font/google`
- Depends on: `@/lib/utils` (`cn`), `app/globals.css`
- Used by: All pages automatically via Next.js App Router
- Purpose: Reusable, unstyled-primitive-backed UI primitives
- Location: `components/ui/`
- Contains: shadcn/ui components (currently `button.tsx`); each file exports one primary component plus its CVA variant map
- Depends on: `radix-ui` (Slot), `class-variance-authority`, `@/lib/utils`
- Used by: Page components and future feature components
- Purpose: Shared non-component helpers
- Location: `lib/`
- Contains: `utils.ts` — exports `cn()` (clsx + tailwind-merge)
- Depends on: `clsx`, `tailwind-merge`
- Used by: Every component that merges Tailwind classes
- Purpose: Static files served at `/`
- Location: `public/`
- Contains: SVG icons, SJA brand logos (`public/sja-logos/`)
- Depends on: Nothing
- Used by: `next/image` and direct `<img>` references in pages
## Data Flow
- No global state management library present. State is local React state within client components only.
## Key Abstractions
- Purpose: Merge Tailwind class strings safely, resolving conflicts
- Location: `lib/utils.ts`
- Pattern: `cn(...inputs: ClassValue[]) => string` — call everywhere a component accepts `className`
- Purpose: Type-safe, composable variant-driven component styling
- Examples: `components/ui/button.tsx` (`buttonVariants`)
- Pattern: Define with `cva(base, { variants, defaultVariants })`; consume via `buttonVariants({ variant, size, className })`
- Purpose: Accessible, composable primitives using Radix UI under the hood
- Examples: `components/ui/button.tsx`
- Pattern: Each component uses `data-slot` attributes for CSS targeting; supports `asChild` via `Slot.Root` for polymorphic rendering
- Purpose: Centralize all design tokens (color, radius, font) in one place
- Location: `app/globals.css` (`@theme inline { ... }`, `:root { ... }`, `.dark { ... }`)
- Pattern: Tokens defined as CSS variables; Tailwind v4 `@theme` block maps them to utility classes
## Entry Points
- Location: `app/layout.tsx`
- Triggers: Every page render in the application
- Responsibilities: HTML shell, font injection, global CSS import, body flex layout
- Location: `app/page.tsx`
- Triggers: HTTP GET `/`
- Responsibilities: Default landing page (currently the create-next-app scaffold placeholder)
## Error Handling
- No custom error boundaries defined
- No try/catch patterns in current source
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
