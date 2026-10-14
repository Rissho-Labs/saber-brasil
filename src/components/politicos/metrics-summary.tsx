import { DualScoreGraphic } from "@/components/ui/dual-score-graphic";

interface MetricsSummaryProps {
  carismaRating: number;
  gestaoScore: number;
}

export function MetricsSummary({ carismaRating, gestaoScore }: MetricsSummaryProps) {
  return (
    <DualScoreGraphic
      carisma_rating={carismaRating}
      gestao_score={gestaoScore}
    />
  );
}
