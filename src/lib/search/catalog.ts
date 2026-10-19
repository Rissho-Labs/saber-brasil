import { SphereType } from "@/types";

export const VOTING_STATUSES = [
  "Em Pauta",
  "Em Discussão",
  "Em Votação",
  "Aprovadas",
  "Revogadas",
] as const;

export type VotingStatus = (typeof VOTING_STATUSES)[number];

export const LEGISLATIVE_STAGES = [
  "Apresentação / Comissão",
  "Em Discussão no Plenário",
  "Em Votação",
  "Sanção / Promulgação / Vetado",
] as const;

export type LegislativeStage = 1 | 2 | 3 | 4;

export interface VoteTally {
  favor: number;
  against: number;
  abstentions: number;
}

export const CAST_VOTES = ["A favor", "Contra", "Abstenção"] as const;

export type CastVote = (typeof CAST_VOTES)[number];

export interface VotingParticipant {
  profileId: string;
  name: string;
  vote: CastVote;
}

export interface ProfileVotingPosition {
  id: string;
  code: string;
  title: string;
  date: string;
  vote: CastVote;
}

export type PriorityWeight = 1 | 2 | 3 | 4 | 5;

export interface VotingSearchItem {
  id: string;
  code: string;
  title: string;
  description: string;
  status: VotingStatus;
  date: string;
  author: string;
  sphere: SphereType;
  currentStage: LegislativeStage;
  stageDates: readonly [string | null, string | null, string | null, string | null];
  votes: VoteTally | null;
  participants: readonly VotingParticipant[];
  sessionUrl: string;
  sessionHouse: "TV Câmara" | "TV Senado";
  /** Illustrative parliament priority (1–5). Optional until live sources exist. */
  institutionalWeight?: PriorityWeight;
  /** Illustrative community priority (1–5). Optional until live sources exist. */
  citizenWeight?: PriorityWeight;
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

const TV_CAMARA = "https://www.camara.leg.br/tv";
const TV_SENADO = "https://www.senado.leg.br/tv";

const MARIANA: Omit<VotingParticipant, "vote"> = {
  profileId: "11111111-1111-1111-1111-111111111111",
  name: "Mariana Silva",
};
const CARLOS: Omit<VotingParticipant, "vote"> = {
  profileId: "22222222-2222-2222-2222-222222222222",
  name: "Carlos Eduardo",
};
const ANA: Omit<VotingParticipant, "vote"> = {
  profileId: "33333333-3333-3333-3333-333333333333",
  name: "Ana Beatriz",
};

function participant(person: Omit<VotingParticipant, "vote">, vote: CastVote): VotingParticipant {
  return { ...person, vote };
}

const VOTINGS: readonly VotingSearchItem[] = [
  {
    id: "voting-pl-1234-2026",
    code: "PL 1234/2026",
    title: "Reforma tributária nos serviços",
    description: "Altera a tributação de serviços e define a regra de transição.",
    status: "Em Pauta",
    date: "2026-10-08",
    author: "Dep. Ana Lima",
    sphere: SphereType.POLITICA,
    currentStage: 1,
    stageDates: ["2026-10-08", null, null, null],
    votes: null,
    participants: [],
    sessionUrl: TV_CAMARA,
    sessionHouse: "TV Câmara",
    institutionalWeight: 2,
    citizenWeight: 5,
  },
  {
    id: "voting-pec-12-2026",
    code: "PEC 12/2026",
    title: "Dados abertos de votações nominais",
    description: "Torna obrigatória a publicação aberta do voto nominal.",
    status: "Em Discussão",
    date: "2026-09-18",
    author: "Sen. Paulo Nunes",
    sphere: SphereType.POLITICA,
    currentStage: 2,
    stageDates: ["2026-08-12", "2026-09-18", null, null],
    votes: null,
    participants: [],
    sessionUrl: TV_SENADO,
    sessionHouse: "TV Senado",
    institutionalWeight: 4,
    citizenWeight: 4,
  },
  {
    id: "voting-pec-3-2026",
    code: "PEC 3/2026",
    title: "Marco da transparência das sessões",
    description: "Exige a publicação do placar nominal no mesmo dia da sessão.",
    status: "Em Votação",
    date: "2026-10-15",
    author: "Sen. Clara Monteiro",
    sphere: SphereType.POLITICA,
    currentStage: 3,
    stageDates: ["2026-06-02", "2026-08-19", "2026-10-15", null],
    votes: { favor: 46, against: 22, abstentions: 5 },
    participants: [
      participant(CARLOS, "A favor"),
      participant(MARIANA, "Contra"),
      participant(ANA, "Abstenção"),
    ],
    sessionUrl: TV_SENADO,
    sessionHouse: "TV Senado",
    institutionalWeight: 3,
    citizenWeight: 3,
  },
  {
    id: "voting-pec-45-2025",
    code: "PEC 45/2025",
    title: "Incentivos para energias renováveis",
    description: "Inclui incentivos para geração renovável no texto constitucional.",
    status: "Aprovadas",
    date: "2026-10-07",
    author: "Dep. Carlos Mendes",
    sphere: SphereType.POLITICA,
    currentStage: 4,
    stageDates: ["2026-03-11", "2026-06-20", "2026-09-02", "2026-10-07"],
    votes: { favor: 312, against: 148, abstentions: 17 },
    participants: [
      participant(MARIANA, "A favor"),
      participant(ANA, "A favor"),
      participant(CARLOS, "Contra"),
    ],
    sessionUrl: TV_CAMARA,
    sessionHouse: "TV Câmara",
    institutionalWeight: 5,
    citizenWeight: 2,
  },
  {
    id: "voting-pl-88-2024",
    code: "PL 88/2024",
    title: "Revogação do sigilo de relatórios de comissão",
    description: "Revoga a regra que adiava a publicação dos relatórios de comissão.",
    status: "Revogadas",
    date: "2026-05-21",
    author: "Dep. Rita Gomes",
    sphere: SphereType.POLITICA,
    currentStage: 4,
    stageDates: ["2025-11-04", "2026-02-16", "2026-04-09", "2026-05-21"],
    votes: { favor: 98, against: 241, abstentions: 11 },
    participants: [
      participant(ANA, "A favor"),
      participant(CARLOS, "Contra"),
      participant(MARIANA, "Abstenção"),
    ],
    sessionUrl: TV_CAMARA,
    sessionHouse: "TV Câmara",
    institutionalWeight: 1,
    citizenWeight: 4,
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
    matches(query, [item.code, item.title, item.description, item.status, item.author]),
  );
}

export function votingsForProfile(profileId: string): ProfileVotingPosition[] {
  return VOTINGS.flatMap((item) => {
    const participant = item.participants.find((person) => person.profileId === profileId);
    if (!participant) {
      return [];
    }

    return [
      {
        id: item.id,
        code: item.code,
        title: item.title,
        date: item.date,
        vote: participant.vote,
      },
    ];
  }).sort((left, right) => right.date.localeCompare(left.date));
}

export function filterVotingsByStatus(status: VotingStatus | undefined): VotingSearchItem[] {
  if (!status) {
    return [...VOTINGS];
  }

  return VOTINGS.filter((item) => item.status === status);
}

export function searchPublications(query: string): PublicationSearchItem[] {
  return PUBLICATIONS.filter((item) =>
    matches(query, [item.title, item.summary, item.category]),
  );
}
