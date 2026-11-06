import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PoliticianMetrics } from "@/types/politician";

/** Cap proposal volume into a 0–100 legislative activity score (illustrative). */
export function legislativeActivityScore(proposalsCount: number): number {
  return Math.min(100, Math.max(0, Math.round((proposalsCount / 60) * 100)));
}

function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export interface PoliticianStatsProps {
  metrics: PoliticianMetrics;
}

export function PoliticianStats({ metrics }: PoliticianStatsProps) {
  const activity = legislativeActivityScore(metrics.proposalsCount);

  const items = [
    {
      id: "presence",
      label: "Presença em plenário",
      value: formatPercent(metrics.presenceRate),
      hint: "Taxa ilustrativa de comparecimento",
    },
    {
      id: "activity",
      label: "Atividade legislativa",
      value: String(activity),
      hint: `${metrics.proposalsCount} propostas no catálogo (índice 0–100)`,
    },
    {
      id: "alignment",
      label: "Alinhamento partidário",
      value: formatPercent(metrics.votingAlignmentPercentage),
      hint: "Concordância ilustrativa com a liderança",
    },
  ] as const;

  return (
    <section aria-labelledby="politician-stats-heading" className="space-y-3">
      <h2 id="politician-stats-heading" className="text-lg font-semibold tracking-tight">
        Indicadores
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-3xl font-bold tabular-nums tracking-tight">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
