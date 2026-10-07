/**
 * Domain types mirroring ARCHITECTURE.md PostgreSQL schema.
 * Zero `any` — enums align with sphere_type, profile_status, alert_badge.
 */

/** PostgreSQL: sphere_type */
export enum SphereType {
  POLITICA = "POLITICA",
  JUDICIARIO = "JUDICIARIO",
  ACADEMIA = "ACADEMIA",
  SEGURANCA = "SEGURANCA",
}

/** PostgreSQL: profile_status */
export enum ProfileStatus {
  ATIVO = "ATIVO",
  CANDIDATO = "CANDIDATO",
  INATIVO = "INATIVO",
  ENCERRADO = "ENCERRADO",
}

/** PostgreSQL: alert_badge */
export enum AlertBadge {
  NENHUM = "NENHUM",
  INVESTIGADO = "INVESTIGADO",
  CASSADO = "CASSADO",
  CONDENADO = "CONDENADO",
}

/** UUID string (gen_random_uuid / Auth user id). */
export type UUID = string;

/**
 * Subjective star score (1.0–5.0), including half-steps.
 * Matches Avaliação Subjetiva in ARCHITECTURE.md §3.1.
 */
export type StarScore = 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

/**
 * Institutional / citizen weight (CHECK BETWEEN 1 AND 5).
 */
export type WeightScore = 1 | 2 | 3 | 4 | 5;

/**
 * Ten competency criteria for the questionnaire (JSONB `scores`).
 * Covers posture, decorum, discursive coherence, articulation, and related axes.
 */
export enum CompetencyCriterion {
  POSTURE = "posture",
  DECORUM = "decorum",
  DISCURSIVE_COHERENCE = "discursive_coherence",
  ARTICULATION = "articulation",
  TRANSPARENCY = "transparency",
  ACCOUNTABILITY = "accountability",
  RESPONSIVENESS = "responsiveness",
  ETHICAL_CONDUCT = "ethical_conduct",
  PUBLIC_COMMUNICATION = "public_communication",
  INSTITUTIONAL_COMMITMENT = "institutional_commitment",
}

/** Exactly 10 competency scores keyed by CompetencyCriterion. */
export type CompetencyScores = {
  readonly [K in CompetencyCriterion]: StarScore;
};

/** public_profiles */
export interface PublicProfile {
  id: UUID;
  name: string;
  sphere: SphereType;
  current_role: string | null;
  status: ProfileStatus;
  badge: AlertBadge;
  /** DECIMAL(3,2) — subjective/charisma aggregate 0.00–5.00 */
  carisma_rating: number;
  /** Weighted Management Index 0–100 */
  gestao_score: number;
  created_at: string;
}

/** public_projects */
export interface PublicProject {
  id: UUID;
  profile_id: UUID | null;
  title: string;
  description: string | null;
  institutional_weight: WeightScore | null;
  citizen_weight: WeightScore | null;
  status: string | null;
  source_url: string;
}

/** user_evaluations */
export interface UserEvaluation {
  id: UUID;
  user_id: UUID;
  profile_id: UUID | null;
  scores: CompetencyScores;
  updated_at: string;
}

/** Insert payloads (DB defaults omitted where applicable). */
export type PublicProfileInsert = Omit<
  PublicProfile,
  "id" | "status" | "badge" | "carisma_rating" | "gestao_score" | "created_at"
> & {
  id?: UUID;
  status?: ProfileStatus;
  badge?: AlertBadge;
  carisma_rating?: number;
  gestao_score?: number;
  created_at?: string;
};

export type PublicProjectInsert = Omit<PublicProject, "id"> & {
  id?: UUID;
};

export type UserEvaluationInsert = Omit<UserEvaluation, "id" | "updated_at"> & {
  id?: UUID;
  updated_at?: string;
};
