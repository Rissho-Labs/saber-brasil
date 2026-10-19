import { SphereType } from "@/types";
import { filterIndicators, type PublicIndicator } from "@/lib/indicadores/catalog";
import { filterVotingsByStatus, type VotingSearchItem } from "@/lib/search/catalog";

export const SPHERE_PAGE_SLUGS = [
  "politica",
  "judiciario",
  "academia",
  "seguranca",
] as const;

export type SpherePageSlug = (typeof SPHERE_PAGE_SLUGS)[number];

export interface SpherePageDefinition {
  slug: SpherePageSlug;
  type: SphereType;
  label: string;
  emoji: string;
  title: string;
  description: string;
  coverage: readonly string[];
  indicatorIds: readonly string[];
}

export const SPHERE_PAGES: readonly SpherePageDefinition[] = [
  {
    slug: "politica",
    type: SphereType.POLITICA,
    label: "Política",
    emoji: "🏛️",
    title: "Política (Executivo e Legislativo)",
    description:
      "Prefeitos, governadores, presidente, vereadores, deputados e senadores. Acompanha mandatos, assiduidade e o peso das pautas públicas.",
    coverage: [
      "Executivo federal, estadual e municipal",
      "Legislativo federal, estadual e municipal",
      "Assiduidade e votações nominais",
      "Peso institucional frente ao peso cidadão",
    ],
    indicatorIds: ["assiduidade", "orcamento"],
  },
  {
    slug: "judiciario",
    type: SphereType.JUDICIARIO,
    label: "Judiciário",
    emoji: "⚖️",
    title: "Judiciário e Controle",
    description:
      "Juízes, desembargadores, ministros e magistrados. A cobertura lista tribunais e o tipo de ato, sem simular um feed de decisões.",
    coverage: [
      "STF, STJ e TSE",
      "Tribunais de Justiça estaduais",
      "Decisões colegiadas e fontes primárias",
      "Situação legal e badges de integridade",
    ],
    indicatorIds: [],
  },
  {
    slug: "academia",
    type: SphereType.ACADEMIA,
    label: "Academia",
    emoji: "🎓",
    title: "Academia e Gestão Pública",
    description:
      "Reitores, corpo docente e gestores de universidades públicas. Editais e processos seletivos entram como escopo ilustrativo.",
    coverage: [
      "Gestão de universidades públicas",
      "Editais e processos seletivos",
      "Corpo docente e administração",
      "Prestação pública de contas acadêmicas",
    ],
    indicatorIds: ["agua", "esgoto"],
  },
  {
    slug: "seguranca",
    type: SphereType.SEGURANCA,
    label: "Segurança",
    emoji: "🛡️",
    title: "Segurança Pública e Defesa",
    description:
      "Comandantes de polícia, delegados-gerais, secretários de segurança e lideranças operacionais. Indicadores ambientais entram quando afetam a resposta de risco.",
    coverage: [
      "Comando e delegacias-gerais",
      "Secretarias de segurança",
      "Lideranças operacionais",
      "Resposta a riscos ambientais e climáticos",
    ],
    indicatorIds: ["queimadas", "desmatamento"],
  },
];

export function spherePageBySlug(slug: string): SpherePageDefinition | null {
  return SPHERE_PAGES.find((sphere) => sphere.slug === slug) ?? null;
}

export function sphereSlugForType(type: SphereType): SpherePageSlug {
  const match = SPHERE_PAGES.find((sphere) => sphere.type === type);
  return match?.slug ?? "politica";
}

export function votingsForSphere(type: SphereType): VotingSearchItem[] {
  return filterVotingsByStatus(undefined).filter((item) => item.sphere === type);
}

export function indicatorsForSphere(sphere: SpherePageDefinition): PublicIndicator[] {
  const all = filterIndicators("todos");
  return all.filter((item) => sphere.indicatorIds.includes(item.id));
}
