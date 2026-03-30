# Phase 2: School Structure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-30
**Phase:** 02-school-structure
**Areas discussed:** Page organization, School year setup, Subject weights, Section & strand, Grade calculations & new curriculum

---

## Page Organization

| Option | Description | Selected |
|--------|-------------|----------|
| Tabbed single page | One 'School Structure' page with tabs: School Year, Grade Levels, Subjects. Uses existing Tabs component. | ✓ |
| Separate pages | Individual sidebar items for each entity type. Same as Users page pattern. | |
| Nested sidebar group | Collapsible 'School Structure' group in sidebar with sub-items. | |

**User's choice:** Tabbed single page (Recommended)
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Inline under Grade Levels | Click a grade level row to expand and see its sections. Keeps parent-child relationship clear. | ✓ |
| Separate Sections tab | Fourth tab showing all sections with grade level as a column/filter. | |
| You decide | Claude picks the best approach. | |

**User's choice:** Inline under Grade Levels (Recommended)
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Admin-only | Only Admin can see and edit school structure. | ✓ |
| Admin edit, others view | Admin can edit, Principal/Registrar get read-only view. | |
| You decide | Claude picks based on Phase 1 patterns. | |

**User's choice:** Admin-only (Recommended)
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Sheet pattern | Consistent with Users page — click 'Add' button, Sheet slides in from the right. | ✓ |
| Inline/dialog | Modal dialog or inline form within the tab content area. | |
| You decide | Claude picks based on Phase 1 patterns. | |

**User's choice:** Sheet pattern (Recommended)
**Notes:** None

---

## School Year Setup

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-generate (JHS) | System auto-creates Q1-Q4 for JHS. Standard DepEd structure. | ✓ |
| Manual per-year | Admin manually adds quarters for each school year. | |
| You decide | Claude picks. | |

**User's choice:** Auto-generate for JHS. User noted that SHS needs manual configuration for strands and subjects due to Strengthened SHS Curriculum changes (new curriculum for G11, old for G12 starting next SY).
**Notes:** User referenced the "Strengthened/Empowered SHS Curriculum" — a major DepEd policy change affecting subject structure and strands for SHS.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Manual config is enough | No explicit 'curriculum version' field. Different subjects/strands per grade level per year. | ✓ |
| Track curriculum version | Add a curriculum version/label field to grade levels. | |
| You decide | Claude picks. | |

**User's choice:** Manual config is enough (Recommended)
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| One active, others archived | Only one school year is 'current'. Past years viewable but not editable. | ✓ |
| Multiple active | Multiple years can be active simultaneously. | |
| You decide | Claude picks. | |

**User's choice:** One active, others archived (Recommended)
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, copy structure | Clone grade levels, sections, and subjects from previous year, then adjust. | ✓ |
| Always start fresh | Each year set up from scratch. | |
| You decide | Claude picks. | |

**User's choice:** Yes, copy structure (Recommended)
**Notes:** User also noted that Religious Education should be included as a subject for both JHS and SHS.

---

## Subject Weights

| Option | Description | Selected |
|--------|-------------|----------|
| Presets with override | Standard DepEd weight templates per subject type, auto-fill, admin can adjust. Must sum to 100%. | ✓ |
| Fully manual | Admin enters WW/PT/QA manually for every subject. | |
| Presets only, no override | Weights locked by subject type. | |

**User's choice:** Presets with override (Recommended)
**Notes:** User provided DepEd Order No. 8, s. 2015 PDF with exact weight tables.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Same as Core subjects | Religious Education uses core subject weights. | |
| Custom type for school subjects | Separate 'School-specific' subject type with its own configurable default weights. | ✓ |
| You decide | Claude picks a sensible default. | |

**User's choice:** Custom type for school subjects
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Must sum to 100% | Enforce total = 100% on save. Show real-time sum. | ✓ |
| Warn but allow | Show warning but allow saving. | |
| You decide | Claude picks. | |

**User's choice:** Must sum to 100% (Recommended)
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| All types apply | SJA has subjects in every DepEd category. | |
| JHS all + SHS subset | All JHS types, only some SHS types. | ✓ |
| Let me specify | User will list specifics. | |

**User's choice:** JHS all + SHS subset
**Notes:** SJA offers Academic track only, no TVL/Sports/Arts track.

---

SHS Tracks offered by SJA (multi-select):
- ✓ Academic — STEM
- ✓ Academic — ABM
- ✓ Academic — HUMSS
- ✓ Academic — GAS

**Notes:** All four Academic strands offered. No TVL/Sports/Arts.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, include that type | SJA has Work Immersion/Research/Business Enterprise subjects. | ✓ |
| Not yet but plan to | Include preset for future use. | |
| No, skip it | Don't include the preset. | |

**User's choice:** Yes, include that type
**Notes:** None

---

## Section & Strand

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-detect by grade | G7-G10 = JHS, G11-G12 = SHS. Fixed DepEd structure. | ✓ |
| Admin marks explicitly | Admin sets each grade level as JHS or SHS. | |
| You decide | Claude picks. | |

**User's choice:** Auto-detect by grade (Recommended)
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Per-section | Each G11/G12 section belongs to one strand. | ✓ |
| Per-student | Strand is a student attribute, not section attribute. | |
| You decide | Claude picks. | |

**User's choice:** Per-section (Recommended)
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Named sections | Sections have names (e.g., "St. John", "Charity"). | ✓ |
| Letter/number codes | Sections use letter or number codes (e.g., "Section A"). | |
| Free-form | Any naming convention — just a text field. | |

**User's choice:** Named sections
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Same strands, different subjects | STEM/ABM/HUMSS/GAS stay, subjects change. | |
| Strands change too | New curriculum introduces new or renamed strands. | ✓ |
| Not sure yet | Build system to be flexible. | |

**User's choice:** Strands change too
**Notes:** This means strands must be fully configurable by admin, not hardcoded.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Pre-populate + editable | System starts with STEM/ABM/HUMSS/GAS. Admin can rename/add/remove. | ✓ |
| Blank — admin creates all | No defaults. Maximum flexibility. | |
| You decide | Claude picks. | |

**User's choice:** Pre-populate + editable (Recommended)
**Notes:** None

---

## Grade Calculations & New Curriculum

User provided DM 074, s. 2025 PDF with the Strengthened SHS Curriculum grading guidelines.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Core + Academic Electives only | SJA doesn't offer TechPro track. | |
| Include TechPro too | Include for completeness/future use. | ✓ |
| Let me clarify | User explains further. | |

**User's choice:** Include TechPro too
**Notes:** Even though SJA is Academic track, include TechPro types for completeness.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-handle | Work Immersion typed subjects automatically use WW+PT only, no QA field. | ✓ |
| Admin configures manually | Admin manually sets weights. | |
| You decide | Claude picks. | |

**User's choice:** Auto-handle (Recommended)
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Two linked subjects | Effective Communication and Mabisang Komunikasyon are separate subjects, auto-averaged. | ✓ |
| One subject with sub-grades | Single subject entry with English and Filipino sub-scores. | |
| You decide | Claude picks. | |

**User's choice:** Two linked subjects (Recommended)
**Notes:** Matches how they're taught (separate sessions) per DM 074 §8.

---

## Claude's Discretion

- Tab order and default active tab
- Expandable grade level → sections inline view layout
- "Copy from previous year" workflow presentation
- Default weights for School-specific (Religious Education) subject type

## Deferred Ideas

None — discussion stayed within phase scope
