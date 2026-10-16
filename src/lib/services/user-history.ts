import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { CompetencyCriterion, CompetencyScores, SphereType } from "@/types";

const STAR_SCORES = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;

const starScoreSchema = z.union([
  z.literal(STAR_SCORES[0]),
  z.literal(STAR_SCORES[1]),
  z.literal(STAR_SCORES[2]),
  z.literal(STAR_SCORES[3]),
  z.literal(STAR_SCORES[4]),
  z.literal(STAR_SCORES[5]),
  z.literal(STAR_SCORES[6]),
  z.literal(STAR_SCORES[7]),
  z.literal(STAR_SCORES[8]),
]);

const scoresSchema = z.object({
  posture: starScoreSchema,
  decorum: starScoreSchema,
  discursive_coherence: starScoreSchema,
  articulation: starScoreSchema,
  transparency: starScoreSchema,
  accountability: starScoreSchema,
  responsiveness: starScoreSchema,
  ethical_conduct: starScoreSchema,
  public_communication: starScoreSchema,
  institutional_commitment: starScoreSchema,
});

const evaluationRowSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
  profile_id: z
    .string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    .nullable(),
  scores: scoresSchema,
  updated_at: z.string().min(1),
});

const profileRowSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
  name: z.string().min(1),
  sphere: z.enum(SphereType),
  current_role: z.string().nullable(),
});

export interface UserEvaluationHistoryItem {
  id: string;
  profileId: string | null;
  name: string;
  sphere: SphereType | null;
  role: string | null;
  scores: CompetencyScores;
  updatedAt: string;
  carisma: number;
}

function toScores(scores: z.infer<typeof scoresSchema>): CompetencyScores {
  return {
    [CompetencyCriterion.POSTURE]: scores.posture,
    [CompetencyCriterion.DECORUM]: scores.decorum,
    [CompetencyCriterion.DISCURSIVE_COHERENCE]: scores.discursive_coherence,
    [CompetencyCriterion.ARTICULATION]: scores.articulation,
    [CompetencyCriterion.TRANSPARENCY]: scores.transparency,
    [CompetencyCriterion.ACCOUNTABILITY]: scores.accountability,
    [CompetencyCriterion.RESPONSIVENESS]: scores.responsiveness,
    [CompetencyCriterion.ETHICAL_CONDUCT]: scores.ethical_conduct,
    [CompetencyCriterion.PUBLIC_COMMUNICATION]: scores.public_communication,
    [CompetencyCriterion.INSTITUTIONAL_COMMITMENT]: scores.institutional_commitment,
  };
}

function averageCarisma(scores: CompetencyScores): number {
  const values = Object.values(scores);
  const total = values.reduce((sum, score) => sum + score, 0);
  return Math.round((total / values.length) * 10) / 10;
}

function parseRows<T>(rows: unknown, schema: z.ZodType<T>): T[] {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.flatMap((row) => {
    const parsed = schema.safeParse(row);
    return parsed.success ? [parsed.data] : [];
  });
}

export async function getUserEvaluationHistory(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserEvaluationHistoryItem[]> {
  const { data, error } = await supabase
    .from("user_evaluations")
    .select("id, profile_id, scores, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const evaluations = parseRows(data, evaluationRowSchema);
  const profileIds = evaluations.flatMap((row) => (row.profile_id ? [row.profile_id] : []));
  const profiles = new Map<string, z.infer<typeof profileRowSchema>>();

  if (profileIds.length > 0) {
    const { data: profileData, error: profileError } = await supabase
      .from("public_profiles")
      .select("id, name, sphere, current_role")
      .in("id", profileIds);

    if (profileError) {
      throw new Error(profileError.message);
    }

    for (const profile of parseRows(profileData, profileRowSchema)) {
      profiles.set(profile.id, profile);
    }
  }

  return evaluations.map((row) => {
    const scores = toScores(row.scores);
    const profile = row.profile_id ? profiles.get(row.profile_id) : undefined;
    return {
      id: row.id,
      profileId: row.profile_id,
      name: profile?.name ?? "Representante indisponível",
      sphere: profile?.sphere ?? null,
      role: profile?.current_role ?? null,
      scores,
      updatedAt: row.updated_at,
      carisma: averageCarisma(scores),
    };
  });
}
