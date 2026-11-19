import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { IndicatorTrend, TransparencyIndicator } from "@/types/voting";

const TREND_LABEL: Record<IndicatorTrend, string> = {
  up: "Em alta",
  down: "Em baixa",
  stable: "Estável",
};

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) {
    return isoDate;
  }

  return `${day}/${month}/${year}`;
}

function formatScore(score: number, unit: string): string {
  const formatted = Number.isInteger(score)
    ? String(score)
    : score.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  return `${formatted}${unit ? ` ${unit}` : ""}`.trim();
}

function barPercent(score: number, unit: string): number {
  if (unit === "%") {
    return Math.min(100, Math.max(0, score));
  }
  if (unit === "dias") {
    return Math.min(100, Math.max(0, (score / 365) * 100));
  }
  if (unit === "pts") {
    return Math.min(100, Math.max(0, (score / 5) * 100));
  }
  return Math.min(100, Math.max(0, score));
}

function TrendIcon({ trend }: { trend: IndicatorTrend }) {
  if (trend === "up") {
    return <TrendingUp className="size-3.5" aria-hidden="true" />;
  }
  if (trend === "down") {
    return <TrendingDown className="size-3.5" aria-hidden="true" />;
  }
  return <Minus className="size-3.5" aria-hidden="true" />;
}

export interface IndicatorCardProps {
  indicator: TransparencyIndicator;
}

export function IndicatorCard({ indicator }: IndicatorCardProps) {
  const percent = barPercent(indicator.score, indicator.unit);

  return (
    <Card className="h-full border-border bg-card text-card-foreground shadow-sm">
      <CardHeader className="space-y-3 p-5 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="category">{indicator.category}</Badge>
          <Badge
            variant="outline"
            className={cn(
              "inline-flex items-center gap-1",
              indicator.trend === "up" && "text-success",
              indicator.trend === "down" && "text-destructive",
            )}
          >
            <TrendIcon trend={indicator.trend} />
            {TREND_LABEL[indicator.trend]}
          </Badge>
        </div>
        <CardTitle className="text-base font-semibold leading-snug text-foreground">
          {indicator.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-0">
        <p className="text-3xl font-bold tracking-tight text-foreground">
          {formatScore(indicator.score, indicator.unit)}
        </p>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
          role="meter"
          aria-label={`${indicator.title}: ${formatScore(indicator.score, indicator.unit)}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percent)}
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{indicator.description}</p>
        <time dateTime={indicator.updatedDate} className="block text-xs text-muted-foreground">
          Atualizado em {formatDate(indicator.updatedDate)}
        </time>
      </CardContent>
    </Card>
  );
}
