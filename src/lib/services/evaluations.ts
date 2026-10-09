import { UserEvaluationInsert, CompetencyScores } from "@/types";

export async function saveUserEvaluation(
  profileId: string,
  scores: CompetencyScores
): Promise<{ success: boolean; message: string }> {
  // Simulação de persistência (futuro INSERT no Supabase)
  const evaluationPayload: UserEvaluationInsert = {
    profile_id: profileId,
    user_id: "user-anonymous-1", // Substituir por auth context futuramente
    scores,
  };

  console.log("[Service: Evaluation] Gravando avaliação:", evaluationPayload);

  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    success: true,
    message: "Avaliação registrada com sucesso!",
  };
}