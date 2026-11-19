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

/** Official digital presence platforms (illustrative catalog). */
export type DigitalChannelPlatform =
  | "instagram"
  | "x"
  | "youtube"
  | "facebook"
  | "tiktok"
  | "spotify"
  | "podcast"
  | "website"
  | "official_portal";

export interface DigitalChannel {
  platform: DigitalChannelPlatform;
  /** e.g. Instagram Oficial, Canal no YouTube, Portal da Câmara */
  label: string;
  /** Optional public handle, e.g. @parlamentar */
  handle?: string;
  url: string;
  verified: boolean;
}

export type ProfileSourceOrigin = "catalog" | "supabase";

/**
 * Normalized profile for UI surfaces that may resolve either the mock catalog
 * or a Supabase `public_profiles` row. Does not invent columns absent from either source.
 */
export interface UnifiedProfileView {
  id: string;
  name: string;
  civilName: string | null;
  party: string | null;
  state: BrazilianUF | null;
  role: PoliticianRole | null;
  currentRole: string | null;
  photoUrl: string | null;
  email: string | null;
  phone: string | null;
  biographySummary: string | null;
  digitalChannels: DigitalChannel[];
  metrics: PoliticianMetrics | null;
  source: ProfileSourceOrigin;
  catalogId: string | null;
  supabaseId: string | null;
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
  /** Official / institutional digital channels when known */
  digitalChannels?: DigitalChannel[];
  /** Plain-language 1–2 sentence factual bio */
  biographySummary?: string;
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
