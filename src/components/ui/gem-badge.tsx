import { useId } from "react";
import { cn } from "@/lib/utils";
import { GemTier, WeightScore } from "@/types";

const GEM_META: Record<
  GemTier,
  { label: string; criteria: string; className: string }
> = {
  [GemTier.DIAMOND]: {
    label: "Diamante",
    criteria: "Nível Master. Pauta entre as de maior relevância real de execução.",
    className: "border-cyan-300 bg-cyan-50 text-cyan-900",
  },
  [GemTier.PLATINUM]: {
    label: "Platina",
    criteria: "Relevância alta de execução entre as pautas mais ativas.",
    className: "border-slate-400 bg-slate-100 text-slate-700",
  },
  [GemTier.GOLD]: {
    label: "Ouro",
    criteria: "Relevância consistente de execução.",
    className: "border-amber-400 bg-amber-50 text-amber-900",
  },
  [GemTier.SILVER]: {
    label: "Prata",
    criteria: "Relevância intermediária de execução.",
    className: "border-zinc-300 bg-zinc-100 text-zinc-700",
  },
  [GemTier.BRONZE]: {
    label: "Bronze",
    criteria: "Relevância inicial entre as pautas acompanhadas.",
    className: "border-orange-800/40 bg-orange-100 text-orange-950",
  },
};

function GemIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" aria-hidden="true">
      <path d="M12 2.5 19.5 9.2 12 21.5 4.5 9.2 12 2.5Z" fill="currentColor" />
      <path d="M12 2.5 8.2 9.2h7.6L12 2.5Z" fill="white" opacity="0.55" />
    </svg>
  );
}

interface GemBadgeProps {
  tier: GemTier;
  criteria?: string;
}

export function gemTierFromGestaoScore(score: number): GemTier {
  const value = Number(score);
  if (!Number.isFinite(value) || value < 50) {
    return GemTier.BRONZE;
  }
  if (value < 70) {
    return GemTier.SILVER;
  }
  if (value < 80) {
    return GemTier.GOLD;
  }
  if (value < 90) {
    return GemTier.PLATINUM;
  }
  return GemTier.DIAMOND;
}

export function gemTierFromWeight(weight: WeightScore): GemTier {
  switch (weight) {
    case 5:
      return GemTier.DIAMOND;
    case 4:
      return GemTier.PLATINUM;
    case 3:
      return GemTier.GOLD;
    case 2:
      return GemTier.SILVER;
    case 1:
      return GemTier.BRONZE;
  }
}

export function GemBadge({ tier, criteria }: GemBadgeProps) {
  const tipId = useId();
  const meta = GEM_META[tier];
  const explanation = criteria ?? meta.criteria;

  return (
    <span className="group relative inline-flex max-w-full">
      <span
        tabIndex={0}
        aria-describedby={tipId}
        aria-label={`${meta.label}. ${explanation}`}
        className={cn(
          "inline-flex cursor-help items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          meta.className
        )}
      >
        <GemIcon />
        {meta.label}
      </span>
      <span
        id={tipId}
        role="tooltip"
        className="absolute left-0 top-full z-20 mt-1 w-56 rounded-md border border-border bg-popover p-2 text-xs font-normal text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {explanation}
      </span>
    </span>
  );
}
