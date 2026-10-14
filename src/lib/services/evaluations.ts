import type { SupabaseClient } from "@supabase/supabase-js";
import { CompetencyScores, UserEvaluationInsert } from "@/types";

export interface SaveEvaluationResult {
  success: true;
  updated: boolean;
  message: string;
  evaluation: UserEvaluationInsert;
}

export async function saveUserEvaluation(
  supabase: SupabaseClient,
  userId: string,
  profileId: string,
  scores: CompetencyScores
): Promise<SaveEvaluationResult> {
  const evaluation: UserEvaluationInsert = {
    user_id: userId,
    profile_id: profileId,
    scores,
    updated_at: new Date().toISOString(),
  };

  const { data: existing, error: lookupError } = await supabase
    .from("user_evaluations")
    .select("id")
    .eq("user_id", userId)
    .eq("profile_id", profileId)
    .maybeSingle();

  if (lookupError) {
    throw new Error(lookupError.message);
  }

  if (existing) {
    const { error } = await supabase
      .from("user_evaluations")
      .update({
        scores: evaluation.scores,
        updated_at: evaluation.updated_at,
      })
      .eq("user_id", userId)
      .eq("profile_id", profileId);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      updated: true,
      message: "Avaliação atualizada.",
      evaluation,
    };
  }

  const { error } = await supabase.from("user_evaluations").insert({
    user_id: evaluation.user_id,
    profile_id: evaluation.profile_id,
    scores: evaluation.scores,
    updated_at: evaluation.updated_at,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    updated: false,
    message: "Avaliação registrada com sucesso.",
    evaluation,
  };
}
