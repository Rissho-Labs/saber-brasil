const SPENDING_ROWS = [
  {
    id: "divulgacao",
    label: "Divulgação de Atividade",
    amount: 184_500,
  },
  {
    id: "passagens",
    label: "Passagens Aéreas",
    amount: 126_800,
  },
  {
    id: "combustiveis",
    label: "Combustíveis",
    amount: 78_250,
  },
  {
    id: "escritorio",
    label: "Escritório de Apoio",
    amount: 95_400,
  },
  {
    id: "consultoria",
    label: "Consultoria Técnica",
    amount: 62_150,
  },
] as const;

function formatBrl(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function SpendingSummaryChart() {
  const total = SPENDING_ROWS.reduce((sum, row) => sum + row.amount, 0);

  return (
    <section
      aria-labelledby="cota-spending-heading"
      className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="space-y-1">
        <h2 id="cota-spending-heading" className="text-lg font-semibold tracking-tight text-foreground">
          Distribuição ilustrativa da Cota Parlamentar
        </h2>
        <p className="text-sm text-muted-foreground">
          Quebra por categoria de despesa no semestre (valores fictícios para leitura pública).
        </p>
      </div>

      <p className="text-sm font-medium text-foreground">
        Total do período:{" "}
        <span className="tabular-nums">{formatBrl(total)}</span>
      </p>

      <ul className="space-y-4" aria-label="Distribuição de despesas da cota parlamentar">
        {SPENDING_ROWS.map((row) => {
          const percent = total > 0 ? (row.amount / total) * 100 : 0;
          return (
            <li key={row.id} className="space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-medium text-foreground">{row.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {formatBrl(row.amount)} · {percent.toFixed(1)}%
                </span>
              </div>
              <div
                className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
                role="img"
                aria-label={`${row.label}: ${formatBrl(row.amount)}, ${percent.toFixed(1)} por cento do total`}
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <details className="rounded-lg border border-border bg-muted/30 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          Como funciona a Cota Parlamentar?
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          A Cota para o Exercício da Atividade Parlamentar é um valor mensal que deputados e
          senadores podem usar em despesas ligadas ao mandato, como comunicação, deslocamento e
          apoio de gabinete. Cada gasto precisa de comprovante e pode ser consultado em portais
          oficiais. Os números desta página são ilustrativos e não substituem a consulta às
          fontes primárias.
        </p>
      </details>
    </section>
  );
}
