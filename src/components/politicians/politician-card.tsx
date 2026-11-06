import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Politician, PoliticianRole } from "@/types/politician";

const ROLE_LABEL: Record<PoliticianRole, string> = {
  deputado: "Deputado(a)",
  senador: "Senador(a)",
};

function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

function PoliticianAvatar({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl: string | null;
}) {
  const initial = name.trim().charAt(0).toLocaleUpperCase("pt-BR") || "?";

  if (!photoUrl) {
    return (
      <div
        className="flex size-16 shrink-0 items-center justify-center rounded-full bg-muted text-xl font-semibold text-muted-foreground"
        aria-hidden="true"
      >
        {initial}
      </div>
    );
  }

  return (
    <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted">
      <Image
        src={photoUrl}
        alt=""
        fill
        sizes="64px"
        className="object-cover"
      />
    </div>
  );
}

export interface PoliticianCardProps {
  politician: Politician;
  className?: string;
}

export function PoliticianCard({ politician, className }: PoliticianCardProps) {
  const titleId = `politician-${politician.id}-name`;
  const { metrics } = politician;

  return (
    <Link
      href={`/politicos/${politician.id}`}
      className={cn(
        "group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      aria-labelledby={titleId}
    >
      <Card className="flex h-full flex-col transition-colors group-hover:border-primary/40 group-hover:bg-muted/30">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <PoliticianAvatar name={politician.name} photoUrl={politician.photoUrl} />
          <div className="min-w-0 flex-1 space-y-2">
            <CardTitle id={titleId} className="truncate text-base">
              {politician.name}
            </CardTitle>
            <p className="truncate text-xs text-muted-foreground">{politician.civilName}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="party">
                {politician.party}/{politician.state}
              </Badge>
              <Badge variant="category">{ROLE_LABEL[politician.role]}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Presença</p>
            <p className="text-sm font-semibold tabular-nums">
              {formatPercent(metrics.presenceRate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Propostas</p>
            <p className="text-sm font-semibold tabular-nums">{metrics.proposalsCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Alinhamento</p>
            <p className="text-sm font-semibold tabular-nums">
              {formatPercent(metrics.votingAlignmentPercentage)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
