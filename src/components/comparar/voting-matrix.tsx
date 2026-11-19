import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ComparedVoteCell, ComparedVotingRow, ComparedPolitician } from "@/types/comparison";

const VOTE_LABEL: Record<ComparedVoteCell, string> = {
  Yes: "Sim",
  No: "Não",
  Abstain: "Abstenção",
  Absent: "Ausente",
  "N/A": "Sem registro",
};

const VOTE_VARIANT: Record<
  ComparedVoteCell,
  "approved" | "rejected" | "abstention" | "outline" | "secondary"
> = {
  Yes: "approved",
  No: "rejected",
  Abstain: "abstention",
  Absent: "outline",
  "N/A": "secondary",
};

function formatVoteDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) {
    return isoDate;
  }
  return `${day}/${month}/${year}`;
}

function rowAlignment(row: ComparedVotingRow, politicianIds: readonly string[]): "agree" | "diverge" | "incomplete" {
  const cells = politicianIds.map((id) => row.votesByPolitician[id] ?? "N/A");
  if (cells.some((cell) => cell === "N/A")) {
    return "incomplete";
  }
  const first = cells[0];
  return first && cells.every((cell) => cell === first) ? "agree" : "diverge";
}

export interface VotingMatrixProps {
  rows: readonly ComparedVotingRow[];
  selected: readonly ComparedPolitician[];
}

export function VotingMatrix({ rows, selected }: VotingMatrixProps) {
  const politicianIds = selected.map((item) => item.politician.id);
  const completeRows = rows.filter((row) => rowAlignment(row, politicianIds) !== "incomplete");
  const incompleteRows = rows.filter((row) => rowAlignment(row, politicianIds) === "incomplete");

  function renderTable(items: readonly ComparedVotingRow[], caption: string) {
    if (items.length === 0) {
      return (
        <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
          Nenhuma votação neste grupo.
        </p>
      );
    }

    return (
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                Proposição
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                Categoria
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                Data
              </th>
              {selected.map((item) => (
                <th key={item.politician.id} scope="col" className="px-4 py-3 font-semibold text-foreground">
                  {item.politician.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((row) => {
              const alignment = rowAlignment(row, politicianIds);
              return (
                <tr
                  key={row.votingId}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    alignment === "agree" && "bg-success/5",
                    alignment === "diverge" && "bg-destructive/5",
                  )}
                >
                  <th scope="row" className="px-4 py-3 align-top">
                    <Link
                      href={`/votacoes/${row.votingId}`}
                      className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {row.billCode}
                    </Link>
                    <p className="mt-1 text-xs font-normal text-muted-foreground">{row.title}</p>
                  </th>
                  <td className="px-4 py-3 align-top">
                    <Badge variant="category">{row.category}</Badge>
                  </td>
                  <td className="px-4 py-3 align-top text-muted-foreground">
                    <time dateTime={row.voteDate}>{formatVoteDate(row.voteDate)}</time>
                  </td>
                  {politicianIds.map((id) => {
                    const cell = row.votesByPolitician[id] ?? "N/A";
                    return (
                      <td key={id} className="px-4 py-3 align-top">
                        <Badge variant={VOTE_VARIANT[cell]}>{VOTE_LABEL[cell]}</Badge>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <section aria-labelledby="compare-matrix-heading" className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">
          Camada 3 · Matriz de votações nominais
        </p>
        <h2 id="compare-matrix-heading" className="text-lg font-semibold tracking-tight">
          Posições registradas no catálogo
        </h2>
        <p className="text-sm text-muted-foreground">
          Linhas em destaque suave indicam concordância (verde) ou divergência (vermelho) entre os
          selecionados. “Sem registro” não entra no cálculo de concordância.
        </p>
      </div>

      {renderTable(completeRows, "Votações com registro completo para todos os selecionados")}

      {incompleteRows.length > 0 ? (
        <details className="rounded-xl border border-border bg-muted/20 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Votações com registro incompleto ({incompleteRows.length})
          </summary>
          <div className="mt-4">
            {renderTable(
              incompleteRows,
              "Votações em que ao menos um selecionado não tem voto registrado",
            )}
          </div>
        </details>
      ) : null}
    </section>
  );
}
