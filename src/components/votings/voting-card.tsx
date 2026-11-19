import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Voting, VotingOutcome } from "@/types/voting";

const OUTCOME_LABEL: Record<VotingOutcome, string> = {
  Approved: "Aprovado",
  Rejected: "Rejeitado",
  Pending: "Em Pauta",
};

const OUTCOME_VARIANT: Record<VotingOutcome, "approved" | "rejected" | "abstention"> = {
  Approved: "approved",
  Rejected: "rejected",
  Pending: "abstention",
};

function formatVoteDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) {
    return isoDate;
  }

  return `${day}/${month}/${year}`;
}

function VoteTallyBar({
  totalYes,
  totalNo,
  totalAbstain,
}: {
  totalYes: number;
  totalNo: number;
  totalAbstain: number;
}) {
  const total = totalYes + totalNo + totalAbstain;
  const yesPct = total > 0 ? (totalYes / total) * 100 : 0;
  const noPct = total > 0 ? (totalNo / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div
        role="img"
        aria-label={`Placar: ${totalYes} a favor, ${totalNo} contra, ${totalAbstain} abstenções`}
        className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <span className="h-full bg-success" style={{ width: `${yesPct}%` }} />
        <span className="h-full bg-destructive" style={{ width: `${noPct}%` }} />
      </div>
      <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <div className="flex gap-1">
          <dt>A favor</dt>
          <dd className="font-semibold text-success">{totalYes}</dd>
        </div>
        <div className="flex gap-1">
          <dt>Contra</dt>
          <dd className="font-semibold text-destructive">{totalNo}</dd>
        </div>
        <div className="flex gap-1">
          <dt>Abstenções</dt>
          <dd className="font-semibold text-foreground">{totalAbstain}</dd>
        </div>
      </dl>
    </div>
  );
}

function DivergencePill({
  institutionalUrgency,
  citizenPriority,
}: {
  institutionalUrgency: number;
  citizenPriority: number;
}) {
  const gap = Math.abs(institutionalUrgency - citizenPriority);
  const aligned = gap <= 1;

  return (
    <p
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        aligned
          ? "border-border bg-muted text-muted-foreground"
          : "border-border bg-accent text-accent-foreground",
      )}
    >
      <span>Parlamento {institutionalUrgency}/5</span>
      <span aria-hidden="true">·</span>
      <span>Cidadãos {citizenPriority}/5</span>
      {!aligned ? <span className="sr-only">Divergência alta de prioridade</span> : null}
    </p>
  );
}

export interface VotingCardProps {
  voting: Voting;
}

export function VotingCard({ voting }: VotingCardProps) {
  const href = `/votacoes/${voting.id}`;
  const titleId = `voting-${voting.id}-title`;

  return (
    <Card className="h-full border-border bg-card text-card-foreground shadow-sm transition-colors hover:border-muted-foreground/30">
      <CardHeader className="space-y-3 p-5 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="party">{voting.billCode}</Badge>
          <Badge variant="category">{voting.category}</Badge>
          <Badge variant={OUTCOME_VARIANT[voting.result]}>
            {OUTCOME_LABEL[voting.result]}
          </Badge>
        </div>
        <CardTitle id={titleId} className="text-base font-semibold leading-snug">
          <Link
            href={href}
            className="rounded-sm text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-describedby={`${voting.id}-plain`}
          >
            {voting.title}
          </Link>
        </CardTitle>
        <time dateTime={voting.voteDate} className="text-xs text-muted-foreground">
          {formatVoteDate(voting.voteDate)}
        </time>
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-0">
        <p id={`${voting.id}-plain`} className="text-sm leading-relaxed text-foreground">
          {voting.plainSummary}
        </p>
        <details className="group rounded-lg border border-border bg-muted/30 p-3">
          <summary className="cursor-pointer text-xs font-semibold text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Detalhes técnicos
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{voting.summary}</p>
          <p className="mt-2 text-xs text-muted-foreground">Relator(a): {voting.rapporteur}</p>
        </details>
        <VoteTallyBar
          totalYes={voting.totalYes}
          totalNo={voting.totalNo}
          totalAbstain={voting.totalAbstain}
        />
        <DivergencePill
          institutionalUrgency={voting.institutionalUrgency}
          citizenPriority={voting.citizenPriority}
        />
      </CardContent>
    </Card>
  );
}
