import { z } from "zod";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

export const politicalEvaluationSchema = z.object({
  profileId: z.string().regex(UUID_PATTERN),
  scores: z.object({
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
  }),
  turnstileToken: z.string().trim().min(1).max(2048).nullable().optional(),
});

export type PoliticalEvaluation = z.infer<typeof politicalEvaluationSchema>;
