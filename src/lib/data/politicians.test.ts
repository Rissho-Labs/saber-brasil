import { describe, expect, it } from "vitest";
import {
  getPoliticianById,
  getPoliticianExpenses,
  getPoliticianProposals,
  getPoliticianVotingHistory,
  getPoliticians,
} from "@/lib/data/politicians";

describe("politicians mock catalog", () => {
  it("lists mixed deputies and senators", async () => {
    const all = await getPoliticians();
    expect(all.length).toBeGreaterThanOrEqual(6);
    expect(all.some((item) => item.role === "deputado")).toBe(true);
    expect(all.some((item) => item.role === "senador")).toBe(true);
  });

  it("filters by UF and role", async () => {
    const spDeputies = await getPoliticians({ state: "SP", role: "deputado" });
    expect(spDeputies.every((item) => item.state === "SP" && item.role === "deputado")).toBe(true);
  });

  it("resolves a politician and their proposals by id", async () => {
    const profile = await getPoliticianById("pol-sen-paulo-nunes");
    expect(profile?.party).toBe("PSDB");
    const proposals = await getPoliticianProposals("pol-sen-paulo-nunes");
    expect(proposals.map((item) => item.code)).toContain("PEC 12/2026");
  });

  it("resolves voting history and expenses by id", async () => {
    const votes = await getPoliticianVotingHistory("pol-sen-paulo-nunes");
    const expenses = await getPoliticianExpenses("pol-sen-paulo-nunes");
    expect(votes.some((item) => item.position === "A favor")).toBe(true);
    expect(expenses.length).toBeGreaterThan(0);
  });

  it("returns null for an unknown id", async () => {
    await expect(getPoliticianById("missing")).resolves.toBeNull();
    await expect(getPoliticianProposals("missing")).resolves.toEqual([]);
    await expect(getPoliticianVotingHistory("missing")).resolves.toEqual([]);
  });
});
