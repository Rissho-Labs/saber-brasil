import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";
import { IndicatorCard, SpendingSummaryChart } from "@/components/indicators";
import { buttonVariants } from "@/components/ui/button";
import { getTransparencyIndicators } from "@/lib/data/votings";
import { cn } from "@/lib/utils";
import type { TransparencyIndicator } from "@/types/voting";

export const metadata: Metadata = {
  title: "Indicadores de Transparência | SABER Brasil",
  description:
    "Painel ilustrativo de transparência legislativa: assiduidade, emendas publicadas, votações nominais e distribuição da cota parlamentar.",
};

interface IndicadoresPageProps {
  searchParams: Promise<{
    category?: string | string[];
    categoria?: string | string[];
  }>;
}

const categoryFilterSchema = z.string().trim().min(1).max(80);

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function averagePercent(indicators: readonly TransparencyIndicator[]): number | null {
  const rows = indicators.filter((item) => item.unit === "%");
  if (rows.length === 0) {
    return null;
  }
  const sum = rows.reduce((acc, item) => acc + item.score, 0);
  return Math.round((sum / rows.length) * 10) / 10;
}

function findById(
  indicators: readonly TransparencyIndicator[],
  id: string,
): TransparencyIndicator | undefined {
  return indicators.find((item) => item.id === id);
}

export default async function IndicadoresPage({ searchParams }: IndicadoresPageProps) {
  const params = await searchParams;
  const rawCategory = firstParam(params.category) || firstParam(params.categoria);
  const categoryParsed = categoryFilterSchema.safeParse(rawCategory);
  const category = categoryParsed.success ? categoryParsed.data : undefined;

  const allIndicators = await getTransparencyIndicators();
  const categories = [...new Set(allIndicators.map((item) => item.category))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
  const indicators = category
    ? allIndicators.filter((item) => item.category === category)
    : allIndicators;

  const generalIndex = averagePercent(allIndicators);
  const attendance = findById(allIndicators, "ind-assiduidade-media");
  /** Illustrative semester volume — not a live Câmara/Senado feed. */
  const proposalsAnalyzed = 1_240;

  const resultLabel =
    indicators.length === 1 ? "1 indicador" : `${indicators.length} indicadores`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Indicadores de transparência
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Leitura ilustrativa de assiduidade, publicação de emendas, tramitação e abertura de
              votações nominais. Os valores não são lidos ao vivo do Portal da Transparência, da
              Câmara ou do Senado.
            </p>
          </div>

          <nav aria-label="Filtrar indicadores por categoria" className="flex flex-wrap gap-2">
            <Link
              href="/indicadores"
              aria-current={category ? undefined : "page"}
              className={cn(
                buttonVariants({ variant: category ? "outline" : "default", size: "sm" }),
              )}
            >
              Todos
            </Link>
            {categories.map((item) => (
              <Link
                key={item}
                href={`/indicadores?category=${encodeURIComponent(item)}`}
                aria-current={category === item ? "page" : undefined}
                className={cn(
                  buttonVariants({
                    variant: category === item ? "default" : "outline",
                    size: "sm",
                  }),
                )}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <section aria-labelledby="kpi-strip-heading" className="space-y-4">
          <h2 id="kpi-strip-heading" className="sr-only">
            Resumo dos principais indicadores
          </h2>
          <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
            <li className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Índice Geral de Transparência
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                {generalIndex !== null ? `${generalIndex}%` : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Média dos indicadores percentuais do catálogo
              </p>
            </li>
            <li className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Assiduidade Média em Plenário
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                {attendance ? `${attendance.score}%` : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Presença nominal nas sessões deliberativas
              </p>
            </li>
            <li className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Proposições Analisadas
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                {proposalsAnalyzed.toLocaleString("pt-BR")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Volume ilustrativo de proposições revisadas no semestre
              </p>
            </li>
          </ul>
        </section>

        <section aria-labelledby="indicators-grid-heading" className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="indicators-grid-heading" className="text-lg font-semibold tracking-tight">
              Indicadores
            </h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {resultLabel}
            </p>
          </div>
          {indicators.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
              Nenhum indicador nesta categoria.{" "}
              <Link
                href="/indicadores"
                className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Ver todos
              </Link>
            </p>
          ) : (
            <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
              {indicators.map((indicator) => (
                <li key={indicator.id}>
                  <IndicatorCard indicator={indicator} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <SpendingSummaryChart />
      </div>
    </main>
  );
}
