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

export type PillarMetricKind = "sparkline" | "allocation" | "gauge" | "rating";

export interface PillarMetric {
  id: string;
  title: string;
  kind: PillarMetricKind;
  /** Relative sparkline samples (any positive scale; chart normalizes). */
  points?: readonly number[];
  /** Signed percent change for sparkline badges (e.g. -12). */
  changePercent?: number;
  changeCaption?: string;
  /** Display amount for allocation bars (e.g. "R$ 480M investidos"). */
  amountLabel?: string;
  /** Filled portion of the allocation bar (0–100). */
  allocationPercent?: number;
  /** Score numerator for gauge/rating meters. */
  score?: number;
  /** Score denominator (100 for gauges, 5 for academic ratings). */
  scoreMax?: number;
  caption?: string;
}

export interface SpherePageDefinition {
  slug: SpherePageSlug;
  type: SphereType;
  label: string;
  emoji: string;
  title: string;
  description: string;
  coverage: readonly string[];
  indicatorIds: readonly string[];
  pillars: readonly PillarMetric[];
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
    pillars: [
      {
        id: "politica-orcamento",
        title: "Execução Orçamentária",
        kind: "allocation",
        amountLabel: "R$ 2,1B executados",
        allocationPercent: 78,
        caption: "Percentual ilustrativo da LOA acompanhada neste domínio.",
      },
      {
        id: "politica-assiduidade",
        title: "Assiduidade Plenária",
        kind: "gauge",
        score: 91,
        scoreMax: 100,
        caption: "Presença média ilustrativa em sessões deliberativas.",
      },
    ],
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
    pillars: [
      {
        id: "judiciario-tramitacao",
        title: "Tempo Médio de Tramitação",
        kind: "sparkline",
        points: [42, 40, 38, 37, 35, 33, 31],
        changePercent: -8,
        changeCaption: "de redução no último semestre",
        caption: "Série ilustrativa de dias médios até despacho.",
      },
      {
        id: "judiciario-produtividade",
        title: "Índice de Produtividade Magistrada",
        kind: "gauge",
        score: 82,
        scoreMax: 100,
        caption: "Produtividade relativa ilustrativa por vara acompanhada.",
      },
    ],
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
    pillars: [
      {
        id: "academia-verbas",
        title: "Alocação de Verbas de Pesquisa",
        kind: "allocation",
        amountLabel: "R$ 480M investidos",
        allocationPercent: 72,
        caption: "Volume ilustrativo de editais e bolsas no ciclo corrente.",
      },
      {
        id: "academia-transparencia",
        title: "Índices de Transparência",
        kind: "gauge",
        score: 95,
        scoreMax: 100,
        caption: "Abertura de dados e prestação de contas acadêmicas.",
      },
      {
        id: "academia-producao",
        title: "Produção Acadêmica",
        kind: "rating",
        score: 4.8,
        scoreMax: 5,
        caption: "Nota ilustrativa de produção científica e extensão.",
      },
    ],
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
    pillars: [
      {
        id: "seguranca-criminalidade",
        title: "Tendência de Criminalidade Regional",
        kind: "sparkline",
        points: [68, 64, 61, 58, 55, 52, 48],
        changePercent: -12,
        changeCaption: "de redução no último semestre",
        caption: "Série ilustrativa de ocorrência relativa na região.",
      },
      {
        id: "seguranca-equipamentos",
        title: "Investimento em Equipamentos",
        kind: "allocation",
        amountLabel: "R$ 112M investidos",
        allocationPercent: 64,
        caption: "Capex ilustrativo de viaturas e proteção individual.",
      },
      {
        id: "seguranca-eficiencia",
        title: "Eficiência de Resposta",
        kind: "gauge",
        score: 87,
        scoreMax: 100,
        caption: "Índice ilustrativo de tempo de resposta operacional.",
      },
    ],
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
