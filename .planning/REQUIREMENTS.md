# Requirements: SJA Grading System

**Defined:** 2026-03-30
**Core Value:** Teachers can input raw scores and the system accurately computes DepEd-standard grades

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [x] **AUTH-01**: Admin can create user accounts with assigned roles (Subject Teacher, Adviser, Principal, Registrar, Admin)
- [x] **AUTH-02**: User can log in with credentials and see role-appropriate dashboard
- [x] **AUTH-03**: User can reset their own password
- [x] **AUTH-04**: User session persists across browser refresh

### School Structure

- [x] **STRUCT-01**: Admin can define school years with quarters (Q1-Q4) for JHS and semesters (Sem 1-2) for SHS
- [x] **STRUCT-02**: Admin can manage grade levels (G7-G12) with multiple sections per level
- [x] **STRUCT-03**: Admin can assign SHS strands (STEM, ABM, HUMSS, GAS) to sections
- [x] **STRUCT-04**: Admin can register subjects with type and DepEd grading component weights

### Enrollment & Assignment

- [x] **ENRL-01**: Admin/Principal can create and edit student profiles (name, grade level, section, strand, contact info)
- [x] **ENRL-02**: Admin/Principal can enroll students into specific subjects per quarter/semester
- [x] **ENRL-03**: Principal can assign teachers to subjects and sections
- [x] **ENRL-04**: Principal can assign advisers to sections

### Grading

- [ ] **GRAD-01**: Subject teacher can define activities (name, max score) under WW/PT/QA components per subject per quarter
- [ ] **GRAD-02**: Subject teacher can enter raw scores per student per activity in a grid view
- [ ] **GRAD-03**: System auto-computes component percentages, weighted scores, and quarterly/semester grades per DepEd rules
- [ ] **GRAD-04**: Subject teacher can view grades of students from other subjects enrolled in their section

### Attendance

- [ ] **ATTN-01**: Subject teacher can search student names and mark absences per subject at class start
- [ ] **ATTN-02**: Teachers and advisers can view attendance records per student per subject
- [ ] **ATTN-03**: System identifies students with perfect attendance per quarter/semester

### Adviser Tools

- [ ] **ADVR-01**: Adviser can trigger deliberation form generation per section (shows all subjects, student grades, averages; warns on incomplete grades)
- [ ] **ADVR-02**: Adviser can create and manage anecdotal records for students in their section
- [ ] **ADVR-03**: Adviser can generate and validate honor roll (Highest Honors 98-100, High Honors 95-97, With Honors 90-94)

### Principal Dashboard

- [ ] **PRIN-01**: Principal can view teacher action logs (attendance report creation timestamps to track tardiness)
- [ ] **PRIN-02**: Principal can edit subject-teacher and advisory assignments
- [ ] **PRIN-03**: Principal can view and edit all anecdotal records across sections

### Admin & Registrar

- [ ] **ADMN-01**: Admin can create, disable, and edit user accounts and role assignments
- [ ] **ADMN-02**: Admin can view system activity logs
- [ ] **RGST-01**: Registrar can view all grades across JHS and SHS sections
- [ ] **RGST-02**: Registrar can view and comment on anecdotal records

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Report Cards

- **RPTC-01**: Adviser can generate custom printable report cards per student (SJA format)
- **RPTC-02**: Report card templates are pluggable (SJA provides templates later)

### Student ID Management

- **STID-01**: Admin can upload student ID photos
- **STID-02**: Admin can track which students have received their physical ID
- **STID-03**: Registrar can download student ID photos

### Principal Student Management

- **PSMG-01**: Principal can view and edit student details directly

### Parent/Student Portal

- **PORT-01**: Parents/students can view their own grades online

## Out of Scope

| Feature | Reason |
|---------|--------|
| Cloud/online deployment | Locally hosted; Tailscale for remote access later |
| DepEd SF9 standard report card | SJA uses custom format |
| Real-time notifications/push alerts | Not needed for school workflow |
| Mobile app | Web-first, responsive design sufficient |
| Parent/student login portal | Teachers and staff only for v1 |
| Integration with DepEd LIS | Manual compliance reporting sufficient |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Complete |
| AUTH-02 | Phase 1 | Complete |
| AUTH-03 | Phase 1 | Complete (01-01) |
| AUTH-04 | Phase 1 | Complete (01-01) |
| STRUCT-01 | Phase 2 | Complete |
| STRUCT-02 | Phase 2 | Complete |
| STRUCT-03 | Phase 2 | Complete |
| STRUCT-04 | Phase 2 | Complete |
| ENRL-01 | Phase 3 | Complete |
| ENRL-02 | Phase 3 | Complete |
| ENRL-03 | Phase 3 | Complete |
| ENRL-04 | Phase 3 | Complete |
| GRAD-01 | Phase 4 | Pending |
| GRAD-02 | Phase 4 | Pending |
| GRAD-03 | Phase 4 | Pending |
| GRAD-04 | Phase 4 | Pending |
| ATTN-01 | Phase 5 | Pending |
| ATTN-02 | Phase 5 | Pending |
| ATTN-03 | Phase 5 | Pending |
| ADVR-01 | Phase 5 | Pending |
| ADVR-02 | Phase 5 | Pending |
| ADVR-03 | Phase 5 | Pending |
| PRIN-01 | Phase 6 | Pending |
| PRIN-02 | Phase 6 | Pending |
| PRIN-03 | Phase 6 | Pending |
| ADMN-01 | Phase 6 | Pending |
| ADMN-02 | Phase 6 | Pending |
| RGST-01 | Phase 6 | Pending |
| RGST-02 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 29 total
- Mapped to phases: 29
- Unmapped: 0

---
*Requirements defined: 2026-03-30*
*Last updated: 2026-03-30 after 01-01 completion — AUTH-03, AUTH-04 backend complete*
