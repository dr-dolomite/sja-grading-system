import { describe, it } from "vitest"

describe("createSchoolYear", () => {
  it.todo("creates a school year and auto-generates Q1-Q4 grading periods")
  it.todo("rejects duplicate school year labels")
  it.todo("rejects non-ADMIN users")
})

describe("activateSchoolYear", () => {
  it.todo("deactivates all years then activates the target year atomically")
  it.todo("rejects non-ADMIN users")
})

describe("createSection", () => {
  it.todo("creates a section under a grade level entry")
  it.todo("rejects duplicate section names within the same grade level entry")
  it.todo("allows strand assignment for SHS sections")
  it.todo("does not require strand for JHS sections")
  it.todo("rejects non-ADMIN users")
})

describe("removeSection", () => {
  it.todo("removes a section by ID")
  it.todo("rejects non-ADMIN users")
})

describe("createSubject", () => {
  it.todo("creates a subject with valid 3-component weights summing to 100")
  it.todo("creates a 2-component Work Immersion subject with WW+PT=100")
  it.todo("rejects weights that do not sum to 100 for 3-component subjects")
  it.todo("rejects invalid subject type keys")
  it.todo("rejects non-ADMIN users")
})

describe("updateSubject", () => {
  it.todo("updates subject name and weights")
  it.todo("rejects non-ADMIN users")
})

describe("copyFromPreviousYear", () => {
  it.todo("clones grade level entries and sections from source year")
  it.todo("rejects non-ADMIN users")
})
