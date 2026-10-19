import { z } from "zod";
import type { ReactNode } from "react";
import { SearchCategoryTabs, type SearchCategory } from "@/components/busca/search-category-tabs";
import { SearchFilters } from "@/components/busca/search-filters";
import { PublicationResultCard, VotingResultCard } from "@/components/busca/search-result-cards";
import { Badge } from "@/components/ui/badge";
import { ProfileCard } from "@/components/ui/profile-card";
import { searchPublications, searchVotings } from "@/lib/search/catalog";
import { getPublicProfiles } from "@/lib/services/profiles";
import { MandateStatus, mandateStatusFromProfile, SphereType, type PublicProfile } from "@/types";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
    sphere?: string | string[];
    status?: string | string[];
    categoria?: string | string[];
  }>;
}

const sphereSchema = z.enum(SphereType);
const mandateSchema = z.enum(MandateStatus);
const categorySchema = z.enum(["todos", "politicos", "votacoes", "publicacoes"]);

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function shows(category: SearchCategory, panel: Exclude<SearchCategory, "todos">): boolean {
  return category === "todos" || category === panel;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = firstParam(params.q).slice(0, 120);
  const sphereParsed = sphereSchema.safeParse(firstParam(params.sphere));
  const statusParsed = mandateSchema.safeParse(firstParam(params.status));
  const categoryParsed = categorySchema.safeParse(firstParam(params.categoria));
  const sphere = sphereParsed.success ? sphereParsed.data : undefined;
  const status = statusParsed.success ? statusParsed.data : undefined;
  const category: SearchCategory = categoryParsed.success ? categoryParsed.data : "todos";
  const profiles = await getPublicProfiles(query || undefined);
  const politicians = profiles.filter((profile) => {
    if (sphere && profile.sphere !== sphere) {
      return false;
    }

    if (status && mandateStatusFromProfile(profile.status) !== status) {
      return false;
    }

    return true;
  });
  const votings = searchVotings(query);
  const publications = searchPublications(query);

  const heading = query ? `Resultados da busca para: ${query}` : "Resultados da busca";

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{heading}</h1>
          <p className="text-sm text-muted-foreground">
            Filtre por nome, categoria, esfera institucional e situação do mandato.
          </p>
          <SearchFilters query={query} sphere={sphere} status={status} category={category} />
          <SearchCategoryTabs category={category} query={query} sphere={sphere} status={status} />
        </div>
      </section>

      <div
        id={`search-panel-${category}`}
        role="tabpanel"
        aria-labelledby={`search-tab-${category}`}
        className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8"
      >
        {shows(category, "politicos") ? (
          <ResultSection title="Políticos & Representantes" count={politicians.length}>
            <PoliticianResults profiles={politicians} />
          </ResultSection>
        ) : null}
        {shows(category, "votacoes") ? (
          <ResultSection
            title="Votações & Pautas"
            count={votings.length}
            note="Catálogo ilustrativo. Não há tabela de votações na base."
          >
            {votings.length === 0 ? (
              <EmptyResults />
            ) : (
              <ul className="grid list-none gap-3 p-0">
                {votings.map((item) => (
                  <li key={item.id}>
                    <VotingResultCard item={item} />
                  </li>
                ))}
              </ul>
            )}
          </ResultSection>
        ) : null}
        {shows(category, "publicacoes") ? (
          <ResultSection
            title="Publicações & Documentos"
            count={publications.length}
            note="Catálogo ilustrativo. Não há tabela de publicações na base."
          >
            {publications.length === 0 ? (
              <EmptyResults />
            ) : (
              <ul className="grid list-none gap-3 p-0">
                {publications.map((item) => (
                  <li key={item.id}>
                    <PublicationResultCard item={item} />
                  </li>
                ))}
              </ul>
            )}
          </ResultSection>
        ) : null}
      </div>
    </main>
  );
}

function ResultSection({
  title,
  count,
  note,
  children,
}: {
  title: string;
  count: number;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <Badge variant="secondary" aria-label={count === 1 ? "1 resultado" : `${count} resultados`}>
          {count}
        </Badge>
      </div>
      {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
      {children}
    </section>
  );
}

function PoliticianResults({ profiles }: { profiles: PublicProfile[] }) {
  if (profiles.length === 0) {
    return <EmptyResults />;
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
      {profiles.map((profile) => (
        <li key={profile.id}>
          <ProfileCard profile={profile} />
        </li>
      ))}
    </ul>
  );
}

function EmptyResults() {
  return (
    <p role="status" className="text-sm text-muted-foreground">
      Nenhum resultado encontrado
    </p>
  );
}
