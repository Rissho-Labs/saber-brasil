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

  it("exposes domain pillar metrics for every sphere page", () => {
    expect(spherePageBySlug("academia")!.pillars.map((item) => item.id)).toEqual([
      "academia-verbas",
      "academia-transparencia",
      "academia-producao",
    ]);
    expect(spherePageBySlug("seguranca")!.pillars.map((item) => item.id)).toEqual([
      "seguranca-criminalidade",
      "seguranca-equipamentos",
      "seguranca-eficiencia",
    ]);
    expect(spherePageBySlug("judiciario")!.pillars.map((item) => item.title)).toEqual([
      "Tempo Médio de Tramitação",
      "Índice de Produtividade Magistrada",
    ]);
    expect(spherePageBySlug("politica")!.pillars.map((item) => item.title)).toEqual([
      "Execução Orçamentária",
      "Assiduidade Plenária",
    ]);
  });
});
