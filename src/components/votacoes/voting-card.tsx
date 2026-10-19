import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VotingSearchItem, VoteTally } from "@/lib/search/catalog";
import { ProgressTimeline } from "@/components/votacoes/progress-timeline";
import { VoterDisclosure } from "@/components/votacoes/voter-disclosure";

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) {
    return isoDate;
  }

  return `${day}/${month}/${year}`;
}

function percent(part: number, total: number): number {
  return Math.round((part / total) * 100);
}

function VoteBreakdown({ votes }: { votes: VoteTally | null }) {
  if (!votes) {
    return <p className="text-sm text-muted-foreground">Votação ainda não iniciada.</p>;
  }

  const total = votes.favor + votes.against + votes.abstentions;
  if (total <= 0) {
    return <p className="text-sm text-muted-foreground">Votação ainda não iniciada.</p>;
  }

  const favor = percent(votes.favor, total);
  const against = percent(votes.against, total);
  const abstentions = percent(votes.abstentions, total);

  return (
    <div role="group" aria-label="Distribuição dos votos" className="space-y-2">
      <div className="flex h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div className="bg-emerald-600" style={{ width: `${favor}%` }} />
        <div className="bg-red-600" style={{ width: `${against}%` }} />
        <div className="bg-zinc-400" style={{ width: `${abstentions}%` }} />
      </div>
      <dl className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-3">
        <div>
          <dt className="font-medium text-foreground">A favor</dt>
          <dd>
            {votes.favor} ({favor}%)
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Contra</dt>
          <dd>
            {votes.against} ({against}%)
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Abstenções</dt>
          <dd>
            {votes.abstentions} ({abstentions}%)
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function VotingCard({ item }: { item: VotingSearchItem }) {
  return (
    <Card>
      <CardHeader className="gap-2 p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base font-semibold leading-snug">{item.code}</CardTitle>
          <Badge>{item.status}</Badge>
        </div>
        <p className="text-sm font-medium text-foreground">{item.title}</p>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <p className="text-sm">
          <span className="font-medium">Relatoria: </span>
          {item.author}
        </p>
        <time dateTime={item.date} className="block text-xs text-muted-foreground">
          Atualizado em {formatDate(item.date)}
        </time>
        <ProgressTimeline currentStage={item.currentStage} stageDates={item.stageDates} />
        <VoteBreakdown votes={item.votes} />
        <VoterDisclosure participants={item.participants} />
        <a
          href={item.sessionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Assistir Sessão na Íntegra - {item.sessionHouse}
        </a>
      </CardContent>
    </Card>
  );
}
