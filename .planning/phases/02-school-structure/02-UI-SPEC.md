---
phase: 2
name: "School Structure"
status: draft
created: 2026-03-30
---

# UI-SPEC: Phase 2 — School Structure

**Visual and interaction contract for the admin-only School Structure configuration page: school years, grade levels/sections, and subjects.**

---

## Design System

| Property | Value | Source |
|----------|-------|--------|
| Tool | shadcn/ui | `components.json` |
| Style | radix-nova | `components.json` |
| Base color | mist | `components.json` |
| Config mode | CSS-first (Tailwind v4 `@theme`) | `app/globals.css` |
| RSC | true | `components.json` |
| Icon library | lucide-react | `components.json` |
| Third-party registries | none | `components.json` `"registries": {}` |

### Registry Safety Gate

No third-party registries declared. Gate not applicable.

---

## Spacing Scale

8-point scale. Identical to Phase 1 — no exceptions for this phase.

| Token | Value | Use |
|-------|-------|-----|
| space-1 | 4px | Icon gap, tight inline spacing, badge padding |
| space-2 | 8px | Field internal padding, gap between badge items |
| space-4 | 16px | Standard gap between form fields, card padding, tab content padding |
| space-6 | 24px | Section padding, gap between major content blocks |
| space-8 | 32px | Page section vertical rhythm |
| space-12 | 48px | Large section breaks |

**Touch targets:** All interactive elements (buttons, tab triggers, expandable row click zones, dropdown items) must be a minimum of 44px tall. Icon-only action buttons use `size="icon"` (32px) only when accompanied by a visible label elsewhere in the row; otherwise use `size="sm"` (28px) with label text.

**Exception — weight input fields:** The WW/PT/QA weight inputs in the subject form are compact (two-digit numeric values); use `h-8` (32px) height, which is acceptable for form fields that are always accompanied by visible labels.

---

## Typography

Font stack is unchanged from Phase 1 (`app/layout.tsx`):
- **Body / UI:** Manrope (`--font-sans`) — loaded via `next/font/google`
- **Mono:** Geist Mono (`--font-geist-mono`) — used for numeric weight values and percentage display

### Type Scale (4 sizes — inherited from Phase 1)

| Role | Size | Weight | Line-height | Element |
|------|------|--------|-------------|---------|
| Heading large | 24px (`text-2xl`) | 600 (semibold) | 1.2 | Page title "School Structure" |
| Heading medium | 20px (`text-xl`) | 600 (semibold) | 1.2 | Sheet panel titles (e.g., "Create school year") |
| Body | 16px (`text-base`) | 400 (regular) | 1.5 | General content, table cell values |
| Small / Label | 14px (`text-sm`) | 400 (regular) | 1.4 | Field labels, descriptions, badges, muted helper text, table header text |

### Font Weights (2 weights — inherited from Phase 1)

- **Regular:** 400 — body text, table cell content, descriptions, muted labels, form helper text
- **Semibold:** 600 — page title, sheet titles, tab trigger labels (active state), grade level name in expandable rows

### Tabular Numerals

Use `tabular-nums` class on all weight percentage displays (WW/PT/QA values) in the subject table and in the weight input fields. Prevents layout shift as admin edits numeric values.

---

## Color Contract

Tokens inherited from Phase 1 (`app/globals.css`). No new tokens introduced.

### 60 / 30 / 10 Split

| Role | Token | Value (light) | Usage |
|------|-------|---------------|-------|
| 60% Dominant surface | `--background` | `oklch(1 0 0)` — white | Page background, tab content area |
| 30% Secondary | `--card`, `--sidebar`, `--muted` | Near-white mist tones | Inline section rows (expanded sections under grade level), Sheet panel background, weight sum indicator background |
| 10% Accent | `--primary` | `oklch(0.532 0.157 131.589)` — forest green | Reserved for primary CTA buttons and active tab indicator only (see list below) |

### Accent Reserved For (exhaustive list for this phase)

1. "Add school year" button background (primary CTA in School Year tab header)
2. "Add section" button background within expanded grade level rows
3. "Add subject" button background in Subjects tab header
4. Active tab trigger indicator (the underline/highlight on the selected tab)
5. Input focus ring (via `--ring` token)

### Semantic Colors

| Token | Value (light) | Reserved For |
|-------|---------------|-------------|
| `--destructive` | `oklch(0.577 0.245 27.325)` — red | Destructive actions only: "Remove section" confirmation button, "Archive school year" confirmation button; field validation error text |
| `--muted-foreground` | `oklch(0.56 0.021 213.5)` — slate | Helper text under weight fields, "past year" row muted state, empty state copy, section count metadata |

### Status Badge Colors

| Status | Badge Variant | Token Used |
|--------|---------------|------------|
| Active school year | `default` | `--primary` background |
| Past (inactive) year | `secondary` | `--secondary` background |
| JHS indicator | `outline` | `--border` border |
| SHS indicator | `outline` | `--border` border |

### Weight Sum Indicator

The real-time weight sum display (WW + PT + QA) uses:
- Sum = 100: `text-primary` (green) with a checkmark icon
- Sum ≠ 100: `text-destructive` (red) with an X icon
- Work Immersion subjects (2-component): sum of WW + PT = 100; QA field hidden entirely (not shown as 0)

### Dark Mode

Tokens have dark-mode counterparts in `app/globals.css` under `.dark`. Phase 2 does not implement a mode toggle. App defaults to light mode. Dark mode CSS is present but not surfaced.

---

## Component Inventory

All components are from the existing scaffold. No new shadcn components need to be added for this phase.

### School Structure Page Shell

| Component | Import | Usage |
|-----------|--------|-------|
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `@/components/ui/tabs` | Three-tab navigation: School Year, Grade Levels, Subjects |
| `Button` | `@/components/ui/button` | All CTA buttons (primary Add actions, outline Edit/Archive actions) |

### School Year Tab

| Component | Import | Usage |
|-----------|--------|-------|
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead` | `@/components/ui/table` | List of school years with status and action columns |
| `Badge` | `@/components/ui/badge` | Active/Past status indicator on each year row |
| `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetTrigger` | `@/components/ui/sheet` | "Add school year" slide-in form |
| `Field`, `FieldLabel`, `FieldError`, `FieldGroup` | `@/components/ui/field` | Form field wrappers in Sheet |
| `Input` | `@/components/ui/input` | School year label field (e.g., "2025-2026") |

### Grade Levels Tab

| Component | Import | Usage |
|-----------|--------|-------|
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead` | `@/components/ui/table` | Grade levels list with expandable inline section rows |
| `Badge` | `@/components/ui/badge` | JHS / SHS classification tag on each grade level |
| `Button` | `@/components/ui/button` | Chevron expand toggle, "Add section" within expanded view |
| `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle` | `@/components/ui/sheet` | "Add section" slide-in form |
| `Field`, `FieldLabel`, `FieldError`, `FieldGroup` | `@/components/ui/field` | Section name field, strand selector field |
| `Input` | `@/components/ui/input` | Section name field (e.g., "St. John", "Charity") |
| `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue` | `@/components/ui/select` | Strand selector (SHS sections only); hidden for JHS sections |

### Subjects Tab

| Component | Import | Usage |
|-----------|--------|-------|
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead` | `@/components/ui/table` | Subjects list with name, type, weight columns |
| `Badge` | `@/components/ui/badge` | JHS/SHS/School tag; Work Immersion tag (2-component indicator) |
| `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle` | `@/components/ui/sheet` | "Add subject" and "Edit subject" slide-in forms |
| `Field`, `FieldLabel`, `FieldError`, `FieldGroup`, `FieldDescription` | `@/components/ui/field` | All form field wrappers |
| `Input` | `@/components/ui/input` | Subject name, WW/PT/QA weight numeric inputs |
| `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue` | `@/components/ui/select` | Subject type selector (drives weight presets) |
| `Card` | `@/components/ui/card` | Weight sum summary card within the Sheet form |

### "Copy from Previous Year" Flow

| Component | Import | Usage |
|-----------|--------|-------|
| `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle` | `@/components/ui/sheet` | "Copy from previous year" confirmation and options panel |
| `Select` | `@/components/ui/select` | Source year picker |
| `Checkbox`, `Label` | `@/components/ui/checkbox`, `@/components/ui/label` | Opt-in checkboxes for what to copy: Grade Levels, Sections, Subjects, Strands |
| `Button` | `@/components/ui/button` | "Copy and create year" primary action, "Cancel" outline action |

---

## Screen Layouts

### School Structure Page (`/dashboard/school-structure`)

**Layout:** Sidebar shell (inherited from dashboard layout) + full-width content area with three-tab navigation.

**Focal point:** The active tab's data table — the primary configuration surface. The tab bar orients the admin within the three domains.

```
┌────────────┬─────────────────────────────────────────────────────────┐
│            │  [SiteHeader]                                           │
│  Sidebar   │  School Structure                     [Add school year] │
│  (School   │  Manage school years, grade levels, sections, subjects. │
│   Structure│                                                         │
│   active)  │  [School Year] [Grade Levels] [Subjects]               │
│            │  ─────────────────────────────────────────────────────  │
│            │  [Table content for active tab]                         │
└────────────┴─────────────────────────────────────────────────────────┘
```

- Content padding: `py-4 px-4 md:gap-6 md:py-6 lg:px-6` (matches Phase 1 pages)
- Page header: `flex items-center justify-between` — title+description on left, primary CTA button on right
- The CTA button in the page header changes label depending on active tab:
  - School Year tab: "Add school year"
  - Grade Levels tab: CTA button hidden (add section is inline per grade level)
  - Subjects tab: "Add subject"
- Tab bar: `w-full` spanning the content column

**Default active tab:** "School Year" — the foundational entity that all others depend on. Admin must create a year before configuring grade levels or subjects.

**Tab order:** School Year → Grade Levels → Subjects (logical configuration sequence: year first, then levels, then subjects)

### School Year Tab

```
Year Label     | Periods Auto-Generated | Status   | Actions
─────────────────────────────────────────────────────────────
2025-2026      | Q1, Q2, Q3, Q4 / Sem 1-2 | [Active]  | [Activate] [Copy]
2024-2025      | Q1, Q2, Q3, Q4 / Sem 1-2 | [Past]    | (view only)
```

- Two sub-rows of period info are not shown in the table; just the label "JHS: Q1-Q4 · SHS: Sem 1/Sem 2" in a small muted annotation in the year label cell
- Past year rows: full opacity, but action column shows no edit/delete buttons — only a "View" link if needed in a future phase; for now, actions column is empty for past years
- "Copy from previous year" trigger: shown as an outline `Button` in the active year's Actions cell only, labeled "Copy to new year"

### Grade Levels Tab

```
Grade Level  | Type | Sections | Actions
─────────────────────────────────────────
▶ Grade 7    | JHS  | 3 sections | [+]
▼ Grade 8    | JHS  | 2 sections |
  ┌─ St. John (JHS)           [Edit] [Remove]
  └─ Charity  (JHS)           [Edit] [Remove]
     [Add section]
▶ Grade 9    | JHS  | 0 sections | [+]
...
▶ Grade 11   | SHS  | 2 sections | [+]
▼ Grade 12   | SHS  | 1 section  |
  └─ STEM A (STEM)            [Edit] [Remove]
     [Add section]
```

- Grade level rows are NOT clickable in the cell area; expand is triggered by the chevron `Button` icon at the start of the row (left-aligned, `size="icon-sm"`)
- Chevron icon: `ChevronRightIcon` (collapsed) / `ChevronDownIcon` (expanded) — 16px
- Section sub-rows have `pl-8` indent relative to parent row, `bg-muted/30` background tint
- Section name is displayed as body text; strand name displayed as `Badge variant="outline"` beside the name (SHS only)
- JHS sections do not show a strand badge
- "Add section" link within expanded view: `Button variant="ghost" size="sm"` with `PlusIcon`, positioned at the bottom of the expanded sub-rows
- "Sections" column shows count as `text-muted-foreground` when 0 sections exist
- Grade levels are fixed (G7–G12) — no add/delete for grade levels, only the expand/section management

### Subjects Tab

```
Subject Name             | Type                  | WW  | PT  | QA  | Actions
──────────────────────────────────────────────────────────────────────────────
Filipino                 | Languages (JHS)       | 30% | 50% | 20% | [Edit]
Mathematics              | Science/Math (JHS)    | 40% | 40% | 20% | [Edit]
Oral Communication       | Core Subjects (SHS)   | 25% | 50% | 25% | [Edit]
Work Immersion           | Work Immersion (SHS)  | 20% | 80% |  —  | [Edit]  [2-comp]
Religious Education      | School-specific       | 30% | 50% | 20% | [Edit]
```

- WW/PT/QA columns use `tabular-nums font-mono text-sm` for alignment
- QA column shows "—" (`text-muted-foreground`) for Work Immersion subjects (no QA component)
- "2-comp" badge shown on Work Immersion rows: `Badge variant="outline" className="text-xs"` with label "2-component"
- Subject type column shows the friendly label + curriculum tag in muted text (e.g., "Languages · JHS")
- Actions column: `Button variant="ghost" size="icon-sm"` with `PencilIcon` for edit

### Add / Edit Subject Sheet

```
Subject Name: [_________________________]
Subject Type: [Select type ▼          ]
              Languages (Filipino, English) — JHS
              AP / EsP — JHS
              Science / Math — JHS
              MAPEH / EPP / TLE — JHS
              Core Subjects — SHS (old curriculum)
              Academic Track (All other) — SHS (old)
              Academic Track (Work Immersion) — SHS (old)
              Core — SHS (Strengthened)
              Academic Electives — SHS (Strengthened)
              Academic Electives (Field Experience) — SHS (Strengthened)
              TechPro Electives — SHS (Strengthened)
              Work Immersion — SHS (Strengthened)
              Religious Education — School-specific

Component Weights:
  Written Work (%):          [30]
  Performance Task (%):      [50]
  Quarterly Assessment (%):  [20]   ← hidden for Work Immersion types
  ┌──────────────────────────────┐
  │ Total: 100%  ✓              │
  └──────────────────────────────┘

[Save subject]
```

- Subject type `Select` has grouped options using `SelectItem` within visually distinct groups (use separator lines between JHS / SHS old / SHS new / School groups)
- Weight fields are `Input type="number" min="0" max="100"` with `tabular-nums` class
- When a type is selected, the weight fields auto-populate with preset values (client-side, no round-trip)
- The total sum card updates in real time as admin edits weight fields
- When type is Work Immersion: QA field is hidden (not disabled — removed from DOM); total displays "WW + PT must equal 100"
- On save: if sum ≠ 100, the save button remains enabled but the Server Action returns a field error on the weight group

### "Copy from Previous Year" Sheet

```
Copy school structure to a new year

Source year: [2024-2025 ▼]
New year label: [___________] e.g. 2025-2026

What to copy:
  [x] Grade levels
  [x] Sections (requires Grade levels)
  [x] Strands (requires Sections)
  [x] Subjects

[Copy and create year]   [Cancel]
```

- Sheet title: "Copy from previous year"
- Checkbox dependencies: unchecking "Grade levels" auto-unchecks Sections and Strands (client-side `useEffect`)
- Helper text: `text-xs text-muted-foreground` explaining that copied data can be edited after creation
- Submit button: `Button variant="default"` labeled "Copy and create year"
- Cancel: `Button variant="outline"` labeled "Cancel" (closes Sheet, no action)

---

## Interaction Contracts

### Tab Navigation

| State | Visual |
|-------|--------|
| Default | School Year tab active |
| Tab switch | Immediate client-side render; no loading state (data already fetched server-side at page load) |
| Active tab | Underline indicator in `--primary` color; trigger text `font-semibold` |
| Inactive tab | No indicator; trigger text `font-normal text-muted-foreground` |

### School Year: Add School Year Form

| State | Visual |
|-------|--------|
| Trigger | "Add school year" button in page header |
| Sheet opens | Slide from right; title "Add school year" |
| Field | Year label (text, required); placeholder "e.g. 2025-2026"; format hint in `FieldDescription` |
| Submitting | Submit button disabled + spinner; label "Creating..." |
| Success | Sheet closes; toast (sonner): "School year 2025-2026 created. Grading periods auto-generated."; table row added at top |
| Duplicate year | `FieldError` on label field: "A school year with this label already exists." |

### School Year: Activate Year

| State | Visual |
|-------|--------|
| Trigger | "Activate" button in year row (shown only for inactive years) |
| Confirmation | Inline Sheet: "Activating 2025-2026 will deactivate the current active year (2024-2025). Continue?" |
| CTA | "Activate 2025-2026" (`Button variant="default"`) |
| Dismiss | "Cancel" (`Button variant="outline"`) |
| Success | Toast: "2025-2026 is now the active school year."; badge updates on both rows |

### Grade Levels: Expand / Collapse

| State | Visual |
|-------|--------|
| Collapsed | Chevron right icon; section count shown in Sections column |
| Expanding | Instant (toggle `Set` state); chevron rotates to down |
| Expanded | Section sub-rows appear below parent; parent row background subtly elevated (`bg-muted/20`) |
| No sections | Expanded area shows only "Add section" button with helper: "No sections yet. Add the first section for Grade 8." |

### Grade Levels: Add Section Form

| State | Visual |
|-------|--------|
| Trigger | "Add section" ghost button within expanded view, OR `[+]` icon button in the row Actions column |
| Sheet opens | Slide from right; title "Add section — Grade [N]" |
| Fields (JHS) | Section name (text, required); no strand selector |
| Fields (SHS) | Section name (text, required); Strand selector (`Select`, required) |
| Strand selector | Shows currently configured strands; "Manage strands" link not included in Phase 2 — strands are managed inline (admin can add/remove via a sub-sheet if time permits, otherwise strand management is deferred to a future detail) |
| Submitting | Submit button disabled; label "Adding..." |
| Success | Sheet closes; toast: "Section 'St. John' added to Grade 8."; expanded row updates with new sub-row |
| Duplicate name | `FieldError` on name field: "A section with this name already exists in Grade 8." |

### Grade Levels: Remove Section

| State | Visual |
|-------|--------|
| Trigger | "Remove" ghost button in section sub-row |
| Confirmation | Inline within the sub-row (no separate sheet): text "Remove 'St. John' from Grade 8?" with "Remove" (`Button size="sm" variant="destructive"`) and "Cancel" (`Button size="sm" variant="ghost"`) inline |
| Success | Toast: "'St. John' removed from Grade 8."; sub-row disappears |
| Blocked | If section has enrolled students (Phase 3+): toast error: "Cannot remove a section with enrolled students." |

### Subjects: Add / Edit Subject Form

| State | Visual |
|-------|--------|
| Trigger | "Add subject" button in page header (add), pencil icon button in row (edit) |
| Sheet opens | Slide from right; title "Add subject" or "Edit subject" |
| Type selection | On change: weight fields auto-populate with preset values (client-side); QA field hides for Work Immersion |
| Weight editing | Real-time total sum recalculates as each field changes |
| Sum = 100 | Total indicator: green checkmark + `text-primary` "100%" |
| Sum ≠ 100 | Total indicator: red X + `text-destructive` "Current total: [N]%" |
| Submitting | Submit button disabled; label "Saving..." |
| Success (add) | Sheet closes; toast: "Subject 'Filipino' added."; table row added |
| Success (edit) | Sheet closes; toast: "Subject 'Filipino' updated."; table row refreshes |
| Sum validation error | `FieldError` under the weight group: "Component weights must total 100%. Current total: [N]%." |
| Work Immersion sum error | `FieldError`: "Written Work and Performance Task must total 100%. Current total: [N]%." |

### Subjects: Edit Linked Subject (Effective Communication / Mabisang Komunikasyon)

| State | Visual |
|-------|--------|
| Visual indicator | Both subjects displayed with a link icon (`Link2Icon`, 12px) between them in the table; tooltip on hover: "Linked subject pair — combined average computed for report card" |
| Edit | Each subject is edited independently; no special UI for the link |

### Sidebar Navigation Update

| Item | Icon | Route | Visible To |
|------|------|-------|------------|
| Dashboard | `LayoutDashboardIcon` | `/dashboard` | All roles |
| School Structure | `BuildingIcon` | `/dashboard/school-structure` | ADMIN only |
| Users | `UsersIcon` | `/dashboard/users` | ADMIN only |
| Settings | `Settings2Icon` | `/dashboard/settings` | All roles (placeholder) |

"School Structure" nav item is inserted between Dashboard and Users in the sidebar, visible only when `user.roles.includes("ADMIN")`.

---

## Copywriting Contract

### Primary CTAs

| Context | CTA Label | Button Variant |
|---------|-----------|---------------|
| School Year tab | "Add school year" | default (primary) |
| Grade Levels tab (within expanded row) | "Add section" | ghost |
| Subjects tab | "Add subject" | default (primary) |
| Edit subject (row action) | pencil icon only | ghost icon-sm |
| Activate year | "Activate [year label]" | default |
| Copy structure | "Copy and create year" | default |
| Save sheet form | "Save subject" / "Save section" | default |

### Empty States

| Context | Copy |
|---------|-------|
| School Year tab — no years | "No school years configured. Add the first school year to get started." |
| Grade Levels tab — grade level has no sections (expanded) | "No sections yet. Add the first section for Grade [N]." |
| Subjects tab — no subjects | "No subjects registered. Add the first subject to get started." |
| Grade Levels tab — all sections across all levels are empty | No page-level empty state; each grade level row shows "0 sections" count inline |

### Error States

| Context | Copy |
|---------|-------|
| Add school year: duplicate label | "A school year with this label already exists." |
| Add section: duplicate name within grade level | "A section with this name already exists in Grade [N]." |
| Add subject: weight sum ≠ 100 (3-component) | "Component weights must total 100%. Current total: [N]%." |
| Add subject: Work Immersion weight sum ≠ 100 (2-component) | "Written Work and Performance Task must total 100%. Current total: [N]%." |
| Remove section: blocked by enrolled students | "Cannot remove a section with enrolled students." |
| Generic server error | "Something went wrong. Please try again." |
| Activate year: no year selected | "Select a year to activate." |

### Destructive Actions in This Phase

| Action | Trigger | Confirmation Approach | Confirm CTA | Dismiss CTA |
|--------|---------|----------------------|-------------|-------------|
| Remove section from grade level | "Remove" button in section sub-row | Inline within sub-row (no Sheet) — shows confirmation text + buttons inline where the row was | "Remove" (`Button size="sm" variant="destructive"`) | "Cancel" (`Button size="sm" variant="ghost"`) |

**Note:** No `AlertDialog` component is installed. Confirmations use inline state within the expanded row, consistent with Phase 1's pattern of avoiding dialog overlays. Do not add `AlertDialog` for Phase 2.

**Activation flow** (replacing active year) uses a Sheet confirmation, not destructive styling — it is not data-destructive, only a status change.

---

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| < 1024px (`lg`) | Sidebar collapses to offcanvas (inherited from dashboard shell); tab triggers stack horizontally with scroll if needed |
| >= 1024px | Sidebar visible inline; full three-tab layout |
| Sheet width | Default shadcn Sheet width (right-side slide-in); on mobile the Sheet takes full width |

The Grade Levels expandable table is not independently scrollable; it uses the page scroll. On narrow viewports, the weight columns (WW/PT/QA) in the Subjects table may be hidden with a responsive `hidden sm:table-cell` pattern — WW and PT always visible; QA hidden below `sm` breakpoint (480px) since it can be recovered via the Edit Sheet.

---

## Accessibility

- All form fields use `FieldLabel` with `htmlFor` matching the `Input` `id` — no unlabeled inputs
- Error messages use `FieldError` component's `role="alert"` attribute
- Expandable grade level rows: the chevron `Button` has `aria-expanded={isExpanded}` and `aria-controls` pointing to the section sub-row container
- Expanded section sub-rows container has `id` matching the chevron's `aria-controls`
- Weight sum indicator: uses both color AND icon (not color-only) — checkmark for valid, X for invalid, satisfying WCAG SC 1.4.1
- Inline remove confirmation: focus moves to the "Remove" button when confirmation appears; "Cancel" returns focus to the row
- Sheet panels: focus traps within the open Sheet; Escape closes the Sheet
- Active tab: `aria-selected="true"` on `TabsTrigger` (provided by shadcn Tabs component)
- Badge on Work Immersion rows: screen reader label "2-component subject (no Quarterly Assessment)"

---

## What This Phase Does NOT Include

- Strand management UI (strands are pre-seeded with STEM, ABM, HUMSS, GAS; configuring custom strands is not surfaced as a dedicated UI in Phase 2 — if needed, admin configures strands inline within the Add Section Sheet via a simple input. A full Strands management page is deferred)
- Per-year grade level activation (all grade levels G7–G12 exist in every year; no ability to add custom grade levels or remove standard ones)
- Bulk import of subjects (CSV import deferred to a later phase)
- Subject-to-grade-level assignment (subjects are created as master records in this phase; assignment to specific grade levels and school years happens in Phase 3)
- Editing or deleting school years (years are append-only records; only activation state changes)
- Dark mode toggle (inherited from Phase 1 — not surfaced in UI)

---

## Pre-population Sources

| Field | Source | Decisions Used |
|-------|--------|---------------|
| Design system (shadcn, radix-nova, mist) | `components.json` | All design system properties |
| Color tokens (all) | `app/globals.css` `@theme` + `:root` block | Color contract, semantic colors |
| Font stack (Manrope primary) | `app/layout.tsx` | Typography |
| Spacing scale | Phase 1 UI-SPEC (established pattern) | All spacing values |
| Typography scale | Phase 1 UI-SPEC (established pattern) | 4 sizes, 2 weights |
| Sheet pattern for forms | `02-CONTEXT.md` D-04 | All add/edit forms use Sheet |
| Single page + 3 tabs | `02-CONTEXT.md` D-01 | Page structure |
| Sections inline under Grade Levels | `02-CONTEXT.md` D-02 | Expand pattern, no Sections tab |
| Admin-only access | `02-CONTEXT.md` D-03 | No read-only views |
| Sidebar nav item visible ADMIN only | `02-CONTEXT.md` D-05 | Sidebar update |
| JHS Q1-Q4 auto-generated | `02-CONTEXT.md` D-06 | School year creation copy |
| One active year at a time | `02-CONTEXT.md` D-08 | Activate flow interaction contract |
| Copy from previous year | `02-CONTEXT.md` D-09 | Copy sheet layout |
| Weight preset system | `02-CONTEXT.md` D-11 | Subject form auto-populate |
| JHS weight presets | `02-CONTEXT.md` D-12 | Subject type Select options |
| SHS old curriculum presets | `02-CONTEXT.md` D-13 | Subject type Select options |
| SHS new curriculum presets | `02-CONTEXT.md` D-14 | Subject type Select options |
| Religious Education type | `02-CONTEXT.md` D-15 | Subject type Select options |
| Work Immersion 2-component enforcement | `02-CONTEXT.md` D-16 | QA field hide rule, badge |
| JHS/SHS auto-detected by grade level | `02-CONTEXT.md` D-17 | Strand selector visibility |
| Strand per-section | `02-CONTEXT.md` D-18 | Section form strand field |
| Named section convention | `02-CONTEXT.md` D-19 | Section name field copy |
| Strands configurable, 4 pre-seeded | `02-CONTEXT.md` D-20 | Strand Select options |
| Linked subject pair (Effective Communication) | `02-CONTEXT.md` D-22 | Subjects table link icon |
| Tab order and default tab | `02-CONTEXT.md` Claude's Discretion | "School Year" default, logical sequence |
| Inline expand layout | `02-CONTEXT.md` Claude's Discretion | Chevron + sub-row pattern |
| Copy from previous year — Sheet presentation | `02-CONTEXT.md` Claude's Discretion | Sheet with checkboxes |
| Default Religious Education weights | `02-CONTEXT.md` Claude's Discretion | WW 30%, PT 50%, QA 20% (same as Languages) |
| Component inventory (existing components) | `02-RESEARCH.md` Standard Stack | No new installs needed |
| Inline expand implementation approach | `02-RESEARCH.md` Pattern 3 | `Set<string>` expand state |
| Weight preset client-side lookup | `02-RESEARCH.md` Pattern 4 | Auto-populate on type select |

---

*Phase: 02-school-structure*
*UI-SPEC created: 2026-03-30*
*Status: draft — pending checker validation*
