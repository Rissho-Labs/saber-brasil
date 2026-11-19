import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";
import {
  ComparisonOverview,
  PoliticianSelector,
  VotingMatrix,
} from "@/components/comparar";
import {
  getComparisonReport,
  MAX_COMPARED_POLITICIANS,
  MIN_COMPARED_POLITICIANS,
  normalizeComparisonIds,
} from "@/lib/data/comparison";
import { getPoliticians } from "@/lib/data/politicians";

export const metadata: Metadata = {
  title: "Comparar Políticos | SABER Brasil",
  description:
    "Compare de 2 a 4 parlamentares com métricas objetivas de assiduidade, proposições, despesas e posições em votações nominais.",
};

interface CompararPageProps {
  searchParams: Promise<{
    ids?: string | string[];
  }>;
}

const idTokenSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-zA-Z0-9_-]+$/);

const PRESETS = [
  {
    label: "Beatriz Rocha × Mariana Nunes",
    ids: ["pol-dep-beatriz-rocha", "pol-dep-mariana-nunes"],
  },
  {
    label: "Alex Silva × Ricardo Mota × João Freitas",
    ids: ["pol-dep-alex-silva", "pol-dep-ricardo-mota", "pol-dep-joao-freitas"],
  },
  {
    label: "Clara Monteiro × Paulo Nunes × Helena Dias",
    ids: ["pol-sen-clara-monteiro", "pol-sen-paulo-nunes", "pol-sen-helena-dias"],
  },
] as const;

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }
  return value?.trim() ?? "";
}

function parseIds(raw: string): string[] {
  if (!raw) {
    return [];
  }

  const tokens = raw
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)
    .flatMap((token) => {
      const parsed = idTokenSchema.safeParse(token);
      return parsed.success ? [parsed.data] : [];
    });

  return normalizeComparisonIds(tokens, MAX_COMPARED_POLITICIANS);
}

function SelectorFallback() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
      <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
      <div className="h-40 w-full animate-pulse rounded-xl border border-border bg-card" />
    </div>
  );
}

export default async function CompararPage({ searchParams }: CompararPageProps) {
  const params = await searchParams;
  const ids = parseIds(firstParam(params.ids));

  const [catalog, report] = await Promise.all([getPoliticians(), getComparisonReport(ids)]);
  const ready = report.selected.length >= MIN_COMPARED_POLITICIANS;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Comparar políticos</h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Ferramenta neutra para colocar de {MIN_COMPARED_POLITICIANS} a{" "}
              {MAX_COMPARED_POLITICIANS} parlamentares lado a lado. Só entram métricas
              quantitativas e posições nominais do catálogo — sem notas ideológicas.
            </p>
          </div>
          <Suspense fallback={<SelectorFallback />}>
            <PoliticianSelector catalog={catalog} selectedIds={ids} />
          </Suspense>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        {!ready ? (
          <section
            aria-labelledby="compare-guide-heading"
            className="space-y-4 rounded-xl border border-dashed border-border bg-muted/30 p-6"
          >
            <h2 id="compare-guide-heading" className="text-lg font-semibold tracking-tight">
              Comece com uma comparação pronta
            </h2>
            <p className="text-sm text-muted-foreground">
              Selecione pelo menos {MIN_COMPARED_POLITICIANS} parlamentares acima, ou use um dos
              atalhos abaixo.
            </p>
            <ul className="flex list-none flex-col gap-2 p-0 sm:flex-row sm:flex-wrap">
              {PRESETS.map((preset) => (
                <li key={preset.label}>
                  <Link
                    href={`/comparar?ids=${encodeURIComponent(preset.ids.join(","))}`}
                    className="inline-flex rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {preset.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <>
            <ComparisonOverview report={report} />
            <VotingMatrix rows={report.votingMatrix} selected={report.selected} />
          </>
        )}
      </div>
    </main>
  );
}
