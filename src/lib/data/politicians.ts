import { getCachedOpenDataSnapshot } from "@/lib/open-data/sync-service";
import type {
  BrazilianUF,
  DigitalChannel,
  ExpenseSummary,
  PoliticalProposal,
  Politician,
  PoliticianFilters,
  PoliticianRole,
  VotingRecord,
} from "@/types/politician";

/**
 * Illustrative federal roster — not a live Câmara/Senado feed.
 * Async helpers resolve on the next microtask to mimic lightweight API I/O.
 * Optional live merge when `SABER_USE_LIVE_OPEN_DATA=true` and a sync snapshot exists.
 */

function resolveAsync<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

function isLiveOpenDataEnabled(): boolean {
  return process.env.SABER_USE_LIVE_OPEN_DATA === "true";
}

/** Local curated rows win on id collision; live-only ids append after. */
function mergePoliticiansCatalogFirst(
  local: readonly Politician[],
  live: readonly Politician[],
): Politician[] {
  const seen = new Set(local.map((item) => item.id));
  const merged = [...local];

  for (const item of live) {
    if (seen.has(item.id)) {
      continue;
    }
    seen.add(item.id);
    merged.push(item);
  }

  return merged;
}

function resolvePoliticianCatalog(): Politician[] {
  if (!isLiveOpenDataEnabled()) {
    return [...POLITICIANS];
  }

  const live = getCachedOpenDataSnapshot()?.politicians ?? [];
  if (live.length === 0) {
    return [...POLITICIANS];
  }

  return mergePoliticiansCatalogFirst(POLITICIANS, live);
}

function chamberPortal(role: PoliticianRole): DigitalChannel {
  if (role === "senador") {
    return {
      platform: "official_portal",
      label: "Portal do Senado",
      url: "https://www12.senado.leg.br/",
      verified: true,
    };
  }

  return {
    platform: "official_portal",
    label: "Portal da Câmara",
    url: "https://www.camara.leg.br/",
    verified: true,
  };
}

const POLITICIANS: readonly Politician[] = [
  {
    id: "pol-dep-beatriz-rocha",
    name: "Beatriz Rocha",
    civilName: "Beatriz Almeida Rocha",
    party: "PSD",
    state: "SP",
    role: "deputado",
    photoUrl: null,
    email: "dep.beatriz.rocha@camara.leg.br",
    phone: "+55 61 3215-0101",
    metrics: {
      presenceRate: 96,
      proposalsCount: 42,
      votingAlignmentPercentage: 88,
    },
    biographySummary:
      "Deputada federal por São Paulo. Atua em proposições de transparência orçamentária e publicação de emendas.",
    digitalChannels: [
      chamberPortal("deputado"),
      {
        platform: "website",
        label: "Site oficial",
        url: "https://www.camara.leg.br/",
        verified: true,
      },
      {
        platform: "instagram",
        label: "Instagram Oficial",
        handle: "@depbeatrizrocha",
        url: "https://www.instagram.com/",
        verified: true,
      },
      {
        platform: "youtube",
        label: "Canal no YouTube",
        url: "https://www.youtube.com/",
        verified: false,
      },
    ],
  },
  {
    id: "pol-dep-alex-silva",
    name: "Alex Silva",
    civilName: "Alexandre Pereira Silva",
    party: "UNIÃO",
    state: "MG",
    role: "deputado",
    photoUrl: null,
    email: "dep.alex.silva@camara.leg.br",
    phone: "+55 61 3215-0202",
    metrics: {
      presenceRate: 94,
      proposalsCount: 31,
      votingAlignmentPercentage: 81,
    },
    biographySummary:
      "Deputado federal por Minas Gerais. Acompanha temas de fiscalização de contratos e dados abertos.",
    digitalChannels: [
      chamberPortal("deputado"),
      {
        platform: "x",
        label: "Perfil no X",
        handle: "@DepAlexSilva",
        url: "https://x.com/",
        verified: true,
      },
      {
        platform: "facebook",
        label: "Página no Facebook",
        url: "https://www.facebook.com/",
        verified: false,
      },
      {
        platform: "youtube",
        label: "Canal no YouTube",
        url: "https://www.youtube.com/",
        verified: false,
      },
    ],
  },
  {
    id: "pol-dep-mariana-nunes",
    name: "Mariana Nunes",
    civilName: "Mariana Costa Nunes",
    party: "PT",
    state: "BA",
    role: "deputado",
    photoUrl: null,
    email: "dep.mariana.nunes@camara.leg.br",
    phone: "+55 61 3215-0303",
    metrics: {
      presenceRate: 91,
      proposalsCount: 55,
      votingAlignmentPercentage: 93,
    },
    biographySummary:
      "Deputada federal pela Bahia. Concentra proposições em educação pública e políticas de saúde.",
    digitalChannels: [
      chamberPortal("deputado"),
      {
        platform: "instagram",
        label: "Instagram Oficial",
        handle: "@dep.mariananunes",
        url: "https://www.instagram.com/",
        verified: true,
      },
      {
        platform: "tiktok",
        label: "TikTok Oficial",
        handle: "@mariananunesdep",
        url: "https://www.tiktok.com/",
        verified: false,
      },
      {
        platform: "podcast",
        label: "Podcast do mandato",
        url: "https://open.spotify.com/",
        verified: false,
      },
    ],
  },
  {
    id: "pol-dep-ricardo-mota",
    name: "Ricardo Mota",
    civilName: "Ricardo Alves Mota",
    party: "PL",
    state: "RJ",
    role: "deputado",
    photoUrl: null,
    email: "dep.ricardo.mota@camara.leg.br",
    phone: "+55 61 3215-0404",
    metrics: {
      presenceRate: 87,
      proposalsCount: 19,
      votingAlignmentPercentage: 79,
    },
    biographySummary:
      "Deputado federal pelo Rio de Janeiro. Registra proposições ligadas a segurança portuária e logística.",
    digitalChannels: [
      chamberPortal("deputado"),
      {
        platform: "website",
        label: "Site oficial",
        url: "https://www.camara.leg.br/",
        verified: true,
      },
      {
        platform: "youtube",
        label: "Canal no YouTube",
        url: "https://www.youtube.com/",
        verified: false,
      },
      {
        platform: "x",
        label: "Perfil no X",
        handle: "@RicardoMotaDep",
        url: "https://x.com/",
        verified: false,
      },
    ],
  },
  {
    id: "pol-sen-clara-monteiro",
    name: "Clara Monteiro",
    civilName: "Clara Fernandes Monteiro",
    party: "MDB",
    state: "RS",
    role: "senador",
    photoUrl: null,
    email: "sen.clara.monteiro@senado.leg.br",
    phone: "+55 61 3303-1101",
    metrics: {
      presenceRate: 98,
      proposalsCount: 14,
      votingAlignmentPercentage: 85,
    },
    biographySummary:
      "Senadora pelo Rio Grande do Sul. Relatora de matérias sobre transparência das sessões e energia renovável.",
    digitalChannels: [
      chamberPortal("senador"),
      {
        platform: "instagram",
        label: "Instagram Oficial",
        handle: "@senclaramonteiro",
        url: "https://www.instagram.com/",
        verified: true,
      },
      {
        platform: "spotify",
        label: "Spotify — áudios do mandato",
        url: "https://open.spotify.com/",
        verified: false,
      },
      {
        platform: "website",
        label: "Site oficial",
        url: "https://www12.senado.leg.br/",
        verified: true,
      },
    ],
  },
  {
    id: "pol-sen-paulo-nunes",
    name: "Paulo Nunes",
    civilName: "Paulo Henrique Nunes",
    party: "PSDB",
    state: "PR",
    role: "senador",
    photoUrl: null,
    email: "sen.paulo.nunes@senado.leg.br",
    phone: "+55 61 3303-1202",
    metrics: {
      presenceRate: 92,
      proposalsCount: 11,
      votingAlignmentPercentage: 76,
    },
    biographySummary:
      "Senador pelo Paraná. Autoria de propostas sobre dados abertos de votações nominais e limites de sigilo.",
    digitalChannels: [
      chamberPortal("senador"),
      {
        platform: "youtube",
        label: "Canal no YouTube",
        url: "https://www.youtube.com/",
        verified: true,
      },
      {
        platform: "x",
        label: "Perfil no X",
        handle: "@SenPauloNunes",
        url: "https://x.com/",
        verified: true,
      },
      {
        platform: "facebook",
        label: "Página no Facebook",
        url: "https://www.facebook.com/",
        verified: false,
      },
    ],
  },
  {
    id: "pol-sen-helena-dias",
    name: "Helena Dias",
    civilName: "Helena Souza Dias",
    party: "PDT",
    state: "CE",
    role: "senador",
    photoUrl: null,
    email: "sen.helena.dias@senado.leg.br",
    phone: "+55 61 3303-1303",
    metrics: {
      presenceRate: 95,
      proposalsCount: 17,
      votingAlignmentPercentage: 90,
    },
    biographySummary:
      "Senadora pelo Ceará. Trabalha proposições de saúde pública e acompanhamento de indicadores sociais.",
    digitalChannels: [
      chamberPortal("senador"),
      {
        platform: "instagram",
        label: "Instagram Oficial",
        handle: "@senhelenadias",
        url: "https://www.instagram.com/",
        verified: true,
      },
      {
        platform: "podcast",
        label: "Podcast do gabinete",
        url: "https://open.spotify.com/",
        verified: false,
      },
      {
        platform: "website",
        label: "Site oficial",
        url: "https://www12.senado.leg.br/",
        verified: true,
      },
    ],
  },
  {
    id: "pol-dep-joao-freitas",
    name: "João Freitas",
    civilName: "João Pedro Freitas",
    party: "REPUBLICANOS",
    state: "GO",
    role: "deputado",
    photoUrl: null,
    email: "dep.joao.freitas@camara.leg.br",
    phone: "+55 61 3215-0505",
    metrics: {
      presenceRate: 89,
      proposalsCount: 27,
      votingAlignmentPercentage: 84,
    },
    biographySummary:
      "Deputado federal por Goiás. Proposições voltadas a crédito rural e agro familiar no catálogo ilustrativo.",
    digitalChannels: [
      chamberPortal("deputado"),
      {
        platform: "facebook",
        label: "Página no Facebook",
        url: "https://www.facebook.com/",
        verified: false,
      },
      {
        platform: "instagram",
        label: "Instagram Oficial",
        handle: "@depjoaofreitas",
        url: "https://www.instagram.com/",
        verified: false,
      },
      {
        platform: "youtube",
        label: "Canal no YouTube",
        url: "https://www.youtube.com/",
        verified: false,
      },
    ],
  },
];

const PROPOSALS_BY_POLITICIAN: Readonly<Record<string, readonly PoliticalProposal[]>> = {
  "pol-dep-beatriz-rocha": [
    {
      id: "prop-br-1",
      code: "PL 2104/2024",
      title: "Transparência de emendas individuais",
      summary: "Obriga publicação detalhada do plano de trabalho das emendas de bancada e individuais.",
      status: "Em Tramitação",
      presentationDate: "2024-03-12",
    },
    {
      id: "prop-br-2",
      code: "PL 3310/2025",
      title: "Cashback na cesta básica",
      summary: "Institui devolução parcial de tributos sobre itens essenciais para famílias de baixa renda.",
      status: "Em Discussão",
      presentationDate: "2025-08-01",
    },
  ],
  "pol-dep-alex-silva": [
    {
      id: "prop-as-1",
      code: "PL 890/2024",
      title: "Fiscalização de contratos de TI",
      summary: "Padroniza auditoria de contratos de tecnologia na administração pública federal.",
      status: "Aprovado",
      presentationDate: "2024-02-20",
    },
  ],
  "pol-dep-mariana-nunes": [
    {
      id: "prop-mn-1",
      code: "PL 1455/2024",
      title: "Educação digital nas escolas públicas",
      summary: "Cria programa federal de conectividade e formação docente em escolas da rede pública.",
      status: "Em Tramitação",
      presentationDate: "2024-05-09",
    },
    {
      id: "prop-mn-2",
      code: "PEC 18/2025",
      title: "Prioridade orçamentária para creches",
      summary: "Inclui meta constitucional mínima de vagas em educação infantil.",
      status: "Em Discussão",
      presentationDate: "2025-04-17",
    },
  ],
  "pol-dep-ricardo-mota": [
    {
      id: "prop-rm-1",
      code: "PL 502/2025",
      title: "Segurança portuária",
      summary: "Atualiza regras de monitoramento em portos federais com integração de dados abertos.",
      status: "Arquivado",
      presentationDate: "2025-01-28",
    },
  ],
  "pol-sen-clara-monteiro": [
    {
      id: "prop-cm-1",
      code: "PLS 77/2024",
      title: "Marco da transparência das sessões",
      summary: "Exige publicação do placar nominal no mesmo dia da sessão deliberativa.",
      status: "Em Tramitação",
      presentationDate: "2024-06-02",
    },
  ],
  "pol-sen-paulo-nunes": [
    {
      id: "prop-pn-1",
      code: "PEC 12/2026",
      title: "Dados abertos de votações nominais",
      summary: "Torna obrigatória a publicação aberta do voto nominal em formato reutilizável.",
      status: "Em Discussão",
      presentationDate: "2026-08-12",
    },
  ],
  "pol-sen-helena-dias": [
    {
      id: "prop-hd-1",
      code: "PLS 201/2025",
      title: "Saúde da mulher no SUS",
      summary: "Amplia cobertura de exames preventivos e metas de tempo máximo de espera.",
      status: "Promulgado",
      presentationDate: "2025-03-03",
    },
  ],
  "pol-dep-joao-freitas": [
    {
      id: "prop-jf-1",
      code: "PL 1188/2025",
      title: "Crédito para agro familiar",
      summary: "Facilita linhas de crédito com rastreabilidade pública de destinação.",
      status: "Em Tramitação",
      presentationDate: "2025-07-14",
    },
  ],
};

const EXPENSES_BY_POLITICIAN: Readonly<Record<string, readonly ExpenseSummary[]>> = {
  "pol-dep-beatriz-rocha": [
    { category: "Cota parlamentar", totalAmount: 24120, month: 9, year: 2026 },
    { category: "Passagens aéreas", totalAmount: 8120, month: 9, year: 2026 },
  ],
  "pol-dep-alex-silva": [
    { category: "Cota parlamentar", totalAmount: 28450, month: 9, year: 2026 },
  ],
  "pol-dep-mariana-nunes": [
    { category: "Cota parlamentar", totalAmount: 19870, month: 9, year: 2026 },
    { category: "Divulgação da atividade parlamentar", totalAmount: 6400, month: 9, year: 2026 },
  ],
  "pol-dep-ricardo-mota": [
    { category: "Cota parlamentar", totalAmount: 22110, month: 9, year: 2026 },
  ],
  "pol-sen-clara-monteiro": [
    { category: "Cota para exercício da atividade", totalAmount: 15200, month: 9, year: 2026 },
  ],
  "pol-sen-paulo-nunes": [
    { category: "Cota para exercício da atividade", totalAmount: 17850, month: 9, year: 2026 },
  ],
  "pol-sen-helena-dias": [
    { category: "Cota para exercício da atividade", totalAmount: 16440, month: 9, year: 2026 },
    { category: "Passagens aéreas", totalAmount: 5230, month: 9, year: 2026 },
  ],
  "pol-dep-joao-freitas": [
    { category: "Cota parlamentar", totalAmount: 20990, month: 9, year: 2026 },
  ],
};

const VOTINGS_BY_POLITICIAN: Readonly<Record<string, readonly VotingRecord[]>> = {
  "pol-dep-beatriz-rocha": [
    {
      id: "vote-br-1",
      code: "PL 2150/2024",
      title: "Marco da transparência orçamentária",
      date: "2026-03-12",
      position: "A favor",
    },
    {
      id: "vote-br-2",
      code: "PEC 45/2023",
      title: "Reforma tributária — destaque",
      date: "2025-11-04",
      position: "A favor",
    },
  ],
  "pol-dep-alex-silva": [
    {
      id: "vote-as-1",
      code: "PL 890/2024",
      title: "Fiscalização de contratos de TI",
      date: "2025-06-18",
      position: "A favor",
    },
  ],
  "pol-dep-mariana-nunes": [
    {
      id: "vote-mn-1",
      code: "PL 1455/2024",
      title: "Educação digital nas escolas públicas",
      date: "2025-09-22",
      position: "A favor",
    },
    {
      id: "vote-mn-2",
      code: "MPV 1201/2025",
      title: "Ajuste fiscal emergencial",
      date: "2025-10-08",
      position: "Contra",
    },
  ],
  "pol-dep-ricardo-mota": [
    {
      id: "vote-rm-1",
      code: "PL 502/2025",
      title: "Segurança portuária",
      date: "2025-05-14",
      position: "Abstenção",
    },
  ],
  "pol-sen-clara-monteiro": [
    {
      id: "vote-cm-1",
      code: "PLS 77/2024",
      title: "Marco da transparência das sessões",
      date: "2025-12-01",
      position: "A favor",
    },
  ],
  "pol-sen-paulo-nunes": [
    {
      id: "vote-pn-1",
      code: "PEC 12/2026",
      title: "Dados abertos de votações nominais",
      date: "2026-09-03",
      position: "A favor",
    },
    {
      id: "vote-pn-2",
      code: "PLC 44/2025",
      title: "Limite de sigilo em contratos",
      date: "2026-02-19",
      position: "Ausente",
    },
  ],
  "pol-sen-helena-dias": [
    {
      id: "vote-hd-1",
      code: "PLS 201/2025",
      title: "Saúde da mulher no SUS",
      date: "2025-08-27",
      position: "A favor",
    },
  ],
  "pol-dep-joao-freitas": [
    {
      id: "vote-jf-1",
      code: "PL 1188/2025",
      title: "Crédito para agro familiar",
      date: "2026-01-15",
      position: "A favor",
    },
  ],
};

function fold(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("pt-BR");
}

function matchesQuery(politician: Politician, query: string): boolean {
  const needle = fold(query.trim());
  if (!needle) {
    return true;
  }

  return [politician.name, politician.civilName, politician.party, politician.state, politician.role].some(
    (field) => fold(field).includes(needle),
  );
}

function applyFilters(
  items: readonly Politician[],
  filters?: PoliticianFilters,
): Politician[] {
  if (!filters) {
    return [...items];
  }

  return items.filter((item) => {
    if (filters.party && item.party.toLocaleUpperCase("pt-BR") !== filters.party.toLocaleUpperCase("pt-BR")) {
      return false;
    }
    if (filters.state && item.state !== filters.state) {
      return false;
    }
    if (filters.role && item.role !== filters.role) {
      return false;
    }
    if (filters.query && !matchesQuery(item, filters.query)) {
      return false;
    }
    return true;
  });
}

/** List politicians with optional party / UF / role / text filters. */
export async function getPoliticians(filters?: PoliticianFilters): Promise<Politician[]> {
  return resolveAsync(applyFilters(resolvePoliticianCatalog(), filters));
}

/** Fetch a single politician by catalog id (or live open-data id when enabled). */
export async function getPoliticianById(id: string): Promise<Politician | null> {
  const match = resolvePoliticianCatalog().find((item) => item.id === id) ?? null;
  return resolveAsync(match);
}

/** Proposals authored in the illustrative catalog for a politician. */
export async function getPoliticianProposals(id: string): Promise<PoliticalProposal[]> {
  const rows = PROPOSALS_BY_POLITICIAN[id] ?? [];
  return resolveAsync([...rows]);
}

/** Monthly expense summaries (illustrative) for a politician. */
export async function getPoliticianExpenses(id: string): Promise<ExpenseSummary[]> {
  const rows = EXPENSES_BY_POLITICIAN[id] ?? [];
  return resolveAsync([...rows]);
}

/** Nominal voting history (illustrative) for a politician. */
export async function getPoliticianVotingHistory(id: string): Promise<VotingRecord[]> {
  const rows = VOTINGS_BY_POLITICIAN[id] ?? [];
  return resolveAsync([...rows]);
}

/** Distinct parties present in the mock roster (for filter UIs). */
export async function listPoliticianParties(): Promise<string[]> {
  const parties = [...new Set(POLITICIANS.map((item) => item.party))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
  return resolveAsync(parties);
}

/** Distinct UFs present in the mock roster. */
export async function listPoliticianStates(): Promise<BrazilianUF[]> {
  const states = [...new Set(POLITICIANS.map((item) => item.state))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  ) as BrazilianUF[];
  return resolveAsync(states);
}
