import { Suspense } from "react";
import type { Metadata } from "next";
import { z } from "zod";
import { PoliticianCard, PoliticianFilters } from "@/components/politicians";
import {
  getPoliticians,
  listPoliticianParties,
  listPoliticianStates,
} from "@/lib/data/politicians";
import type { BrazilianUF, PoliticianFilters as CatalogFilters, PoliticianRole } from "@/types/politician";

export const metadata: Metadata = {
  title: "Políticos | SABER Brasil",
  description:
    "Diretório ilustrativo de deputados e senadores federais com filtros por UF, partido e cargo.",
};

interface PoliticosPageProps {
  searchParams: Promise<{
    q?: string | string[];
    party?: string | string[];
    state?: string | string[];
    role?: string | string[];
  }>;
}

const UF_VALUES = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const satisfies readonly BrazilianUF[];

const stateSchema = z.enum(UF_VALUES);
const roleSchema = z.enum(["deputado", "senador"]);
const querySchema = z.string().trim().max(120);
const partySchema = z.string().trim().max(40);

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function parseFilters(raw: {
  q?: string | string[];
  party?: string | string[];
  state?: string | string[];
  role?: string | string[];
}): CatalogFilters {
  const queryRaw = firstParam(raw.q);
  const partyRaw = firstParam(raw.party);
  const stateRaw = firstParam(raw.state).toLocaleUpperCase("pt-BR");
  const roleRaw = firstParam(raw.role).toLocaleLowerCase("pt-BR");

  const query = querySchema.safeParse(queryRaw);
  const party = partySchema.safeParse(partyRaw);
  const state = stateSchema.safeParse(stateRaw);
  const role = roleSchema.safeParse(roleRaw);

  return {
    query: queryRaw && query.success ? query.data : undefined,
    party: partyRaw && party.success ? party.data : undefined,
    state: state.success ? state.data : undefined,
    role: role.success ? (role.data as PoliticianRole) : undefined,
  };
}

function FiltersFallback() {
  return (
    <div
      className="h-[7.5rem] animate-pulse rounded-lg bg-muted/60 lg:h-16"
      aria-hidden="true"
    />
  );
}

export default async function PoliticosPage({ searchParams }: PoliticosPageProps) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const [politicians, parties, states] = await Promise.all([
    getPoliticians(filters),
    listPoliticianParties(),
    listPoliticianStates(),
  ]);

  const resultLabel =
    politicians.length === 1
      ? "1 parlamentar encontrado"
      : `${politicians.length} parlamentares encontrados`;

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Diretório de políticos
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Catálogo ilustrativo de deputados e senadores federais. Métricas e filiações não
              são lidas ao vivo da Câmara nem do Senado.
            </p>
          </div>
          <Suspense fallback={<FiltersFallback />}>
            <PoliticianFilters parties={parties} states={states} />
          </Suspense>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8" aria-labelledby="politicos-results">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="politicos-results" className="text-lg font-semibold tracking-tight">
              Resultados
            </h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {resultLabel}
            </p>
          </div>

          {politicians.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
              Nenhum parlamentar corresponde aos filtros selecionados.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {politicians.map((politician) => (
                <li key={politician.id}>
                  <PoliticianCard politician={politician} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
