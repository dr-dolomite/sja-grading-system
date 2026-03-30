import { describe, it } from "vitest"

describe("actions/auth", () => {
  describe("login", () => {
    it.todo("returns field errors when employeeId is empty")
    it.todo("returns field errors when password is empty")
    it.todo("returns form error for non-existent employeeId")
    it.todo("returns form error for wrong password")
    it.todo("returns form error for inactive user")
    it.todo("creates session and redirects to /dashboard on success")
    it.todo("redirects to /change-password when mustChangePassword is true")
  })

  describe("logout", () => {
    it.todo("deletes session and redirects to /login")
  })

  describe("changePassword", () => {
    it.todo("returns error when newPassword is less than 8 characters")
    it.todo("returns error when passwords do not match")
    it.todo("updates password hash and clears mustChangePassword flag")
    it.todo("updates the session JWT after password change")
    it.todo("redirects to /dashboard on success")
  })
})
