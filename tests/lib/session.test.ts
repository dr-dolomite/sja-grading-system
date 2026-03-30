import { describe, it } from "vitest"

describe("lib/session", () => {
  describe("encrypt / decrypt", () => {
    it.todo("encrypts a session payload into a JWT string")
    it.todo("decrypts a valid JWT back to the original payload shape")
    it.todo("returns null when decrypting an invalid token")
    it.todo("returns null when decrypting an expired token")
    it.todo("includes mustChangePassword in the payload")
  })

  describe("createSession", () => {
    it.todo("sets an httpOnly cookie named 'session'")
    it.todo("sets cookie with sameSite lax")
    it.todo("sets 7-day expiry on the cookie")
  })

  describe("deleteSession", () => {
    it.todo("deletes the 'session' cookie")
  })
})
