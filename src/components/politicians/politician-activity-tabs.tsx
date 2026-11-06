"use client";

import { useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  ExpenseSummary,
  PoliticalProposal,
  ProposalStatus,
  VotingPosition,
  VotingRecord,
} from "@/types/politician";

type ActivityTab = "propostas" | "votacoes" | "gastos";

const TABS: { id: ActivityTab; label: string }[] = [
  { id: "propostas", label: "Propostas de Lei" },
  { id: "votacoes", label: "Histórico de Votações" },
  { id: "gastos", label: "Gastos de Cota Parlamentar" },
];

const PROPOSAL_BADGE: Record<
  ProposalStatus,
  "default" | "approved" | "rejected" | "abstention" | "category" | "outline"
> = {
  "Em Tramitação": "category",
  "Em Discussão": "outline",
  Aprovado: "approved",
  Promulgado: "approved",
  Arquivado: "rejected",
};

const VOTE_BADGE: Record<
  VotingPosition,
  "approved" | "rejected" | "abstention" | "outline"
> = {
  "A favor": "approved",
  Contra: "rejected",
  "Abstenção": "abstention",
  Ausente: "outline",
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatIsoDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return iso;
  }
  return dateFmt.format(parsed);
}

export interface PoliticianActivityTabsProps {
  proposals: readonly PoliticalProposal[];
  votings: readonly VotingRecord[];
  expenses: readonly ExpenseSummary[];
}

export function PoliticianActivityTabs({
  proposals,
  votings,
  expenses,
}: PoliticianActivityTabsProps) {
  const [active, setActive] = useState<ActivityTab>("propostas");
  const baseId = useId();

  return (
    <section aria-labelledby={`${baseId}-heading`} className="space-y-4">
      <h2 id={`${baseId}-heading`} className="text-lg font-semibold tracking-tight">
        Atividade parlamentar
      </h2>

      <div
        role="tablist"
        aria-label="Seções de atividade"
        className="flex flex-wrap gap-2 border-b border-border pb-2"
      >
        {TABS.map((tab) => {
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-propostas`}
        aria-labelledby={`${baseId}-tab-propostas`}
        hidden={active !== "propostas"}
        className="space-y-3"
      >
        {proposals.length === 0 ? (
          <EmptyState message="Nenhuma proposta ilustrativa cadastrada para este parlamentar." />
        ) : (
          proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="party">{proposal.code}</Badge>
                  <Badge variant={PROPOSAL_BADGE[proposal.status]}>{proposal.status}</Badge>
                </div>
                <CardTitle className="text-base">{proposal.title}</CardTitle>
                <CardDescription>
                  Apresentada em {formatIsoDate(proposal.presentationDate)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{proposal.summary}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-votacoes`}
        aria-labelledby={`${baseId}-tab-votacoes`}
        hidden={active !== "votacoes"}
        className="space-y-3"
      >
        {votings.length === 0 ? (
          <EmptyState message="Nenhum voto nominal ilustrativo cadastrado para este parlamentar." />
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border">
            {votings.map((vote) => (
              <li
                key={vote.id}
                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium">{vote.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {vote.code} · {formatIsoDate(vote.date)}
                  </p>
                </div>
                <Badge variant={VOTE_BADGE[vote.position]}>{vote.position}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-gastos`}
        aria-labelledby={`${baseId}-tab-gastos`}
        hidden={active !== "gastos"}
        className="space-y-3"
      >
        {expenses.length === 0 ? (
          <EmptyState message="Nenhum gasto de cota ilustrativo cadastrado para este parlamentar." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <caption className="sr-only">Gastos de cota parlamentar ilustrativos</caption>
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Categoria
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Período
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((row, index) => (
                  <tr key={`${row.category}-${row.month}-${row.year}-${index}`} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">{row.category}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {String(row.month).padStart(2, "0")}/{row.year}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {currency.format(row.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}
