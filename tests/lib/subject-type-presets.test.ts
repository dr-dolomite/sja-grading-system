import { describe, it, expect } from "vitest"
import { SUBJECT_TYPE_PRESETS, getPreset, SUBJECT_TYPE_KEYS } from "@/lib/subject-type-presets"
import type { SubjectTypeKey } from "@/lib/subject-type-presets"

describe("SUBJECT_TYPE_PRESETS", () => {
  it("contains exactly 13 preset entries", () => {
    expect(Object.keys(SUBJECT_TYPE_PRESETS)).toHaveLength(13)
  })

  it("every 3-component preset has WW + PT + QA = 100", () => {
    for (const [, preset] of Object.entries(SUBJECT_TYPE_PRESETS)) {
      if (preset.hasQuarterlyAssessment) {
        expect(preset.defaultWW + preset.defaultPT + (preset.defaultQA ?? 0)).toBe(100)
      }
    }
  })

  it("every 2-component preset has WW + PT = 100 and QA = null", () => {
    for (const [, preset] of Object.entries(SUBJECT_TYPE_PRESETS)) {
      if (!preset.hasQuarterlyAssessment) {
        expect(preset.defaultWW + preset.defaultPT).toBe(100)
        expect(preset.defaultQA).toBeNull()
      }
    }
  })

  it("JHS_LANGUAGES has WW=30, PT=50, QA=20", () => {
    expect(SUBJECT_TYPE_PRESETS.JHS_LANGUAGES).toMatchObject({
      defaultWW: 30,
      defaultPT: 50,
      defaultQA: 20,
      curriculum: "JHS",
      hasQuarterlyAssessment: true,
    })
  })

  it("SHS_NEW_WORK_IMMERSION has WW=20, PT=80, QA=null, hasQA=false", () => {
    expect(SUBJECT_TYPE_PRESETS.SHS_NEW_WORK_IMMERSION).toMatchObject({
      defaultWW: 20,
      defaultPT: 80,
      defaultQA: null,
      hasQuarterlyAssessment: false,
      curriculum: "SHS_NEW",
    })
  })

  it("SCHOOL_RELIGIOUS_ED has curriculum=SCHOOL", () => {
    expect(SUBJECT_TYPE_PRESETS.SCHOOL_RELIGIOUS_ED.curriculum).toBe("SCHOOL")
  })
})

describe("getPreset", () => {
  it("returns the preset for a valid key", () => {
    expect(getPreset("JHS_LANGUAGES")).toBeDefined()
    expect(getPreset("JHS_LANGUAGES")?.label).toBe("Languages (Filipino, English)")
  })

  it("returns undefined for an invalid key", () => {
    expect(getPreset("INVALID_KEY")).toBeUndefined()
  })
})

describe("SUBJECT_TYPE_KEYS", () => {
  it("contains all 13 keys as strings", () => {
    expect(SUBJECT_TYPE_KEYS).toHaveLength(13)
    expect(SUBJECT_TYPE_KEYS).toContain("JHS_LANGUAGES")
    expect(SUBJECT_TYPE_KEYS).toContain("SHS_NEW_WORK_IMMERSION")
    expect(SUBJECT_TYPE_KEYS).toContain("SCHOOL_RELIGIOUS_ED")
  })
})

// Ensure SubjectTypeKey type is used to prevent unused import warning
const _typeCheck: SubjectTypeKey = "JHS_LANGUAGES"
void _typeCheck
