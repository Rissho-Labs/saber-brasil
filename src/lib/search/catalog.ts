export interface VotingSearchItem {
  id: string;
  code: string;
  title: string;
  description: string;
  status: "Em pauta" | "Aprovado" | "Em tramitação";
  date: string;
}

export interface PublicationSearchItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  sourceUrl: string;
  sourceLabel: string;
}

const VOTINGS: readonly VotingSearchItem[] = [
  {
    id: "voting-pl-1234-2026",
    code: "PL 1234/2026",
    title: "Reforma tributária nos serviços",
    description: "Altera a tributação de serviços e define a regra de transição.",
    status: "Em pauta",
    date: "2026-10-08",
  },
  {
    id: "voting-pec-45-2025",
    code: "PEC 45/2025",
    title: "Incentivos para energias renováveis",
    description: "Inclui incentivos para geração renovável no texto constitucional.",
    status: "Aprovado",
    date: "2026-10-07",
  },
  {
    id: "voting-pec-12-2026",
    code: "PEC 12/2026",
    title: "Dados abertos de votações nominais",
    description: "Torna obrigatória a publicação aberta do voto nominal.",
    status: "Em tramitação",
    date: "2026-09-18",
  },
];

const PUBLICATIONS: readonly PublicationSearchItem[] = [
  {
    id: "publication-emendas",
    title: "Relatório de transparência de emendas",
    summary: "Resume a execução mensal das emendas vinculadas aos mandatos acompanhados.",
    category: "Relatórios",
    date: "2026-10-02",
    sourceUrl: "https://www.camara.leg.br/",
    sourceLabel: "Câmara dos Deputados",
  },
  {
    id: "publication-assiduidade",
    title: "Nota técnica sobre assiduidade",
    summary: "Explica como a presença em sessões entra no índice de gestão.",
    category: "Notas técnicas",
    date: "2026-09-25",
    sourceUrl: "https://www.senado.leg.br/",
    sourceLabel: "Senado Federal",
  },
  {
    id: "publication-gastos",
    title: "Documento de gastos públicos",
    summary: "Lista as fontes oficiais usadas para consultar despesas de representantes.",
    category: "Documentos",
    date: "2026-09-12",
    sourceUrl: "https://www.gov.br/transparencia/pt-br",
    sourceLabel: "Portal da Transparência",
  },
];

function fold(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("pt-BR");
}

function matches(query: string, fields: readonly string[]): boolean {
  const needle = fold(query.trim());
  if (!needle) {
    return true;
  }

  return fields.some((field) => fold(field).includes(needle));
}

export function searchVotings(query: string): VotingSearchItem[] {
  return VOTINGS.filter((item) =>
    matches(query, [item.code, item.title, item.description, item.status]),
  );
}

export function searchPublications(query: string): PublicationSearchItem[] {
  return PUBLICATIONS.filter((item) =>
    matches(query, [item.title, item.summary, item.category]),
  );
}
