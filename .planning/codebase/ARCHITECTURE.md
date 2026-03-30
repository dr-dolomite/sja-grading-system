# Architecture

**Analysis Date:** 2026-03-30

## Pattern Overview

**Overall:** Next.js 16 App Router — React Server Components (RSC) by default, with client components opt-in via `"use client"` directive.

**Key Characteristics:**
- File-system-based routing under `app/`
- React 19 with full RSC support
- Component library built on Radix UI primitives via shadcn/ui (radix-nova style)
- Tailwind CSS v4 for styling, driven entirely by CSS custom properties
- No backend API routes, data layer, or authentication yet — this is a greenfield scaffold

## Layers

**Routing / Pages Layer:**
- Purpose: Defines URL routes and page-level UI composition
- Location: `app/`
- Contains: `page.tsx` files (route segments), `layout.tsx` (shared shells), `globals.css` (global tokens)
- Depends on: Components layer, lib utilities
- Used by: Next.js router (no explicit callers)

**Layout Shell:**
- Purpose: Provides the HTML document shell, font loading, and body wrapper applied to every route
- Location: `app/layout.tsx`
- Contains: `<html>`, `<body>`, font variable injection via `next/font/google`
- Depends on: `@/lib/utils` (`cn`), `app/globals.css`
- Used by: All pages automatically via Next.js App Router

**UI Components Layer:**
- Purpose: Reusable, unstyled-primitive-backed UI primitives
- Location: `components/ui/`
- Contains: shadcn/ui components (currently `button.tsx`); each file exports one primary component plus its CVA variant map
- Depends on: `radix-ui` (Slot), `class-variance-authority`, `@/lib/utils`
- Used by: Page components and future feature components

**Lib / Utilities Layer:**
- Purpose: Shared non-component helpers
- Location: `lib/`
- Contains: `utils.ts` — exports `cn()` (clsx + tailwind-merge)
- Depends on: `clsx`, `tailwind-merge`
- Used by: Every component that merges Tailwind classes

**Public Assets:**
- Purpose: Static files served at `/`
- Location: `public/`
- Contains: SVG icons, SJA brand logos (`public/sja-logos/`)
- Depends on: Nothing
- Used by: `next/image` and direct `<img>` references in pages

## Data Flow

**Page Render (RSC default):**

1. Browser requests a route (e.g., `/`)
2. Next.js App Router matches `app/page.tsx` as a Server Component
3. `app/layout.tsx` wraps `page.tsx` output inside `<html>/<body>` with font variables
4. Rendered HTML streamed to client — no client JS for server components
5. Interactive client components (marked `"use client"`) hydrate independently

**Component Styling Flow:**

1. Component receives `className` prop and variant props
2. `cva()` resolves variant → class string
3. `cn()` merges with any override classes via `clsx` + `tailwind-merge`
4. Tailwind v4 CSS pipeline resolves utility classes against `@theme` tokens defined in `app/globals.css`

**State Management:**
- No global state management library present. State is local React state within client components only.

## Key Abstractions

**`cn()` utility:**
- Purpose: Merge Tailwind class strings safely, resolving conflicts
- Location: `lib/utils.ts`
- Pattern: `cn(...inputs: ClassValue[]) => string` — call everywhere a component accepts `className`

**CVA variant maps:**
- Purpose: Type-safe, composable variant-driven component styling
- Examples: `components/ui/button.tsx` (`buttonVariants`)
- Pattern: Define with `cva(base, { variants, defaultVariants })`; consume via `buttonVariants({ variant, size, className })`

**shadcn/ui components:**
- Purpose: Accessible, composable primitives using Radix UI under the hood
- Examples: `components/ui/button.tsx`
- Pattern: Each component uses `data-slot` attributes for CSS targeting; supports `asChild` via `Slot.Root` for polymorphic rendering

**CSS Custom Property Tokens:**
- Purpose: Centralize all design tokens (color, radius, font) in one place
- Location: `app/globals.css` (`@theme inline { ... }`, `:root { ... }`, `.dark { ... }`)
- Pattern: Tokens defined as CSS variables; Tailwind v4 `@theme` block maps them to utility classes

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Every page render in the application
- Responsibilities: HTML shell, font injection, global CSS import, body flex layout

**Home Page:**
- Location: `app/page.tsx`
- Triggers: HTTP GET `/`
- Responsibilities: Default landing page (currently the create-next-app scaffold placeholder)

## Error Handling

**Strategy:** Framework defaults only — Next.js will render a built-in error boundary if an unhandled exception occurs in a Server Component. No custom `error.tsx` or `not-found.tsx` files exist yet.

**Patterns:**
- No custom error boundaries defined
- No try/catch patterns in current source

## Cross-Cutting Concerns

**Styling:** Tailwind CSS v4 via `@import "tailwindcss"` in `app/globals.css`; all tokens in CSS custom properties; dark mode via `.dark` class selector (custom variant `dark (&:is(.dark *))`)

**Fonts:** Loaded via `next/font/google` in `app/layout.tsx`; injected as CSS variables (`--font-sans`, `--font-geist-sans`, `--font-geist-mono`)

**Validation:** Not applicable — no forms or data input yet

**Authentication:** Not implemented

**Logging:** Not implemented (no custom logger; framework-level only)

---

*Architecture analysis: 2026-03-30*
