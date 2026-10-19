import { AlertTriangle } from "lucide-react";
import type { PriorityWeight } from "@/lib/search/catalog";
import { cn } from "@/lib/utils";

function clampWeight(value: number): PriorityWeight {
  const numeric = Math.trunc(Number(value));
  if (!Number.isFinite(numeric)) {
    return 1;
  }

  return Math.min(5, Math.max(1, numeric)) as PriorityWeight;
}

function priorityLabel(weight: PriorityWeight, audience: "parlamento" | "comunidade"): string {
  if (weight <= 2) {
    return audience === "parlamento"
      ? "Baixa prioridade no parlamento"
      : "Baixa prioridade para a comunidade";
  }

  if (weight === 3) {
    return audience === "parlamento"
      ? "Prioridade moderada no parlamento"
      : "Prioridade moderada para a comunidade";
  }

  return audience === "parlamento"
    ? "Alta prioridade no parlamento"
    : "Alta prioridade para a comunidade";
}

export function isHighDivergence(
  institutionalWeight: number,
  citizenWeight: number,
): boolean {
  return clampWeight(citizenWeight) >= 4 && clampWeight(institutionalWeight) <= 2;
}

function WeightMeter({
  label,
  weight,
  barClassName,
}: {
  label: string;
  weight: PriorityWeight;
  barClassName: string;
}) {
  const width = `${(weight / 5) * 100}%`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-xs tabular-nums text-muted-foreground">
          {weight}
          <span className="text-muted-foreground/80"> / 5</span>
        </p>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={weight}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div className={cn("h-full rounded-full", barClassName)} style={{ width }} />
      </div>
    </div>
  );
}

export function DivergenceAlert({
  institutionalWeight,
  citizenWeight,
}: {
  institutionalWeight: number;
  citizenWeight: number;
}) {
  if (!isHighDivergence(institutionalWeight, citizenWeight)) {
    return null;
  }

  return (
    <div
      role="status"
      className="rounded-lg border border-amber-400/60 bg-amber-50 px-3 py-2 text-amber-950"
    >
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold">
        <AlertTriangle className="size-3.5 shrink-0 text-orange-600" aria-hidden="true" />
        Alto Índice de Divergência
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-amber-900/90">
        A comunidade prioriza este tema, mas o parlamento ainda o trata com baixa urgência.
      </p>
    </div>
  );
}

export function PriorityBar({
  institutionalWeight,
  citizenWeight,
}: {
  institutionalWeight: number;
  citizenWeight: number;
}) {
  const institutional = clampWeight(institutionalWeight);
  const citizen = clampWeight(citizenWeight);

  return (
    <div className="space-y-3 rounded-lg border border-border/80 bg-muted/30 p-3">
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Índice de prioridade cruzada
      </p>
      <WeightMeter
        label="Peso Institucional"
        weight={institutional}
        barClassName="bg-slate-700"
      />
      <p className="text-[11px] text-muted-foreground">{priorityLabel(institutional, "parlamento")}</p>
      <WeightMeter
        label="Peso Cidadão"
        weight={citizen}
        barClassName="bg-emerald-600"
      />
      <p className="text-[11px] text-muted-foreground">{priorityLabel(citizen, "comunidade")}</p>
    </div>
  );
}
