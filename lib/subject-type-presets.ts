export type SubjectTypeKey =
  | "JHS_LANGUAGES"
  | "JHS_AP_ESP"
  | "JHS_SCIENCE_MATH"
  | "JHS_MAPEH_EPP_TLE"
  | "SHS_OLD_CORE"
  | "SHS_OLD_ACADEMIC_OTHER"
  | "SHS_OLD_ACADEMIC_WORK_IMMERSION"
  | "SHS_NEW_CORE"
  | "SHS_NEW_ACADEMIC_ELECTIVE"
  | "SHS_NEW_ACADEMIC_FIELD"
  | "SHS_NEW_TECHPRO_ELECTIVE"
  | "SHS_NEW_WORK_IMMERSION"
  | "SCHOOL_RELIGIOUS_ED"

export interface SubjectTypePreset {
  label: string
  curriculum: "JHS" | "SHS_OLD" | "SHS_NEW" | "SCHOOL"
  hasQuarterlyAssessment: boolean
  defaultWW: number
  defaultPT: number
  defaultQA: number | null
}

export const SUBJECT_TYPE_PRESETS: Record<SubjectTypeKey, SubjectTypePreset> = {
  JHS_LANGUAGES: {
    label: "Languages (Filipino, English)",
    curriculum: "JHS",
    hasQuarterlyAssessment: true,
    defaultWW: 30,
    defaultPT: 50,
    defaultQA: 20,
  },
  JHS_AP_ESP: {
    label: "AP / EsP",
    curriculum: "JHS",
    hasQuarterlyAssessment: true,
    defaultWW: 40,
    defaultPT: 40,
    defaultQA: 20,
  },
  JHS_SCIENCE_MATH: {
    label: "Science / Math",
    curriculum: "JHS",
    hasQuarterlyAssessment: true,
    defaultWW: 40,
    defaultPT: 40,
    defaultQA: 20,
  },
  JHS_MAPEH_EPP_TLE: {
    label: "MAPEH / EPP / TLE",
    curriculum: "JHS",
    hasQuarterlyAssessment: true,
    defaultWW: 20,
    defaultPT: 60,
    defaultQA: 20,
  },
  SHS_OLD_CORE: {
    label: "Core Subjects (old curriculum)",
    curriculum: "SHS_OLD",
    hasQuarterlyAssessment: true,
    defaultWW: 25,
    defaultPT: 50,
    defaultQA: 25,
  },
  SHS_OLD_ACADEMIC_OTHER: {
    label: "Academic Track -- Other",
    curriculum: "SHS_OLD",
    hasQuarterlyAssessment: true,
    defaultWW: 25,
    defaultPT: 45,
    defaultQA: 30,
  },
  SHS_OLD_ACADEMIC_WORK_IMMERSION: {
    label: "Academic Track -- Work Immersion / Research (old curriculum)",
    curriculum: "SHS_OLD",
    hasQuarterlyAssessment: true,
    defaultWW: 35,
    defaultPT: 40,
    defaultQA: 25,
  },
  SHS_NEW_CORE: {
    label: "Core (Strengthened)",
    curriculum: "SHS_NEW",
    hasQuarterlyAssessment: true,
    defaultWW: 25,
    defaultPT: 50,
    defaultQA: 25,
  },
  SHS_NEW_ACADEMIC_ELECTIVE: {
    label: "Academic Electives",
    curriculum: "SHS_NEW",
    hasQuarterlyAssessment: true,
    defaultWW: 25,
    defaultPT: 45,
    defaultQA: 30,
  },
  SHS_NEW_ACADEMIC_FIELD: {
    label: "Academic Electives -- Field Experience / Sports and Arts",
    curriculum: "SHS_NEW",
    hasQuarterlyAssessment: true,
    defaultWW: 20,
    defaultPT: 60,
    defaultQA: 20,
  },
  SHS_NEW_TECHPRO_ELECTIVE: {
    label: "TechPro Electives",
    curriculum: "SHS_NEW",
    hasQuarterlyAssessment: true,
    defaultWW: 15,
    defaultPT: 65,
    defaultQA: 20,
  },
  SHS_NEW_WORK_IMMERSION: {
    label: "TechPro -- Work Immersion",
    curriculum: "SHS_NEW",
    hasQuarterlyAssessment: false,
    defaultWW: 20,
    defaultPT: 80,
    defaultQA: null,
  },
  SCHOOL_RELIGIOUS_ED: {
    label: "Religious Education (school-specific)",
    curriculum: "SCHOOL",
    hasQuarterlyAssessment: true,
    defaultWW: 30,
    defaultPT: 50,
    defaultQA: 20,
  },
}

export function getPreset(key: string): SubjectTypePreset | undefined {
  return SUBJECT_TYPE_PRESETS[key as SubjectTypeKey]
}

export const SUBJECT_TYPE_KEYS: string[] = Object.keys(SUBJECT_TYPE_PRESETS)
