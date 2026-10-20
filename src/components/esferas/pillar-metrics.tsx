import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PillarMetric } from "@/lib/esferas/catalog";
import { cn } from "@/lib/utils";

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

function formatChange(percent: number): string {
  const rounded = Math.round(percent);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

function SparklineChart({
  points,
  decreasing,
}: {
  points: readonly number[];
  decreasing: boolean;
}) {
  const width = 160;
  const height = 48;
  const pad = 4;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;

  const coords = points.map((value, index) => {
    const x = pad + (index / Math.max(points.length - 1, 1)) * (width - pad * 2);
    const y = height - pad - ((value - min) / span) * (height - pad * 2);
    return `${x},${y}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-12 w-full max-w-[11rem]"
      role="img"
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords.join(" ")}
        className={decreasing ? "text-emerald-600" : "text-amber-600"}
      />
    </svg>
  );
}

function MiniScoreArc({
  score,
  max,
  gradientId,
}: {
  score: number;
  max: number;
  gradientId: string;
}) {
  const ratio = clamp(score / max, 0, 1);
  const radius = 36;
  const centerX = 48;
  const centerY = 48;
  const circumference = Math.PI * radius;
  const progress = ratio * circumference;
  const display =
    max === 5 ? score.toFixed(1) : String(Math.round(clamp(score, 0, max)));

  return (
    <svg
      viewBox="0 0 96 58"
      className="h-auto w-full max-w-[7.5rem]"
      role="img"
      aria-label={`Pontuação ${display} de ${max}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <path
        d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        className="text-muted"
      />
      <path
        d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference}`}
      />
      <text
        x={centerX}
        y={centerY - 6}
        textAnchor="middle"
        className="fill-foreground text-[1.1rem] font-bold"
      >
        {display}
      </text>
      <text
        x={centerX}
        y={centerY + 8}
        textAnchor="middle"
        className="fill-muted-foreground text-[0.55rem]"
      >
        / {max === 5 ? "5.0" : max}
      </text>
    </svg>
  );
}

function AllocationBar({ percent, amountLabel }: { percent: number; amountLabel: string }) {
  const width = `${clamp(percent, 0, 100)}%`;

  return (
    <div className="space-y-2">
      <p className="text-2xl font-bold tracking-tight">{amountLabel}</p>
      <div
        role="meter"
        aria-label="Alocação orçamentária"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamp(percent, 0, 100))}
        className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div className="h-full rounded-full bg-emerald-600" style={{ width }} />
      </div>
      <p className="text-xs text-muted-foreground">{Math.round(clamp(percent, 0, 100))}% do ciclo ilustrativo</p>
    </div>
  );
}

function PillarCard({ metric }: { metric: PillarMetric }) {
  const change = metric.changePercent ?? 0;
  const decreasing = change <= 0;

  return (
    <Card className="h-full border-border/80">
      <CardHeader className="gap-1 p-4 pb-2">
        <CardTitle className="text-sm font-semibold leading-snug">{metric.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        {metric.kind === "sparkline" && metric.points && metric.points.length > 1 ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <SparklineChart points={metric.points} decreasing={decreasing} />
            <span
              className={cn(
                "inline-flex w-fit rounded-md border px-2 py-1 text-xs font-semibold",
                decreasing
                  ? "border-emerald-600/30 bg-emerald-50 text-emerald-800"
                  : "border-amber-500/40 bg-amber-50 text-amber-950",
              )}
            >
              {formatChange(change)} {metric.changeCaption ?? ""}
            </span>
          </div>
        ) : null}

        {metric.kind === "allocation" && metric.amountLabel !== undefined ? (
          <AllocationBar
            percent={metric.allocationPercent ?? 0}
            amountLabel={metric.amountLabel}
          />
        ) : null}

        {(metric.kind === "gauge" || metric.kind === "rating") &&
        metric.score !== undefined &&
        metric.scoreMax !== undefined ? (
          <div className="flex items-center gap-3">
            <MiniScoreArc
              score={metric.score}
              max={metric.scoreMax}
              gradientId={`pillar-arc-${metric.id}`}
            />
            <p className="text-sm font-semibold tabular-nums">
              {metric.scoreMax === 5
                ? `${metric.score.toFixed(1)}/${metric.scoreMax.toFixed(1)}`
                : `${Math.round(metric.score)}/${metric.scoreMax}`}
            </p>
          </div>
        ) : null}

        {metric.caption ? (
          <p className="text-xs leading-relaxed text-muted-foreground">{metric.caption}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function PillarMetrics({ pillars }: { pillars: readonly PillarMetric[] }) {
  if (pillars.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="esfera-pilares" className="space-y-4">
      <div className="space-y-1">
        <h2 id="esfera-pilares" className="text-xl font-semibold tracking-tight">
          Métricas-pilar do domínio
        </h2>
        <p className="text-sm text-muted-foreground">
          Painéis ilustrativos de tendência, alocação e índices. Não são leituras oficiais ao vivo.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((metric) => (
          <li key={metric.id}>
            <PillarCard metric={metric} />
          </li>
        ))}
      </ul>
    </section>
  );
}
