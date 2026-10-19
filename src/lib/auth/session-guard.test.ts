import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { requireAuthSession, UnauthorizedError } from "./session-guard.ts";

function expectUnauthorized(session: unknown) {
  assert.throws(
    () => requireAuthSession(session),
    (error: unknown) => {
      assert.ok(error instanceof UnauthorizedError);
      assert.equal(error.code, "UNAUTHORIZED");
      return true;
    },
  );
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

    assert.deepEqual(result, {
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
