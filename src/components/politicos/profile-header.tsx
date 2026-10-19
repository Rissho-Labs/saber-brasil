import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MandateBadge } from "@/components/ui/mandate-badge";
import { cn } from "@/lib/utils";
import { AlertBadge, ProfileStatus, SphereType } from "@/types";

interface ProfileHeaderProps {
  name: string;
  role: string | null;
  sphere: SphereType;
  status: ProfileStatus;
  badge: AlertBadge;
}

const SPHERE_BORDER: Record<SphereType, string> = {
  [SphereType.POLITICA]: "border-green-600",
  [SphereType.JUDICIARIO]: "border-blue-600",
  [SphereType.ACADEMIA]: "border-zinc-300",
  [SphereType.SEGURANCA]: "border-zinc-700",
};

const ALERT_LABEL: Record<Exclude<AlertBadge, AlertBadge.NENHUM>, string> = {
  [AlertBadge.INVESTIGADO]: "Sob Investigação",
  [AlertBadge.CONDENADO]: "Condenado",
  [AlertBadge.CASSADO]: "Cassado",
};

export function ProfileHeader({
  name,
  role,
  sphere,
  status,
  badge,
}: ProfileHeaderProps) {
  const showActive = status === ProfileStatus.ATIVO && badge === AlertBadge.NENHUM;
  const alertLabel = badge === AlertBadge.NENHUM ? null : ALERT_LABEL[badge];

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-6 rounded-xl border-2 border-border bg-card p-6 shadow-xs sm:flex-row sm:items-center",
        SPHERE_BORDER[sphere],
      )}
    >
      <div
        className="flex size-24 shrink-0 items-center justify-center rounded-full bg-muted text-3xl font-bold text-foreground"
        aria-hidden="true"
      >
        {name.charAt(0)}
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">{name}</h1>
          {showActive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
              <span className="size-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
              Em Atividade
            </span>
          ) : null}
          {alertLabel && badge === AlertBadge.INVESTIGADO ? (
            <a
              href="https://www.gov.br/transparencia/pt-br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-950 hover:bg-amber-100"
            >
              <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true" />
              {alertLabel}
              <ExternalLink className="size-3" aria-hidden="true" />
              <span className="sr-only"> (abre fontes públicas em nova aba)</span>
            </a>
          ) : null}
          {alertLabel && badge !== AlertBadge.INVESTIGADO ? (
            <Badge variant="destructive" className="text-[10px] uppercase">
              {alertLabel}
            </Badge>
          ) : null}
        </div>

        <p className="text-sm text-muted-foreground">{role ?? "Cargo não informado"}</p>

        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="outline" className="text-xs">
            Esfera: {sphere}
          </Badge>
          <MandateBadge status={status} />
        </div>
      </div>
    </div>
  );
}
