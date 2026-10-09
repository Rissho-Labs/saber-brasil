"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CompetencyCriterion, StarScore, CompetencyScores } from "@/types";

const criteriaLabels: Record<CompetencyCriterion, { label: string; desc: string }> = {
  [CompetencyCriterion.POSTURE]: { label: "Postura", desc: "Comportamento e serenidade nas sessões" },
  [CompetencyCriterion.DECORUM]: { label: "Decoro", desc: "Respeito ao regimento e aos pares" },
  [CompetencyCriterion.DISCURSIVE_COHERENCE]: { label: "Coerência Discursiva", desc: "Alinhamento entre fala e voto" },
  [CompetencyCriterion.ARTICULATION]: { label: "Articulação Política", desc: "Capacidade de diálogo e alianças" },
  [CompetencyCriterion.TRANSPARENCY]: { label: "Transparência", desc: "Clareza na prestação de contas" },
  [CompetencyCriterion.ACCOUNTABILITY]: { label: "Accountability", desc: "Responsabilidade com seus atos" },
  [CompetencyCriterion.RESPONSIVENESS]: { label: "Responsividade", desc: "Atenção às demandas da população" },
  [CompetencyCriterion.ETHICAL_CONDUCT]: { label: "Conduta Ética", desc: "Integridade na vida pública" },
  [CompetencyCriterion.PUBLIC_COMMUNICATION]: { label: "Comunicação Pública", desc: "Qualidade na prestação de informação" },
  [CompetencyCriterion.INSTITUTIONAL_COMMITMENT]: { label: "Compromisso Institucional", desc: "Defesa das instituições e da democracia" },
};

export function EvaluationForm({ profileId }: { profileId: string }) {
  const [scores, setScores] = useState<Partial<CompetencyScores>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleScoreChange = (criterion: CompetencyCriterion, score: StarScore) => {
    setScores((prev) => ({ ...prev, [criterion]: score }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/avaliacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, scores }),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback("✅ " + data.message);
      } else {
        setFeedback("❌ " + (data.error || "Erro ao salvar avaliação."));
      }
    } catch {
      setFeedback("❌ Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Avaliação Cidadã (10 Critérios)</CardTitle>
        <CardDescription>
          Avalie o representante com notas de 1 a 5 em cada eixo de competência.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(criteriaLabels).map(([key, { label, desc }]) => {
              const criterionKey = key as CompetencyCriterion;
              const currentScore = scores[criterionKey] || 0;

              return (
                <div key={key} className="p-3 border rounded-lg bg-muted/20 space-y-2">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <div className="flex gap-1 pt-1">
                    {([1, 2, 3, 4, 5] as StarScore[]).map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleScoreChange(criterionKey, star)}
                        className={`size-7 rounded text-xs font-semibold border transition-colors ${
                          currentScore >= star
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-background border-input hover:bg-muted"
                        }`}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {feedback && (
            <p className="text-sm font-medium pt-2">{feedback}</p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Enviando..." : "Salvar Avaliação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}