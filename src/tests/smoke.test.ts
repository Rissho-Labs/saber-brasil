import { describe, expect, it } from "vitest";
import { safeNextPath } from "@/lib/auth/safe-next-path";

describe("vitest smoke", () => {
  it("runs and resolves the @ path alias", () => {
    expect(true).toBeTruthy();
    expect(safeNextPath("/perfil")).toBe("/perfil");
  });
});
