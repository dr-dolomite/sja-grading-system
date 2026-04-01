# Phase 3: Enrollment & Assignment - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-01
**Phase:** 03-enrollment-assignment
**Areas discussed:** Student profiles & list, Subject enrollment approach, Teacher & adviser assignment UX

---

## Student Profiles & List

### Profile Fields

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal (Recommended) | Name, grade level, section, strand (SHS), sex, contact number | |
| Standard | Minimal + birthdate, address, parent/guardian, LRN | |
| Full registry | Standard + ID photo, enrollment date, previous school, religion, nationality | |

**User's choice:** Other — "Minimal but rather than getting the contact number, lets include LRN instead and the contact number is optional."
**Notes:** Final fields: name (first, middle, last), grade level, section, strand (SHS only), sex, LRN (required), contact number (optional)

### Student List Organization

| Option | Description | Selected |
|--------|-------------|----------|
| Filter by section (Recommended) | Pick grade level then section, shows table. Search bar across all. | ✓ |
| Flat searchable table | Single table with search/sort/filter columns | |
| Grouped accordion | Grade levels as expandable groups, sections nested | |

**User's choice:** Filter by section (Recommended)

### Student Creation Method

| Option | Description | Selected |
|--------|-------------|----------|
| One at a time (Recommended) | Sheet form only, consistent with Phase 1/2 | |
| One at a time + CSV import | Sheet form plus CSV upload for bulk onboarding | ✓ |

**User's choice:** One at a time + CSV import

### Access Control

| Option | Description | Selected |
|--------|-------------|----------|
| Admin + Principal (Recommended) | Both can create/edit/view all students | ✓ |
| Admin only, Principal read-only | Only Admin creates/edits | |
| Admin creates, Principal can edit | Split responsibilities | |

**User's choice:** Admin + Principal (Recommended)

---

## Subject Enrollment Approach

### Enrollment Method

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-enroll by section (Recommended) | Students auto-get section's subjects when assigned | ✓ |
| Manual per-student | Explicitly pick subjects per student | |
| Section-based + manual overrides | Auto-enroll with per-student override capability | |

**User's choice:** Auto-enroll by section (Recommended)

### Subject-Section Linking

| Option | Description | Selected |
|--------|-------------|----------|
| Subjects per grade level (Recommended) | All sections in same grade share subjects. SHS strand determines subjects. | ✓ |
| Subjects per section | Each section can have different subject list | |
| Subjects per grade level + strand | JHS: per grade level. SHS: per grade level + strand. | |

**User's choice:** Subjects assigned per grade level (Recommended)
**Notes:** Follow-up confirmed SHS needs strand-based differentiation — G11-STEM has different subjects from G11-ABM.

### SHS Strand Subject Differentiation

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, strand determines subjects | G11-STEM and G11-ABM have different subject sets | ✓ |
| Same subjects regardless of strand | All G11 students take same subjects | |
| You decide | Claude determines based on DepEd structure | |

**User's choice:** Yes, strand determines subjects

### Assignment Timing

| Option | Description | Selected |
|--------|-------------|----------|
| During school structure setup (Recommended) | Part of Phase 2's structure config, enrollment triggers on section assignment | ✓ |
| Separate enrollment setup step | New step for mapping subjects to grade levels/strands | |

**User's choice:** During school structure setup (Recommended)

---

## Teacher & Adviser Assignment UX

### Teacher Assignment Interface

| Option | Description | Selected |
|--------|-------------|----------|
| Table with assign action (Recommended) | Subject-section pairs table, assign button opens Sheet | ✓ |
| Matrix/grid view | Teachers as rows, subject-sections as columns | |
| Teacher-centric list | Start from teachers, assign subjects/sections to each | |

**User's choice:** Table with assign action (Recommended)

### Adviser Assignment

| Option | Description | Selected |
|--------|-------------|----------|
| Inline on section list (Recommended) | Section rows show adviser, click to change via Sheet | ✓ |
| Separate advisers page | Dedicated page/tab with batch assignment | |
| You decide | Claude picks best approach | |

**User's choice:** Inline on section list (Recommended)

### Multi-Section Teaching

| Option | Description | Selected |
|--------|-------------|----------|
| Yes (Recommended) | Teacher can teach same subject in multiple sections | ✓ |
| No, one section per subject per teacher | Simpler but unrealistic | |

**User's choice:** Yes (Recommended)

### Assignment Filter

| Option | Description | Selected |
|--------|-------------|----------|
| Filter by grade level (Recommended) | Dropdown to filter subject-section pairs by grade level | ✓ |
| Show all, group by grade level | One view with collapsible grade level groups | |

**User's choice:** Filter by grade level (Recommended)

---

## Claude's Discretion

- Page organization (tabbed page vs separate sidebar items)
- CSV import UX details (column mapping, validation, preview)
- Table column design and sort order
- Filter dropdown layout
- Empty states

## Deferred Ideas

None — discussion stayed within phase scope
