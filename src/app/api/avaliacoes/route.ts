import { NextResponse } from "next/server";
import { requestClientIp, verifyTurnstileToken } from "@/lib/auth/verify-turnstile";
import { requireAuthSession, UnauthorizedError } from "@/lib/auth/session-guard";
import { createClient } from "@/lib/supabase/server";
import { saveUserEvaluation } from "@/lib/services/evaluations";
import { politicalEvaluationSchema, type PoliticalEvaluation } from "@/schemas/politicalEvaluation.schema";
import { CompetencyScores } from "@/types";

function toCompetencyScores(scores: PoliticalEvaluation["scores"]): CompetencyScores {
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

    const parsed = politicalEvaluationSchema.safeParse(json);
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

    try {
      const { error: scoreError } = await supabase.rpc("recalculate_profile_scores", {
        target_profile_id: parsed.data.profileId,
      });
      if (scoreError) {
        console.error("recalculate_profile_scores failed", {
          profileId: parsed.data.profileId,
          code: scoreError.code,
          message: scoreError.message,
        });
      }
    } catch (scoreError) {
      console.error("recalculate_profile_scores failed", {
        profileId: parsed.data.profileId,
        message: scoreError instanceof Error ? scoreError.message : "unknown",
      });
    }

    return NextResponse.json(result, { status: result.updated ? 200 : 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar avaliação." },
      { status: 500 }
    );
  }
}
