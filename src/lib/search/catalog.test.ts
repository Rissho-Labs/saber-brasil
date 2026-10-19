import { describe, expect, it } from "vitest";
import { filterVotingsByStatus, searchPublications, searchVotings, votingsForProfile } from "./catalog";

describe("search catalog", () => {
  it("returns the full illustrative catalog when the query is empty", () => {
    expect(searchVotings("")).toHaveLength(5);
    expect(searchPublications("  ")).toHaveLength(3);
  });

  it("filters legislative items by hub status", () => {
    expect(filterVotingsByStatus(undefined)).toHaveLength(5);
    expect(filterVotingsByStatus("Aprovadas").map((item) => item.code)).toEqual(["PEC 45/2025"]);
    expect(filterVotingsByStatus("Revogadas").map((item) => item.code)).toEqual(["PL 88/2024"]);
  });

  it("matches a voting by code and a publication without accents", () => {
    expect(searchVotings("pec 45").map((item) => item.code)).toEqual(["PEC 45/2025"]);
    expect(searchPublications("transparencia").map((item) => item.title)).toEqual([
      "Relatório de transparência de emendas",
    ]);
  });

  it("returns no rows when nothing matches", () => {
    expect(searchVotings("mariana")).toEqual([]);
    expect(searchPublications("mariana")).toEqual([]);
  });

  it("lists a politician's votes without putting the name in the search index", () => {
    expect(searchVotings("mariana")).toEqual([]);
    expect(
      votingsForProfile("11111111-1111-1111-1111-111111111111").map((item) => [
        item.code,
        item.vote,
      ]),
    ).toEqual([
      ["PEC 3/2026", "Contra"],
      ["PEC 45/2025", "A favor"],
      ["PL 88/2024", "Abstenção"],
    ]);
    expect(votingsForProfile("44444444-4444-4444-8444-444444444441")).toEqual([]);
  });
});
