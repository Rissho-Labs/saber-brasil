import type { Metadata } from "next";
import { z } from "zod";
import { UnifiedSearchBar, UnifiedSearchResults } from "@/components/busca";
import { searchUnifiedHub } from "@/lib/search/unified-hub";
import type { UnifiedSearchCategory } from "@/types/home-hub";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
    categoria?: string | string[];
  }>;
}

const categorySchema = z.enum([
  "all",
  "politicians",
  "votings",
  "trails",
  "spheres",
  // Portuguese aliases (legacy-friendly)
  "todas",
  "todos",
  "politicos",
  "votacoes",
  "trilhas",
  "esferas",
]);

const CATEGORY_ALIAS: Record<string, UnifiedSearchCategory> = {
  all: "all",
  todas: "all",
  todos: "all",
  politicians: "politicians",
  politicos: "politicians",
  votings: "votings",
  votacoes: "votings",
  trails: "trails",
  trilhas: "trails",
  spheres: "spheres",
  esferas: "spheres",
};

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }
  return value?.trim() ?? "";
}

function parseCategory(raw: string): UnifiedSearchCategory {
  const parsed = categorySchema.safeParse(raw.toLocaleLowerCase("pt-BR"));
  if (!parsed.success) {
    return "all";
  }
  return CATEGORY_ALIAS[parsed.data] ?? "all";
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = firstParam(params.q).slice(0, 120);

  if (query) {
    return {
      title: `Busca: ${query} | SABER Brasil`,
      description: `Resultados unificados do hub SABER Brasil para “${query}”.`,
    };
  }

  return {
    title: "Busca Unificada | SABER Brasil",
    description:
      "Busque políticos, votações nominais, trilhas didáticas e esferas institucionais em um só lugar.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = firstParam(params.q).slice(0, 120);
  const category = parseCategory(firstParam(params.categoria));

  const response = await searchUnifiedHub({ query, category });

  const heading = query
    ? `Resultados da busca para: ${query}`
    : "Busca unificada do hub";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{heading}</h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Resultados objetivos do catálogo — políticos, votações, trilhas e esferas — sem
              rótulos ideológicos.
            </p>
          </div>
          <UnifiedSearchBar
            initialQuery={response.query}
            activeCategory={response.category}
            countsByCategory={response.countsByCategory}
          />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <UnifiedSearchResults items={response.items} query={response.query} />
      </div>
    </main>
  );
}
