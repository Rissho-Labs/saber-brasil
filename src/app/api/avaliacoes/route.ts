import { NextResponse } from "next/server";
import { z } from "zod";
import { requestClientIp, verifyTurnstileToken } from "@/lib/auth/verify-turnstile";
import { requireAuthSession, UnauthorizedError } from "@/lib/auth/session-guard";
import { createClient } from "@/lib/supabase/server";
import { saveUserEvaluation } from "@/lib/services/evaluations";
import { CompetencyScores } from "@/types";

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

const evaluationBodySchema = z.object({
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

function toCompetencyScores(
  scores: z.infer<typeof evaluationBodySchema>["scores"]
): CompetencyScores {
  const mapped: CompetencyScores = {
    posture: scores.posture,
    decorum: scores.decorum,
    discursive_coherence: scores.discursive_coherence,
    articulation: scores.articulation,
    transparency: scores.transparency,
    accountability: scores.accountability,
    responsiveness: scores.responsiveness,
    ethical_conduct: scores.ethical_conduct,
    public_communication: scores.public_communication,
    institutional_commitment: scores.institutional_commitment,
  };
  return mapped;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    let auth;
    try {
      auth = requireAuthSession(error ? null : data);
    } catch (guardError) {
      if (guardError instanceof UnauthorizedError) {
        return NextResponse.json({ error: "Autenticação obrigatória." }, { status: 401 });
      }
      throw guardError;
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "Corpo JSON inválido." }, { status: 400 });
    }

    const parsed = evaluationBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Informe profileId e as 10 notas válidas." },
        { status: 400 }
      );
    }

    const turnstile = await verifyTurnstileToken(
      parsed.data.turnstileToken ?? null,
      requestClientIp(request),
    );
    if (!turnstile.ok) {
      return NextResponse.json({ error: turnstile.error }, { status: 400 });
    }

    const result = await saveUserEvaluation(
      supabase,
      auth.userId,
      parsed.data.profileId,
      toCompetencyScores(parsed.data.scores)
    );

    return NextResponse.json(result, { status: result.updated ? 200 : 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar avaliação." },
      { status: 500 }
    );
  }
}
