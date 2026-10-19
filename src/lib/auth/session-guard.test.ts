import { describe, expect, it } from "vitest";
import { requireAuthSession, UnauthorizedError } from "./session-guard";

function expectUnauthorized(session: unknown) {
  expect(() => requireAuthSession(session)).toThrow(UnauthorizedError);

  try {
    requireAuthSession(session);
  } catch (error) {
    expect(error).toMatchObject({ code: "UNAUTHORIZED" });
  }
}

describe("requireAuthSession", () => {
  it("returns a sanitized user id for an active session", () => {
    const result = requireAuthSession({
      access_token: "secret",
      user: {
        id: " 11111111-1111-1111-1111-111111111111 ",
        email: "person@example.com",
      },
    });

    expect(result).toEqual({
      userId: "11111111-1111-1111-1111-111111111111",
      isAuthenticated: true,
    });
  });

  it("rejects a null, undefined, or missing session", () => {
    expectUnauthorized(null);
    expectUnauthorized(undefined);
    expectUnauthorized({});
    expectUnauthorized({ user: null });
  });

  it("rejects a session missing the user id", () => {
    expectUnauthorized({ user: {} });
    expectUnauthorized({ user: { id: "" } });
    expectUnauthorized({ user: { id: "   " } });
    expectUnauthorized({ user: { email: "person@example.com" } });
    expectUnauthorized({ id: "11111111-1111-1111-1111-111111111111" });
  });
});
