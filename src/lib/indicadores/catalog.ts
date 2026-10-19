export const INDICATOR_CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "ambiente", label: "Meio Ambiente & Clima" },
  { id: "infraestrutura", label: "Infraestrutura & Saneamento" },
  { id: "trabalho", label: "Trabalho & Economia" },
  { id: "gestao", label: "Gestão Pública & Transparência" },
] as const;

export type IndicatorCategoryId = (typeof INDICATOR_CATEGORIES)[number]["id"];

export type IndicatorDomain = Exclude<IndicatorCategoryId, "todos">;

export interface IndicatorSource {
  name: string;
  value: string;
  note: string;
}

export interface PublicIndicator {
  id: string;
  title: string;
  category: IndicatorDomain;
  value: string;
  trend: string;
  updatedAt: string;
  official: IndicatorSource;
  audit: IndicatorSource | null;
}

const INDICATORS: readonly PublicIndicator[] = [
  {
    id: "queimadas",
    title: "Focos de queimadas",
    category: "ambiente",
    value: "12.400 focos",
    trend: "+8.1% vs ano anterior",
    updatedAt: "2026-10-01",
    official: {
      name: "INPE",
      value: "12.400 focos",
      note: "Contagem ilustrativa do programa de queimadas.",
    },
    audit: {
      name: "MapBiomas",
      value: "11.900 focos",
      note: "Leitura independente do mesmo período, no catálogo.",
    },
  },
  {
    id: "desmatamento",
    title: "Taxa de desmatamento",
    category: "ambiente",
    value: "9.000 km²",
    trend: "-4.2% vs ano anterior",
    updatedAt: "2026-09-20",
    official: {
      name: "INPE",
      value: "9.000 km²",
      note: "Série ilustrativa no recorte anual.",
    },
    audit: {
      name: "MapBiomas",
      value: "9.400 km²",
      note: "Auditoria independente com outro recorte de área.",
    },
  },
  {
    id: "esgoto",
    title: "Cobertura de esgoto",
    category: "infraestrutura",
    value: "62%",
    trend: "+1.1% vs ano anterior",
    updatedAt: "2026-08-15",
    official: {
      name: "SNIS",
      value: "62%",
      note: "Cobertura ilustrativa da rede coletora.",
    },
    audit: {
      name: "Instituto Trata Brasil",
      value: "55%",
      note: "Auditoria de terceiro setor com critério mais restrito.",
    },
  },
  {
    id: "agua",
    title: "Acesso a água potável",
    category: "infraestrutura",
    value: "84%",
    trend: "+0.6% vs ano anterior",
    updatedAt: "2026-08-15",
    official: {
      name: "SNIS",
      value: "84%",
      note: "Domicílios com rede, no catálogo ilustrativo.",
    },
    audit: null,
  },
  {
    id: "desemprego",
    title: "Taxa de desemprego",
    category: "trabalho",
    value: "6,8%",
    trend: "-0.4 p.p. vs ano anterior",
    updatedAt: "2026-09-30",
    official: {
      name: "IBGE",
      value: "6,8%",
      note: "Taxa ilustrativa da pesquisa domiciliar.",
    },
    audit: {
      name: "IPEA",
      value: "7,1%",
      note: "Leitura independente do mesmo trimestre.",
    },
  },
  {
    id: "inflacao",
    title: "Inflação",
    category: "trabalho",
    value: "4,5%",
    trend: "+0.3 p.p. vs ano anterior",
    updatedAt: "2026-10-10",
    official: {
      name: "IBGE",
      value: "4,5%",
      note: "IPCA ilustrativo acumulado em 12 meses.",
    },
    audit: null,
  },
  {
    id: "assiduidade",
    title: "Assiduidade parlamentar",
    category: "gestao",
    value: "92%",
    trend: "-1.2 p.p. vs ano anterior",
    updatedAt: "2026-10-12",
    official: {
      name: "Câmara dos Deputados",
      value: "92%",
      note: "Média ilustrativa de presença em plenário.",
    },
    audit: null,
  },
  {
    id: "orcamento",
    title: "Execução orçamentária",
    category: "gestao",
    value: "71%",
    trend: "+2.4% vs ano anterior",
    updatedAt: "2026-10-05",
    official: {
      name: "Portal da Transparência",
      value: "71%",
      note: "Empenhado sobre o dotado, no catálogo.",
    },
    audit: {
      name: "IPEA",
      value: "68%",
      note: "Auditoria independente com outro corte de restos a pagar.",
    },
  },
];

export function filterIndicators(category: IndicatorCategoryId | undefined): PublicIndicator[] {
  if (!category || category === "todos") {
    return [...INDICATORS];
  }

  return INDICATORS.filter((item) => item.category === category);
}
