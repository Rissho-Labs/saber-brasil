import type { PartyVotingBreakdown } from "@/types/voting";

export interface PartyAlignmentTableProps {
  rows: readonly PartyVotingBreakdown[];
}

export function PartyAlignmentTable({ rows }: PartyAlignmentTableProps) {
  if (rows.length === 0) {
    return (
      <p
        role="status"
        className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground"
      >
        Ainda não há agregação partidária para esta votação.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <caption className="sr-only">Alinhamento partidário na votação</caption>
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold text-foreground">
              Partido
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-foreground">
              Sim
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-foreground">
              Não
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-foreground">
              Abstenções
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-foreground">
              Coesão / Alinhamento
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const alignment = Math.min(100, Math.max(0, row.partyAlignmentPercentage));
            return (
              <tr key={row.party} className="border-b border-border last:border-b-0">
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  {row.party}
                </th>
                <td className="px-4 py-3 tabular-nums text-success">{row.yesCount}</td>
                <td className="px-4 py-3 tabular-nums text-destructive">{row.noCount}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">{row.abstainCount}</td>
                <td className="px-4 py-3">
                  <div className="flex min-w-[8rem] items-center gap-3">
                    <div
                      className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
                      role="meter"
                      aria-label={`Alinhamento do ${row.party}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={alignment}
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${alignment}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right tabular-nums text-foreground">
                      {alignment}%
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
