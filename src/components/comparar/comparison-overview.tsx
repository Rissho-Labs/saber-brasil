import Link from "next/link";
import type { ComparisonReport } from "@/types/comparison";
import type { PoliticianRole } from "@/types/politician";

const ROLE_LABEL: Record<PoliticianRole, string> = {
  deputado: "Deputado(a)",
  senador: "Senador(a)",
};

function formatBrl(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export interface ComparisonOverviewProps {
  report: ComparisonReport;
}

export function ComparisonOverview({ report }: ComparisonOverviewProps) {
  const { selected, highlights, agreementRate } = report;

  return (
    <div className="space-y-8">
      <section
        aria-labelledby="compare-summary-heading"
        className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
      >
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            Camada 1 · Resumo objetivo
          </p>
          <h2 id="compare-summary-heading" className="text-lg font-semibold tracking-tight">
            Concordância e destaques quantitativos
          </h2>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-medium text-foreground">Concordância em votações</p>
            <p className="text-sm font-semibold text-foreground">
              {agreementRate === null ? "Sem base compartilhada" : `${agreementRate}%`}
            </p>
          </div>
          <div
            className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
            role="meter"
            aria-label="Concordância em votações nominais compartilhadas"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={agreementRate ?? 0}
          >
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${agreementRate ?? 0}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Percentual das votações do catálogo em que todos os selecionados registraram voto e
            escolheram a mesma posição. Não há julgamento ideológico.
          </p>
        </div>

        <ul className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-3">
          {highlights.map((item) => (
            <li
              key={item.id}
              className="space-y-2 rounded-lg border border-border bg-background p-4"
            >
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {item.label}
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{item.value}</p>
              <p className="text-sm font-medium text-foreground">{item.politicianName}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {item.plainExplanation}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="compare-side-heading" className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            Camada 2 · Indicadores lado a lado
          </p>
          <h2 id="compare-side-heading" className="text-lg font-semibold tracking-tight">
            Métricas objetivas
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Comparação objetiva de assiduidade, proposições, votos e despesas
            </caption>
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                  Indicador
                </th>
                {selected.map((item) => (
                  <th key={item.politician.id} scope="col" className="px-4 py-3 font-semibold">
                    <Link
                      href={`/politicos/${item.politician.id}`}
                      className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {item.politician.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <th scope="row" className="px-4 py-3 font-medium text-muted-foreground">
                  Cargo & Partido/UF
                </th>
                {selected.map((item) => (
                  <td key={item.politician.id} className="px-4 py-3 text-foreground">
                    {ROLE_LABEL[item.politician.role]} · {item.politician.party}/{item.politician.state}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <th scope="row" className="px-4 py-3 font-medium text-muted-foreground">
                  Assiduidade em Plenário
                </th>
                {selected.map((item) => (
                  <td key={item.politician.id} className="px-4 py-3 tabular-nums text-foreground">
                    {formatPercent(item.politician.metrics.presenceRate)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <th scope="row" className="px-4 py-3 font-medium text-muted-foreground">
                  Alinhamento Partidário
                </th>
                {selected.map((item) => (
                  <td key={item.politician.id} className="px-4 py-3 tabular-nums text-foreground">
                    {formatPercent(item.politician.metrics.votingAlignmentPercentage)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <th scope="row" className="px-4 py-3 font-medium text-muted-foreground">
                  Proposições Apresentadas
                </th>
                {selected.map((item) => (
                  <td key={item.politician.id} className="px-4 py-3 tabular-nums text-foreground">
                    {item.proposalsCount}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <th scope="row" className="px-4 py-3 font-medium text-muted-foreground">
                  Votos Registrados
                </th>
                {selected.map((item) => (
                  <td key={item.politician.id} className="px-4 py-3 tabular-nums text-foreground">
                    {item.votesCastCount}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-muted-foreground">
                  Gastos de Cota Parlamentar
                </th>
                {selected.map((item) => (
                  <td key={item.politician.id} className="px-4 py-3 tabular-nums text-foreground">
                    {formatBrl(item.totalExpensesBRL)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
