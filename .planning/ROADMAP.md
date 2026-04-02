# Roadmap: SJA Grading System

**Milestone:** 1 — Initial Release
**Created:** 2026-03-30
**Granularity:** Standard
**Coverage:** 29/29 v1 requirements mapped

---

## Phases

- [x] **Phase 1: Foundation & Auth** - Users can securely log in to role-appropriate dashboards; database and auth layer established (completed 2026-03-30)
- [ ] **Phase 2: School Structure** - Admin can configure the full school structure (years, quarters, grade levels, sections, strands, subjects)
- [ ] **Phase 3: Enrollment & Assignment** - Students are enrolled and teachers/advisers are assigned to sections and subjects
- [ ] **Phase 4: Grading Engine** - Teachers can define activities, enter raw scores, and the system computes accurate DepEd-compliant grades
- [ ] **Phase 5: Attendance & Adviser Tools** - Attendance is tracked per subject; advisers can generate deliberation forms, anecdotal records, and honor rolls
- [ ] **Phase 6: Staff Dashboards** - Principal, Admin, and Registrar views are complete with oversight and management capabilities

---

## Phase Details

### Phase 1: Foundation & Auth
**Goal**: Users can securely authenticate and land on role-appropriate dashboards; the database and backend layer are operational
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria** (what must be TRUE):
  1. Admin can create a new user account and assign it a role (Subject Teacher, Adviser, Principal, Registrar, Admin)
  2. A user can log in with their credentials and see a dashboard appropriate to their role
  3. A logged-in user's session persists across browser refresh without needing to log in again
  4. A user can reset their own password
**Plans**: 01-00 (setup), 01-01 (auth backend — complete), 01-02 (login/change-password UI), 01-03 (dashboard + account mgmt)
**UI hint**: yes

### Phase 2: School Structure
**Goal**: Admin can fully configure the school's organizational structure — years, periods, grade levels, sections, strands, and subjects — before any data entry begins
**Depends on**: Phase 1
**Requirements**: STRUCT-01, STRUCT-02, STRUCT-03, STRUCT-04
**Success Criteria** (what must be TRUE):
  1. Admin can create a school year and define Q1-Q4 quarters for JHS and Sem 1/Sem 2 for SHS
  2. Admin can add grade levels (G7-G12) and create multiple named sections within each level
  3. Admin can assign an SHS strand (STEM, ABM, HUMSS, GAS) to an SHS section
  4. Admin can register a subject with its type and configure the DepEd grading component weights (Written Work, Performance Task, Quarterly Assessment)
**Plans**: 4 plans
Plans:
- [x] 02-01-PLAN.md — Prisma schema, subject type presets, test infrastructure (completed 2026-03-30)
- [x] 02-02-PLAN.md — Server Actions, sidebar nav, page shell, School Year tab
- [x] 02-03-PLAN.md — Grade Levels tab with sections, Subjects tab with weight presets
- [x] 02-04-PLAN.md — Human verification checkpoint
**UI hint**: yes

### Phase 3: Enrollment & Assignment
**Goal**: Students have profiles, are enrolled in subjects, and teachers/advisers are assigned — the system knows who teaches what and to whom
**Depends on**: Phase 2
**Requirements**: ENRL-01, ENRL-02, ENRL-03, ENRL-04
**Success Criteria** (what must be TRUE):
  1. Admin or Principal can create a student profile with name, grade level, section, strand, and contact info, and edit it later
  2. Admin or Principal can enroll a student into specific subjects for a given quarter or semester
  3. Principal can assign a subject teacher to a subject-section pairing
  4. Principal can assign an adviser to a section
**Plans**: 5 plans
Plans:
- [x] 03-01-PLAN.md — Prisma schema extension + SubjectAssignment linking UI
- [ ] 03-02-PLAN.md — Student CRUD, auto-enrollment, enrollment page with Students tab
- [ ] 03-03-PLAN.md — Teacher and adviser assignment tables and Sheet forms
- [ ] 03-04-PLAN.md — CSV bulk import for students
- [ ] 03-05-PLAN.md — Human verification checkpoint
**UI hint**: yes

### Phase 4: Grading Engine
**Goal**: Teachers can define activities, enter raw scores, and the system accurately computes DepEd-compliant component percentages and quarterly/semester grades
**Depends on**: Phase 3
**Requirements**: GRAD-01, GRAD-02, GRAD-03, GRAD-04
**Success Criteria** (what must be TRUE):
  1. A subject teacher can define activities (name + max score) under Written Work, Performance Task, or Quarterly Assessment for their subject and quarter
  2. A subject teacher can enter raw scores per student per activity in a grid layout
  3. The system automatically computes each component's percentage score, applies DepEd weights, and displays the final quarterly or semester grade per student
  4. A subject teacher can view the grades of students from other subjects who are enrolled in their section
**Plans**: TBD
**UI hint**: yes

### Phase 5: Attendance & Adviser Tools
**Goal**: Attendance is tracked per subject per class session; advisers can generate deliberation forms, maintain anecdotal records, and compute honor rolls
**Depends on**: Phase 4
**Requirements**: ATTN-01, ATTN-02, ATTN-03, ADVR-01, ADVR-02, ADVR-03
**Success Criteria** (what must be TRUE):
  1. A subject teacher can search student names and mark them absent at the start of a class, without affecting attendance in other subjects on the same day
  2. A teacher or adviser can view the attendance record for any student in any subject they have access to
  3. The system identifies and displays which students have perfect attendance for the quarter or semester
  4. An adviser can trigger deliberation form generation for their section, which shows all subjects, student grades, and section averages, and warns if any grades are incomplete
  5. An adviser can create anecdotal records for students in their section and the system marks the student's concern as tracked
  6. An adviser can generate the honor roll for their section with correct tier classification (Highest Honors 98-100, High Honors 95-97, With Honors 90-94)
**Plans**: TBD
**UI hint**: yes

### Phase 6: Staff Dashboards
**Goal**: Principal, Admin, and Registrar each have a functional dashboard giving them the oversight and management capabilities assigned to their role
**Depends on**: Phase 5
**Requirements**: PRIN-01, PRIN-02, PRIN-03, ADMN-01, ADMN-02, RGST-01, RGST-02
**Success Criteria** (what must be TRUE):
  1. Principal can view a log of teacher actions showing when attendance reports were submitted, to identify late submissions
  2. Principal can edit subject-teacher assignments and advisory assignments directly from their dashboard
  3. Principal can view and edit anecdotal records across all sections
  4. Admin can create, disable, or edit any user account and change role assignments
  5. Admin can view a system activity log showing who did what and when
  6. Registrar can view student grades across all JHS and SHS sections
  7. Registrar can view and leave comments on anecdotal records
**Plans**: TBD
**UI hint**: yes

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Auth | 4/4 | Complete   | 2026-03-30 |
| 2. School Structure | 4/4 | Complete   | 2026-03-31 |
| 3. Enrollment & Assignment | 1/5 | In Progress|  |
| 4. Grading Engine | 0/0 | Not started | - |
| 5. Attendance & Adviser Tools | 0/0 | Not started | - |
| 6. Staff Dashboards | 0/0 | Not started | - |

---

## Coverage Map

| Requirement | Phase | Category |
|-------------|-------|----------|
| AUTH-01 | 1 | Authentication |
| AUTH-02 | 1 | Authentication |
| AUTH-03 | 1 | Authentication |
| AUTH-04 | 1 | Authentication |
| STRUCT-01 | 2 | School Structure |
| STRUCT-02 | 2 | School Structure |
| STRUCT-03 | 2 | School Structure |
| STRUCT-04 | 2 | School Structure |
| ENRL-01 | 3 | Enrollment & Assignment |
| ENRL-02 | 3 | Enrollment & Assignment |
| ENRL-03 | 3 | Enrollment & Assignment |
| ENRL-04 | 3 | Enrollment & Assignment |
| GRAD-01 | 4 | Grading |
| GRAD-02 | 4 | Grading |
| GRAD-03 | 4 | Grading |
| GRAD-04 | 4 | Grading |
| ATTN-01 | 5 | Attendance |
| ATTN-02 | 5 | Attendance |
| ATTN-03 | 5 | Attendance |
| ADVR-01 | 5 | Adviser Tools |
| ADVR-02 | 5 | Adviser Tools |
| ADVR-03 | 5 | Adviser Tools |
| PRIN-01 | 6 | Principal Dashboard |
| PRIN-02 | 6 | Principal Dashboard |
| PRIN-03 | 6 | Principal Dashboard |
| ADMN-01 | 6 | Admin & Registrar |
| ADMN-02 | 6 | Admin & Registrar |
| RGST-01 | 6 | Admin & Registrar |
| RGST-02 | 6 | Admin & Registrar |

**Mapped:** 29/29 — complete coverage

---
*Created: 2026-03-30*
