# Coding Conventions

**Analysis Date:** 2026-03-30

## Naming Patterns

**Files:**
- Page files follow Next.js App Router conventions: `page.tsx`, `layout.tsx` — lowercase, kebab-case directories
- Component files: PascalCase matching the exported component name (e.g., `button.tsx` exports `Button`)
- Utility modules: camelCase (e.g., `utils.ts`)
- Config files: kebab-case with extension (e.g., `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`)

**Functions / Components:**
- React components: PascalCase function declarations (e.g., `function Button(...)`, `export default function Home()`, `export default function RootLayout(...)`)
- Utility functions: camelCase (e.g., `cn(...)` in `lib/utils.ts`)
- CVA variant objects: camelCase constant with `Variants` suffix (e.g., `buttonVariants`)

**Variables:**
- camelCase throughout (e.g., `geistSans`, `geistMono`, `manrope`)
- Font variables use descriptive names matching the font (e.g., `geistSans`, `geistMono`, `manrope`)

**Types / Interfaces:**
- PascalCase (e.g., `Metadata`, `ClassValue`, `VariantProps`)
- Type imports use the `import type` syntax (e.g., `import type { Metadata } from "next"`)

**CSS Variables:**
- Kebab-case with double dash prefix (e.g., `--font-sans`, `--color-primary`, `--radius-sm`)
- Design token names mirror Tailwind/shadcn conventions: `--background`, `--foreground`, `--primary`, etc.

## Code Style

**Formatting:**
- No Prettier config found — formatting is not enforced by a dedicated formatter tool
- ESLint enforces code quality via `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Indentation: 2 spaces (observed in all source files)
- Trailing commas: present in multi-line objects/arrays
- Semicolons: absent in component files (e.g., `button.tsx`, `utils.ts`); present in some config files

**Linting:**
- Tool: ESLint 9 with flat config (`eslint.config.mjs`)
- Config: `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- Run command: `pnpm lint` (calls `eslint` with no extra flags)
- Ignored paths: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`

**TypeScript:**
- `strict: true` is enabled — all code must pass strict type checks
- `noEmit: true` — TypeScript is transpile-only via Next.js/Turbopack
- `moduleResolution: "bundler"` — modern bundler module resolution
- `isolatedModules: true` — each file must be independently compilable
- Type-only imports are separated using `import type` syntax

## Import Organization

**Order (observed):**
1. External library imports (e.g., `import * as React from "react"`, `import { cva, type VariantProps } from "class-variance-authority"`)
2. Framework/Next.js imports (e.g., `import type { Metadata } from "next"`, `import Image from "next/image"`)
3. Internal imports using path alias (e.g., `import { cn } from "@/lib/utils"`)
4. Relative CSS imports (e.g., `import "./globals.css"`)

**Path Aliases:**
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

**Component Functions:**
- Defined as named function declarations: `function ComponentName(props) { ... }`
- Props destructured directly in the parameter list
- `React.ComponentProps<"element">` used for native element prop spreading (seen in `button.tsx`)
- Spread operator `...props` used to forward remaining props to the underlying element

**Utility Functions:**
- Small, single-purpose (e.g., `cn()` in `lib/utils.ts` is a one-liner)
- Named exports preferred for utilities: `export function cn(...)`

**Component Exports:**
- Named exports for components and their variants: `export { Button, buttonVariants }` in `components/ui/button.tsx`
- Default exports for page/layout files: `export default function Home()`, `export default function RootLayout()`

## Module Design

**Exports:**
- UI components: named exports from individual files (no barrel files yet)
- Page/layout: default exports (required by Next.js App Router)
- Utilities: named exports

**Barrel Files:**
- None present yet — each component is imported directly from its file path

## Component Patterns

**shadcn/ui Components:**
- Style: `radix-nova` (configured in `components.json`)
- Components use `cva` (class-variance-authority) for variant management
- `cn()` utility (`@/lib/utils`) used universally for class merging
- `asChild` pattern via `Slot.Root` from `radix-ui` for polymorphic components
- `data-slot`, `data-variant`, `data-size` attributes applied to roots for CSS targeting

**Tailwind CSS:**
- Version 4 with `@tailwindcss/postcss` plugin (configured in `postcss.config.mjs`)
- Utility classes applied directly in JSX; no separate CSS modules
- Design tokens defined as CSS custom properties in `app/globals.css` under `:root` and `.dark`
- `oklch()` color space used throughout design tokens
- `tw-animate-css` imported for animation utilities
- Dark mode via `.dark` class selector (custom variant: `@custom-variant dark (&:is(.dark *))`)

---

*Convention analysis: 2026-03-30*
