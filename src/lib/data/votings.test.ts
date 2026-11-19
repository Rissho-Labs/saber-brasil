import { describe, expect, it } from "vitest";
import {
  getIndividualVotes,
  getPartyBreakdown,
  getTransparencyIndicators,
  getVotingById,
  getVotings,
} from "@/lib/data/votings";

describe("votings mock catalog", () => {
  it("lists realistic legislative votings with plain-language summaries", async () => {
    const all = await getVotings();
    expect(all.length).toBeGreaterThanOrEqual(5);
    expect(all.every((item) => item.plainSummary.length > 0)).toBe(true);
    expect(all.some((item) => item.billCode.startsWith("PL "))).toBe(true);
  });

  it("filters by category, outcome, and query", async () => {
    const health = await getVotings({ category: "Saúde" });
    expect(health.length).toBeGreaterThan(0);
    expect(health.every((item) => item.category === "Saúde")).toBe(true);

    const rejected = await getVotings({ outcome: "Rejected" });
    expect(rejected.map((item) => item.billCode)).toContain("PL 88/2024");

    const byCode = await getVotings({ query: "pec 45" });
    expect(byCode.map((item) => item.id)).toEqual(["vot-pec-45-2025"]);
  });

  it("resolves a voting by id and returns null for unknown ids", async () => {
    const voting = await getVotingById("vot-pl-1904-2024");
    expect(voting?.title).toMatch(/transparência orçamentária/i);
    expect(voting?.institutionalUrgency).toBe(3);
    expect(voting?.citizenPriority).toBe(5);

    await expect(getVotingById("missing")).resolves.toBeNull();
  });

  it("returns party breakdown aggregations for a known voting", async () => {
    const breakdown = await getPartyBreakdown("vot-pl-1904-2024");
    expect(breakdown.length).toBeGreaterThan(0);
    expect(breakdown.every((row) => row.yesCount + row.noCount + row.abstainCount > 0)).toBe(true);
    expect(breakdown.every((row) => row.partyAlignmentPercentage >= 0 && row.partyAlignmentPercentage <= 100)).toBe(
      true,
    );
    expect(breakdown.find((row) => row.party === "PT")?.partyAlignmentPercentage).toBe(91);

    await expect(getPartyBreakdown("missing")).resolves.toEqual([]);
  });

  it("returns individual votes linked to catalog politicians", async () => {
    const votes = await getIndividualVotes("vot-pl-1904-2024");
    expect(votes.some((item) => item.politicianId === "pol-dep-beatriz-rocha" && item.vote === "Yes")).toBe(
      true,
    );
    expect(votes.some((item) => item.vote === "Abstain")).toBe(true);
  });

  it("lists transparency indicators with trend metadata", async () => {
    const indicators = await getTransparencyIndicators();
    expect(indicators.length).toBeGreaterThanOrEqual(4);
    expect(indicators.every((item) => ["up", "down", "stable"].includes(item.trend))).toBe(true);
  });
});
