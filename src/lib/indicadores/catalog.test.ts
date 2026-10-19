import { describe, expect, it } from "vitest";
import { filterIndicators } from "./catalog";

describe("indicator catalog", () => {
  it("returns every illustrative indicator for Todos", () => {
    expect(filterIndicators("todos")).toHaveLength(8);
    expect(filterIndicators(undefined)).toHaveLength(8);
  });

  it("filters by domain and keeps the official source", () => {
    const climate = filterIndicators("ambiente");
    expect(climate.map((item) => item.title)).toEqual([
      "Focos de queimadas",
      "Taxa de desmatamento",
    ]);
    expect(climate.every((item) => item.official.name === "INPE")).toBe(true);
  });

  it("marks water access as official-only", () => {
    const water = filterIndicators("infraestrutura").find((item) => item.id === "agua");
    expect(water?.audit).toBeNull();
  });
});
