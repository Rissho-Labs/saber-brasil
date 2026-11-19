import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

function PriorityMeter({ label, value }: { label: string; value: number }) {
  const clamped = Math.min(5, Math.max(1, value));
  const width = (clamped / 5) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{clamped}/5</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-label={label}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={clamped}
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
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
    <div className="space-y-3">
      <div
        role="img"
        aria-label={`Placar: ${totalYes} a favor, ${totalNo} contra, ${totalAbstain} abstenções`}
        className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
      >
        <span className="h-full bg-success" style={{ width: `${yesPct}%` }} />
        <span className="h-full bg-destructive" style={{ width: `${noPct}%` }} />
      </div>
      <dl className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg border border-border bg-card p-3">
          <dt className="text-xs text-muted-foreground">Sim</dt>
          <dd className="text-lg font-semibold text-success">{totalYes}</dd>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <dt className="text-xs text-muted-foreground">Não</dt>
          <dd className="text-lg font-semibold text-destructive">{totalNo}</dd>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <dt className="text-xs text-muted-foreground">Abstenções</dt>
          <dd className="text-lg font-semibold text-foreground">{totalAbstain}</dd>
        </div>
      </dl>
    </div>
  );
}

export interface VotingHeaderProps {
  voting: Voting;
}

export function VotingHeader({ voting }: VotingHeaderProps) {
  const gap = Math.abs(voting.institutionalUrgency - voting.citizenPriority);

  return (
    <header className="space-y-8">
      <nav aria-label="Navegação da votação">
        <Link
          href="/votacoes"
          className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar para votações
        </Link>
      </nav>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="party">{voting.billCode}</Badge>
          <Badge variant="category">{voting.category}</Badge>
          <Badge variant={OUTCOME_VARIANT[voting.result]}>
            {OUTCOME_LABEL[voting.result]}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {voting.title}
        </h1>
        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex gap-1.5">
            <dt>Data</dt>
            <dd>
              <time dateTime={voting.voteDate}>{formatVoteDate(voting.voteDate)}</time>
            </dd>
          </div>
          <div className="flex gap-1.5">
            <dt>Relator(a)</dt>
            <dd className="font-medium text-foreground">{voting.rapporteur}</dd>
          </div>
        </dl>
      </div>

      <section
        aria-labelledby="voting-plain-heading"
        className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
      >
        <div className="space-y-2">
          <h2 id="voting-plain-heading" className="text-sm font-semibold tracking-wide text-primary uppercase">
            O que isso muda na prática
          </h2>
          <p className="text-base leading-relaxed text-foreground sm:text-lg">{voting.plainSummary}</p>
        </div>

        <div className="space-y-3 border-t border-border pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">Prioridade cruzada</h3>
            <p
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                gap <= 1
                  ? "border-border bg-muted text-muted-foreground"
                  : "border-border bg-accent text-accent-foreground",
              )}
            >
              {gap <= 1 ? "Prioridades alinhadas" : `Divergência de ${gap} pontos`}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <PriorityMeter label="Urgência institucional" value={voting.institutionalUrgency} />
            <PriorityMeter label="Prioridade cidadã" value={voting.citizenPriority} />
          </div>
        </div>
      </section>

      <section aria-labelledby="voting-tally-heading" className="space-y-4">
        <h2 id="voting-tally-heading" className="text-lg font-semibold tracking-tight">
          Placar da votação
        </h2>
        <VoteTallyBar
          totalYes={voting.totalYes}
          totalNo={voting.totalNo}
          totalAbstain={voting.totalAbstain}
        />
      </section>

      <details className="rounded-xl border border-border bg-muted/30 p-4 sm:p-5">
        <summary className="cursor-pointer text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          Ementa oficial / Detalhes técnicos
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{voting.summary}</p>
      </details>
    </header>
  );
}
