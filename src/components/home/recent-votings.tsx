import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  filterVotingsByStatus,
  type VoteTally,
  type VotingSearchItem,
} from "@/lib/search/catalog";

function percent(part: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Math.round((part / total) * 100);
}

function tallyPercents(votes: VoteTally) {
  const total = votes.favor + votes.against + votes.abstentions;
  return {
    favor: percent(votes.favor, total),
    against: percent(votes.against, total),
    total,
  };
}

function statusBadgeClass(status: VotingSearchItem["status"]): string {
  if (status === "Aprovadas") {
    return "bg-primary/15 text-primary";
  }

  if (status === "Revogadas") {
    return "bg-destructive/15 text-destructive";
  }

  return "bg-secondary text-secondary-foreground";
}

function recentCatalogVotings(): VotingSearchItem[] {
  return filterVotingsByStatus(undefined)
    .filter((item) => item.votes !== null)
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 2);
}

export function RecentVotings() {
  const votings = recentCatalogVotings();

  return (
    <section aria-labelledby="votings-heading" className="space-y-6">
      <div className="flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <p className="text-xs font-bold tracking-wider text-primary uppercase">
            Transparência em Foco
          </p>
          <h2
            id="votings-heading"
            className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground"
          >
            <ClipboardCheck className="size-5 text-primary" aria-hidden="true" />
            Votações Recentes no Plenário
          </h2>
          <p className="text-sm text-muted-foreground">
            Placares do catálogo ilustrativo em `/votacoes`. Não é leitura ao vivo da Casa.
          </p>
        </div>
        <span className="text-xs text-muted-foreground">Catálogo local</span>
      </div>

      {votings.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma votação com placar no catálogo.</p>
      ) : (
        <div className="space-y-4">
          {votings.map((voting) => {
            const votes = voting.votes;
            if (!votes) {
              return null;
            }

            const parts = tallyPercents(votes);

            return (
              <Card
                key={voting.id}
                className="rounded-2xl border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <CardHeader className="space-y-3 p-5 pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                      {voting.code} • {voting.title}
                    </span>
                    <Badge
                      className={`rounded px-2 py-0.5 text-[11px] font-bold ${statusBadgeClass(voting.status)}`}
                    >
                      {voting.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold leading-snug text-foreground">
                    {voting.description}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-5 pt-2">
                  <div>
                    <div className="mb-1.5 flex justify-between gap-3 text-xs font-bold">
                      <span className="flex items-center gap-1 text-primary">
                        ● Sim: {parts.favor}% ({votes.favor} votos)
                      </span>
                      <span className="flex items-center gap-1 text-destructive">
                        ● Não: {parts.against}% ({votes.against} votos)
                      </span>
                    </div>
                    <div
                      className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
                      role="img"
                      aria-label={`A favor ${parts.favor} por cento, contra ${parts.against} por cento`}
                    >
                      <div className="h-full bg-primary" style={{ width: `${parts.favor}%` }} />
                      <div
                        className="h-full bg-destructive"
                        style={{ width: `${parts.against}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span>
                      {voting.sessionHouse} · Relatoria: {voting.author} ·{" "}
                      <time dateTime={voting.date}>
                        {new Date(`${voting.date}T12:00:00`).toLocaleDateString("pt-BR")}
                      </time>
                    </span>
                    <span>Quórum catalogado: {parts.total} votos</span>
                  </div>
                  <Link
                    href="/votacoes"
                    className="inline-flex text-xs font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Abrir hub de tramitações →
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
