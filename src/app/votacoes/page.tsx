import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";
import { VotingCard, VotingFilters } from "@/components/votings";
import { getVotings } from "@/lib/data/votings";
import type { VotingCategory, VotingFilters as CatalogFilters, VotingOutcome } from "@/types/voting";

export const metadata: Metadata = {
  title: "Votações | SABER Brasil",
  description:
    "Diretório ilustrativo de votações legislativas com resumo em linguagem acessível e filtros por tema e resultado.",
};

interface VotacoesPageProps {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    outcome?: string | string[];
  }>;
}

const CATEGORY_VALUES = [
  "Economia",
  "Saúde",
  "Educação",
  "Segurança",
  "Meio Ambiente",
  "Administração Pública",
] as const satisfies readonly VotingCategory[];

const categorySchema = z.enum(CATEGORY_VALUES);
const outcomeSchema = z.enum(["Approved", "Rejected", "Pending"]);
const querySchema = z.string().trim().max(120);

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function parseFilters(raw: {
  q?: string | string[];
  category?: string | string[];
  outcome?: string | string[];
}): CatalogFilters {
  const queryRaw = firstParam(raw.q);
  const categoryRaw = firstParam(raw.category);
  const outcomeRaw = firstParam(raw.outcome);

  const queryParsed = querySchema.safeParse(queryRaw);
  const categoryParsed = categorySchema.safeParse(categoryRaw);
  const outcomeParsed = outcomeSchema.safeParse(outcomeRaw);

  const filters: CatalogFilters = {};

  if (queryParsed.success && queryParsed.data.length > 0) {
    filters.query = queryParsed.data;
  }
  if (categoryParsed.success) {
    filters.category = categoryParsed.data;
  }
  if (outcomeParsed.success) {
    filters.outcome = outcomeParsed.data as VotingOutcome;
  }

  return filters;
}

function FiltersFallback() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      <div className="h-9 animate-pulse rounded-md bg-muted sm:col-span-2 lg:col-span-1" />
      <div className="h-9 animate-pulse rounded-md bg-muted" />
      <div className="h-9 animate-pulse rounded-md bg-muted" />
    </div>
  );
}

export default async function VotacoesPage({ searchParams }: VotacoesPageProps) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const votings = await getVotings(filters);
  const hasActiveFilters = Boolean(filters.query || filters.category || filters.outcome);

  const resultLabel =
    votings.length === 1 ? "1 votação encontrada" : `${votings.length} votações encontradas`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Votações e tramitações
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Catálogo ilustrativo com resumo em linguagem clara, placar e comparação entre a
              urgência do Parlamento e a prioridade cidadã. Os dados não são lidos ao vivo da
              Câmara nem do Senado.
            </p>
          </div>
          <Suspense fallback={<FiltersFallback />}>
            <VotingFilters />
          </Suspense>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8" aria-labelledby="votacoes-results">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="votacoes-results" className="text-lg font-semibold tracking-tight">
              Resultados
            </h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {resultLabel}
            </p>
          </div>

          {votings.length === 0 ? (
            <div className="space-y-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma votação corresponde aos filtros selecionados.
              </p>
              {hasActiveFilters ? (
                <Link
                  href="/votacoes"
                  className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Limpar filtros
                </Link>
              ) : null}
            </div>
          ) : (
            <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
              {votings.map((voting) => (
                <li key={voting.id}>
                  <VotingCard voting={voting} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
