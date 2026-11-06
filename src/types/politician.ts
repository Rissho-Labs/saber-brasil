/**
 * UI / catalog models for politician profiles.
 * Distinct from `PublicProfile` (Supabase `public_profiles` schema).
 */

/** Brazilian federation units (UF). */
export type BrazilianUF =
  | "AC"
  | "AL"
  | "AP"
  | "AM"
  | "BA"
  | "CE"
  | "DF"
  | "ES"
  | "GO"
  | "MA"
  | "MT"
  | "MS"
  | "MG"
  | "PA"
  | "PB"
  | "PR"
  | "PE"
  | "PI"
  | "RJ"
  | "RN"
  | "RS"
  | "RO"
  | "RR"
  | "SC"
  | "SP"
  | "SE"
  | "TO";

export type PoliticianRole = "deputado" | "senador";

export type ProposalStatus =
  | "Em Tramitação"
  | "Aprovado"
  | "Arquivado"
  | "Em Discussão"
  | "Promulgado";

export interface PoliticianMetrics {
  /** Plenary attendance rate 0–100 */
  presenceRate: number;
  /** Authored / co-authored proposals count */
  proposalsCount: number;
  /** Alignment with party leadership votes 0–100 */
  votingAlignmentPercentage: number;
}

export interface Politician {
  id: string;
  name: string;
  civilName: string;
  party: string;
  state: BrazilianUF;
  role: PoliticianRole;
  photoUrl: string | null;
  email: string;
  phone: string;
  metrics: PoliticianMetrics;
}

export interface PoliticalProposal {
  id: string;
  code: string;
  title: string;
  summary: string;
  status: ProposalStatus;
  /** ISO date YYYY-MM-DD */
  presentationDate: string;
}

export interface ExpenseSummary {
  category: string;
  totalAmount: number;
  month: number;
  year: number;
}

export type VotingPosition = "A favor" | "Contra" | "Abstenção" | "Ausente";

/** Illustrative nominal vote on a bill or PEC. */
export interface VotingRecord {
  id: string;
  code: string;
  title: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  position: VotingPosition;
}

export interface PoliticianFilters {
  query?: string;
  party?: string;
  state?: BrazilianUF;
  role?: PoliticianRole;
}
