/**
 * Legislative voting and transparency catalog models.
 * Distinct from search-catalog `VotingSearchItem` and politician `VotingRecord`.
 */

export type VoteChoice = "Yes" | "No" | "Abstain" | "Absent";

export type VotingOutcome = "Approved" | "Rejected" | "Pending";

export type VotingCategory =
  | "Economia"
  | "Saúde"
  | "Educação"
  | "Segurança"
  | "Meio Ambiente"
  | "Administração Pública";

/** Institutional urgency / citizen priority scale (1–5). */
export type PriorityWeight = 1 | 2 | 3 | 4 | 5;

export type IndicatorTrend = "up" | "down" | "stable";

export interface Voting {
  id: string;
  /** e.g. PL 1904/2024 */
  billCode: string;
  title: string;
  summary: string;
  /** One-sentence plain-language explanation for citizens */
  plainSummary: string;
  category: VotingCategory;
  voteDate: string;
  result: VotingOutcome;
  rapporteur: string;
  totalYes: number;
  totalNo: number;
  totalAbstain: number;
  institutionalUrgency: PriorityWeight;
  citizenPriority: PriorityWeight;
}

export interface IndividualVote {
  politicianId: string;
  politicianName: string;
  party: string;
  state: string;
  vote: VoteChoice;
}

export interface PartyVotingBreakdown {
  party: string;
  yesCount: number;
  noCount: number;
  abstainCount: number;
  /** Share of party members voting with the winning side, 0–100 */
  partyAlignmentPercentage: number;
}

export interface TransparencyIndicator {
  id: string;
  title: string;
  category: string;
  score: number;
  unit: string;
  trend: IndicatorTrend;
  description: string;
  updatedDate: string;
}

export interface VotingFilters {
  category?: VotingCategory;
  outcome?: VotingOutcome;
  query?: string;
}
