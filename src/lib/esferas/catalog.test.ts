import { describe, expect, it } from "vitest";
import {
  indicatorsForSphere,
  spherePageBySlug,
  votingsForSphere,
} from "./catalog";
import { SphereType } from "@/types";

describe("sphere pages catalog", () => {
  it("resolves the four institutional slugs and rejects unknown ones", () => {
    expect(spherePageBySlug("politica")?.type).toBe(SphereType.POLITICA);
    expect(spherePageBySlug("judiciario")?.type).toBe(SphereType.JUDICIARIO);
    expect(spherePageBySlug("academia")?.type).toBe(SphereType.ACADEMIA);
    expect(spherePageBySlug("seguranca")?.type).toBe(SphereType.SEGURANCA);
    expect(spherePageBySlug("admin")).toBeNull();
  });

  it("keeps legislative votings in Política and climate indicators in Segurança", () => {
    expect(votingsForSphere(SphereType.POLITICA).length).toBeGreaterThan(0);
    expect(votingsForSphere(SphereType.JUDICIARIO)).toEqual([]);
    expect(indicatorsForSphere(spherePageBySlug("politica")!).map((item) => item.id)).toEqual([
      "assiduidade",
      "orcamento",
    ]);
    expect(indicatorsForSphere(spherePageBySlug("seguranca")!).map((item) => item.id)).toEqual([
      "queimadas",
      "desmatamento",
    ]);
  });
});
