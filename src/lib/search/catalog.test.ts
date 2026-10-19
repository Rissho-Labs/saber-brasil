import { describe, expect, it } from "vitest";
import { searchPublications, searchVotings } from "./catalog";

describe("search catalog", () => {
  it("returns the full illustrative catalog when the query is empty", () => {
    expect(searchVotings("")).toHaveLength(3);
    expect(searchPublications("  ")).toHaveLength(3);
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
});
