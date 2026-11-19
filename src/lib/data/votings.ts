import type {
  IndividualVote,
  PartyVotingBreakdown,
  TransparencyIndicator,
  Voting,
  VotingFilters,
} from "@/types/voting";

/**
 * Illustrative Câmara/Senado voting catalog — not a live open-data feed.
 * Async helpers resolve on the next microtask to mimic lightweight API I/O.
 */

function resolveAsync<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

function fold(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("pt-BR");
}

function matchesQuery(voting: Voting, query: string): boolean {
  const needle = fold(query.trim());
  if (!needle) {
    return true;
  }

  return [voting.billCode, voting.title, voting.summary, voting.plainSummary, voting.category].some(
    (field) => fold(field).includes(needle),
  );
}

const VOTINGS: readonly Voting[] = [
  {
    id: "vot-pl-1904-2024",
    billCode: "PL 1904/2024",
    title: "Marco da transparência orçamentária municipal",
    summary:
      "Obriga municípios acima de 50 mil habitantes a publicar execução orçamentária em formato aberto e atualizado mensalmente.",
    plainSummary:
      "A proposta obriga cidades maiores a mostrar, todo mês e em dados abertos, para onde foi o dinheiro público.",
    category: "Administração Pública",
    voteDate: "2026-09-12",
    result: "Approved",
    rapporteur: "Dep. Beatriz Rocha",
    totalYes: 312,
    totalNo: 98,
    totalAbstain: 27,
    institutionalUrgency: 3,
    citizenPriority: 5,
  },
  {
    id: "vot-pl-2450-2025",
    billCode: "PL 2450/2025",
    title: "Ampliação do piso nacional da enfermagem",
    summary:
      "Atualiza o piso salarial da enfermagem e cria regras de financiamento compartilhado entre União e estados.",
    plainSummary:
      "Aumenta o salário mínimo da enfermagem e define quem paga a conta entre governo federal e estados.",
    category: "Saúde",
    voteDate: "2026-08-21",
    result: "Approved",
    rapporteur: "Dep. Mariana Nunes",
    totalYes: 289,
    totalNo: 121,
    totalAbstain: 18,
    institutionalUrgency: 4,
    citizenPriority: 5,
  },
  {
    id: "vot-pec-45-2025",
    billCode: "PEC 45/2025",
    title: "Incentivos constitucionais às energias renováveis",
    summary:
      "Inclui no texto constitucional incentivos fiscais e de infraestrutura para geração solar e eólica.",
    plainSummary:
      "Muda a Constituição para facilitar energia limpa com benefícios fiscais e de infraestrutura.",
    category: "Meio Ambiente",
    voteDate: "2026-10-07",
    result: "Approved",
    rapporteur: "Sen. Clara Monteiro",
    totalYes: 58,
    totalNo: 14,
    totalAbstain: 5,
    institutionalUrgency: 4,
    citizenPriority: 4,
  },
  {
    id: "vot-pl-88-2024",
    billCode: "PL 88/2024",
    title: "Flexibilização de metas de assiduidade parlamentar",
    summary:
      "Reduz o percentual mínimo de presença em plenário exigido para recebimento de verbas indenizatórias.",
    plainSummary:
      "Facilita o pagamento de benefícios a parlamentares mesmo com menos presença nas sessões.",
    category: "Administração Pública",
    voteDate: "2026-07-03",
    result: "Rejected",
    rapporteur: "Dep. Ricardo Mota",
    totalYes: 142,
    totalNo: 267,
    totalAbstain: 31,
    institutionalUrgency: 5,
    citizenPriority: 1,
  },
  {
    id: "vot-pl-3120-2026",
    billCode: "PL 3120/2026",
    title: "Fundo emergencial de merenda escolar",
    summary:
      "Cria fundo federal para repor merenda escolar em municípios com risco de desabastecimento.",
    plainSummary:
      "Cria um fundo federal para garantir merenda quando a cidade não consegue comprar comida para a escola.",
    category: "Educação",
    voteDate: "2026-10-15",
    result: "Pending",
    rapporteur: "Sen. Paulo Nunes",
    totalYes: 0,
    totalNo: 0,
    totalAbstain: 0,
    institutionalUrgency: 2,
    citizenPriority: 5,
  },
  {
    id: "vot-pl-1577-2025",
    billCode: "PL 1577/2025",
    title: "Padronização de dados de segurança pública",
    summary:
      "Institui layout único de publicação de indicadores criminais pelos estados e pelo Distrito Federal.",
    plainSummary:
      "Obriga todos os estados a publicar dados de criminalidade no mesmo formato, para comparação justa.",
    category: "Segurança",
    voteDate: "2026-06-18",
    result: "Approved",
    rapporteur: "Dep. Alex Silva",
    totalYes: 301,
    totalNo: 87,
    totalAbstain: 22,
    institutionalUrgency: 3,
    citizenPriority: 4,
  },
  {
    id: "vot-pl-990-2026",
    billCode: "PL 990/2026",
    title: "Reforma do Imposto sobre Serviços nos municípios",
    summary:
      "Altera a base de cálculo do ISS e define regras de transição para prestadores digitais.",
    plainSummary:
      "Muda o imposto municipal sobre serviços, inclusive para empresas que vendem pela internet.",
    category: "Economia",
    voteDate: "2026-10-08",
    result: "Pending",
    rapporteur: "Dep. João Freitas",
    totalYes: 0,
    totalNo: 0,
    totalAbstain: 0,
    institutionalUrgency: 5,
    citizenPriority: 3,
  },
];

const INDIVIDUAL_VOTES: Readonly<Record<string, readonly IndividualVote[]>> = {
  "vot-pl-1904-2024": [
    {
      politicianId: "pol-dep-beatriz-rocha",
      politicianName: "Beatriz Rocha",
      party: "PSD",
      state: "SP",
      vote: "Yes",
    },
    {
      politicianId: "pol-dep-alex-silva",
      politicianName: "Alex Silva",
      party: "UNIÃO",
      state: "MG",
      vote: "Yes",
    },
    {
      politicianId: "pol-dep-mariana-nunes",
      politicianName: "Mariana Nunes",
      party: "PT",
      state: "BA",
      vote: "Yes",
    },
    {
      politicianId: "pol-dep-ricardo-mota",
      politicianName: "Ricardo Mota",
      party: "PL",
      state: "RJ",
      vote: "No",
    },
    {
      politicianId: "pol-dep-joao-freitas",
      politicianName: "João Freitas",
      party: "REPUBLICANOS",
      state: "GO",
      vote: "Abstain",
    },
  ],
  "vot-pl-2450-2025": [
    {
      politicianId: "pol-dep-mariana-nunes",
      politicianName: "Mariana Nunes",
      party: "PT",
      state: "BA",
      vote: "Yes",
    },
    {
      politicianId: "pol-dep-beatriz-rocha",
      politicianName: "Beatriz Rocha",
      party: "PSD",
      state: "SP",
      vote: "Yes",
    },
    {
      politicianId: "pol-dep-ricardo-mota",
      politicianName: "Ricardo Mota",
      party: "PL",
      state: "RJ",
      vote: "No",
    },
    {
      politicianId: "pol-dep-alex-silva",
      politicianName: "Alex Silva",
      party: "UNIÃO",
      state: "MG",
      vote: "Abstain",
    },
    {
      politicianId: "pol-dep-joao-freitas",
      politicianName: "João Freitas",
      party: "REPUBLICANOS",
      state: "GO",
      vote: "Yes",
    },
  ],
  "vot-pec-45-2025": [
    {
      politicianId: "pol-sen-clara-monteiro",
      politicianName: "Clara Monteiro",
      party: "MDB",
      state: "RS",
      vote: "Yes",
    },
    {
      politicianId: "pol-sen-paulo-nunes",
      politicianName: "Paulo Nunes",
      party: "PSDB",
      state: "PR",
      vote: "Yes",
    },
    {
      politicianId: "pol-sen-helena-dias",
      politicianName: "Helena Dias",
      party: "PDT",
      state: "CE",
      vote: "Yes",
    },
    {
      politicianId: "pol-dep-ricardo-mota",
      politicianName: "Ricardo Mota",
      party: "PL",
      state: "RJ",
      vote: "No",
    },
  ],
  "vot-pl-88-2024": [
    {
      politicianId: "pol-dep-ricardo-mota",
      politicianName: "Ricardo Mota",
      party: "PL",
      state: "RJ",
      vote: "Yes",
    },
    {
      politicianId: "pol-dep-beatriz-rocha",
      politicianName: "Beatriz Rocha",
      party: "PSD",
      state: "SP",
      vote: "No",
    },
    {
      politicianId: "pol-dep-mariana-nunes",
      politicianName: "Mariana Nunes",
      party: "PT",
      state: "BA",
      vote: "No",
    },
    {
      politicianId: "pol-dep-alex-silva",
      politicianName: "Alex Silva",
      party: "UNIÃO",
      state: "MG",
      vote: "No",
    },
    {
      politicianId: "pol-dep-joao-freitas",
      politicianName: "João Freitas",
      party: "REPUBLICANOS",
      state: "GO",
      vote: "Absent",
    },
  ],
  "vot-pl-1577-2025": [
    {
      politicianId: "pol-dep-alex-silva",
      politicianName: "Alex Silva",
      party: "UNIÃO",
      state: "MG",
      vote: "Yes",
    },
    {
      politicianId: "pol-dep-beatriz-rocha",
      politicianName: "Beatriz Rocha",
      party: "PSD",
      state: "SP",
      vote: "Yes",
    },
    {
      politicianId: "pol-dep-mariana-nunes",
      politicianName: "Mariana Nunes",
      party: "PT",
      state: "BA",
      vote: "Yes",
    },
    {
      politicianId: "pol-dep-ricardo-mota",
      politicianName: "Ricardo Mota",
      party: "PL",
      state: "RJ",
      vote: "Abstain",
    },
  ],
};

const PARTY_BREAKDOWNS: Readonly<Record<string, readonly PartyVotingBreakdown[]>> = {
  "vot-pl-1904-2024": [
    { party: "PSD", yesCount: 48, noCount: 6, abstainCount: 3, partyAlignmentPercentage: 84 },
    { party: "PT", yesCount: 62, noCount: 4, abstainCount: 2, partyAlignmentPercentage: 91 },
    { party: "PL", yesCount: 18, noCount: 55, abstainCount: 7, partyAlignmentPercentage: 23 },
    { party: "UNIÃO", yesCount: 41, noCount: 12, abstainCount: 5, partyAlignmentPercentage: 71 },
    { party: "MDB", yesCount: 29, noCount: 11, abstainCount: 6, partyAlignmentPercentage: 63 },
  ],
  "vot-pl-2450-2025": [
    { party: "PT", yesCount: 68, noCount: 2, abstainCount: 1, partyAlignmentPercentage: 96 },
    { party: "PSD", yesCount: 44, noCount: 9, abstainCount: 4, partyAlignmentPercentage: 77 },
    { party: "PL", yesCount: 12, noCount: 58, abstainCount: 6, partyAlignmentPercentage: 16 },
    { party: "UNIÃO", yesCount: 22, noCount: 18, abstainCount: 14, partyAlignmentPercentage: 41 },
    { party: "MDB", yesCount: 33, noCount: 10, abstainCount: 5, partyAlignmentPercentage: 69 },
  ],
  "vot-pec-45-2025": [
    { party: "MDB", yesCount: 9, noCount: 1, abstainCount: 1, partyAlignmentPercentage: 82 },
    { party: "PSDB", yesCount: 8, noCount: 1, abstainCount: 1, partyAlignmentPercentage: 80 },
    { party: "PDT", yesCount: 6, noCount: 1, abstainCount: 0, partyAlignmentPercentage: 86 },
    { party: "PL", yesCount: 3, noCount: 9, abstainCount: 1, partyAlignmentPercentage: 23 },
  ],
  "vot-pl-88-2024": [
    { party: "PL", yesCount: 61, noCount: 8, abstainCount: 4, partyAlignmentPercentage: 11 },
    { party: "PSD", yesCount: 9, noCount: 47, abstainCount: 5, partyAlignmentPercentage: 77 },
    { party: "PT", yesCount: 3, noCount: 64, abstainCount: 2, partyAlignmentPercentage: 93 },
    { party: "UNIÃO", yesCount: 14, noCount: 39, abstainCount: 7, partyAlignmentPercentage: 65 },
    { party: "MDB", yesCount: 11, noCount: 28, abstainCount: 8, partyAlignmentPercentage: 60 },
  ],
  "vot-pl-1577-2025": [
    { party: "UNIÃO", yesCount: 46, noCount: 7, abstainCount: 4, partyAlignmentPercentage: 81 },
    { party: "PSD", yesCount: 51, noCount: 5, abstainCount: 3, partyAlignmentPercentage: 86 },
    { party: "PT", yesCount: 59, noCount: 6, abstainCount: 2, partyAlignmentPercentage: 88 },
    { party: "PL", yesCount: 21, noCount: 28, abstainCount: 18, partyAlignmentPercentage: 31 },
  ],
};

const TRANSPARENCY_INDICATORS: readonly TransparencyIndicator[] = [
  {
    id: "ind-assiduidade-media",
    title: "Assiduidade média em plenário",
    category: "Legislativo",
    score: 87.4,
    unit: "%",
    trend: "up",
    description: "Média de presença nominal nas sessões deliberativas dos últimos 90 dias.",
    updatedDate: "2026-10-18",
  },
  {
    id: "ind-emendas-publicadas",
    title: "Emendas com execução publicada",
    category: "Orçamento",
    score: 72.1,
    unit: "%",
    trend: "stable",
    description: "Percentual de emendas com detalhamento mensal disponível em formato aberto.",
    updatedDate: "2026-10-10",
  },
  {
    id: "ind-atraso-tramitacao",
    title: "Tempo médio de tramitação",
    category: "Processo legislativo",
    score: 214,
    unit: "dias",
    trend: "down",
    description: "Média de dias entre o protocolo e a primeira deliberação em comissão.",
    updatedDate: "2026-09-30",
  },
  {
    id: "ind-votacoes-nominais",
    title: "Votações nominais abertas",
    category: "Transparência",
    score: 96.8,
    unit: "%",
    trend: "up",
    description: "Participação das votações nominais publicadas com voto individual identificável.",
    updatedDate: "2026-10-16",
  },
  {
    id: "ind-divergencia-prioridade",
    title: "Índice médio de divergência",
    category: "Prioridade cruzada",
    score: 1.8,
    unit: "pts",
    trend: "stable",
    description:
      "Diferença média entre urgência institucional e prioridade cidadã nas votações do semestre.",
    updatedDate: "2026-10-12",
  },
];

export async function getVotings(filters?: VotingFilters): Promise<Voting[]> {
  const rows = VOTINGS.filter((voting) => {
    if (filters?.category && voting.category !== filters.category) {
      return false;
    }
    if (filters?.outcome && voting.result !== filters.outcome) {
      return false;
    }
    if (filters?.query && !matchesQuery(voting, filters.query)) {
      return false;
    }
    return true;
  });

  return resolveAsync([...rows]);
}

export async function getVotingById(id: string): Promise<Voting | null> {
  const voting = VOTINGS.find((item) => item.id === id) ?? null;
  return resolveAsync(voting);
}

export async function getPartyBreakdown(votingId: string): Promise<PartyVotingBreakdown[]> {
  const rows = PARTY_BREAKDOWNS[votingId] ?? [];
  return resolveAsync([...rows]);
}

export async function getIndividualVotes(votingId: string): Promise<IndividualVote[]> {
  const rows = INDIVIDUAL_VOTES[votingId] ?? [];
  return resolveAsync([...rows]);
}

export async function getTransparencyIndicators(): Promise<TransparencyIndicator[]> {
  return resolveAsync([...TRANSPARENCY_INDICATORS]);
}
