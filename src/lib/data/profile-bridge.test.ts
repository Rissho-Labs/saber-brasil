import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveUnifiedPolitician } from "@/lib/data/profile-bridge";

vi.mock("@/lib/services/profiles", () => ({
  getPublicProfileById: vi.fn(async () => {
    throw new Error("network unavailable");
  }),
}));

describe("resolveUnifiedPolitician", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("returns catalog profiles with digital channels and biography", async () => {
    const profile = await resolveUnifiedPolitician("pol-dep-beatriz-rocha");
    expect(profile).not.toBeNull();
    expect(profile?.source).toBe("catalog");
    expect(profile?.catalogId).toBe("pol-dep-beatriz-rocha");
    expect(profile?.biographySummary).toMatch(/transparência/i);
    expect(profile?.digitalChannels.length).toBeGreaterThanOrEqual(2);
    expect(profile?.digitalChannels.some((item) => item.platform === "official_portal")).toBe(
      true,
    );
    expect(profile?.digitalChannels.some((item) => item.platform === "instagram")).toBe(true);
  });

  it("returns null for blank ids", async () => {
    await expect(resolveUnifiedPolitician("   ")).resolves.toBeNull();
  });

  it("falls back gracefully when Supabase env is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    await expect(
      resolveUnifiedPolitician("11111111-1111-1111-1111-111111111111"),
    ).resolves.toBeNull();
  });

  it("swallows Supabase network failures for unknown catalog ids", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");

    await expect(resolveUnifiedPolitician("missing-politician")).resolves.toBeNull();
  });
});
