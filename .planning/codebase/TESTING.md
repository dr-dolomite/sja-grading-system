# Testing Patterns

**Analysis Date:** 2026-03-30

## Test Framework

**Runner:**
- None configured — no Jest, Vitest, Playwright, or Cypress config files are present
- No test runner appears in `package.json` dependencies or devDependencies
- No `test` script defined in `package.json`

**Assertion Library:**
- Not applicable — no test framework installed

**Run Commands:**
- None defined

## Test File Organization

**Location:**
- No test files exist anywhere in the project

**Naming:**
- No pattern established — no `*.test.*` or `*.spec.*` files found

**Structure:**
- Not applicable at current scaffolding stage

## Test Structure

Not established. The project is a fresh Next.js scaffold with no test infrastructure.

## Mocking

**Framework:**
- None

**Patterns:**
- Not established

## Fixtures and Factories

**Test Data:**
- None

**Location:**
- No fixture or factory directories exist

## Coverage

**Requirements:**
- None enforced — no coverage configuration present

**View Coverage:**
- Not available

## Test Types

**Unit Tests:**
- Not present

**Integration Tests:**
- Not present

**E2E Tests:**
- Not present — no Playwright or Cypress installation detected

## Recommendations for New Tests

When adding tests to this project, adopt the following approach given the Next.js App Router + TypeScript stack:

**Recommended framework:** Vitest (compatible with Vite/Turbopack tooling, ESM-native)

**Recommended additions to `package.json`:**
```json
{
  "devDependencies": {
    "vitest": "^2",
    "@vitejs/plugin-react": "^4",
    "@testing-library/react": "^16",
    "@testing-library/user-event": "^14",
    "jsdom": "^25"
  },
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Recommended config file:** `vitest.config.ts` at project root

**Recommended test file location:** Co-located with source files
- Components: `components/ui/button.test.tsx` alongside `components/ui/button.tsx`
- Utilities: `lib/utils.test.ts` alongside `lib/utils.ts`

**Recommended test directory for integration tests:** `__tests__/` at project root

---

*Testing analysis: 2026-03-30*
