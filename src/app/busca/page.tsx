import { z } from "zod";
import { SearchFilters } from "@/components/busca/search-filters";
import { ProfileCard } from "@/components/ui/profile-card";
import { getPublicProfiles } from "@/lib/services/profiles";
import { MandateStatus, mandateStatusFromProfile, SphereType } from "@/types";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
    sphere?: string | string[];
    status?: string | string[];
  }>;
}

const sphereSchema = z.enum(SphereType);
const mandateSchema = z.enum(MandateStatus);

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = firstParam(params.q).slice(0, 120);
  const sphereParsed = sphereSchema.safeParse(firstParam(params.sphere));
  const statusParsed = mandateSchema.safeParse(firstParam(params.status));
  const sphere = sphereParsed.success ? sphereParsed.data : undefined;
  const status = statusParsed.success ? statusParsed.data : undefined;
  const profiles = await getPublicProfiles(query || undefined);
  const results = profiles.filter((profile) => {
    if (sphere && profile.sphere !== sphere) {
      return false;
    }

    if (status && mandateStatusFromProfile(profile.status) !== status) {
      return false;
    }

    return true;
  });

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Busca de representantes
          </h1>
          <p className="text-sm text-muted-foreground">
            Filtre por nome, esfera institucional e situação do mandato.
          </p>
          <SearchFilters query={query} sphere={sphere} status={status} />
        </div>
      </section>

      <section aria-labelledby="search-results-heading" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 id="search-results-heading" className="sr-only">
          Resultados da busca
        </h2>
        {results.length === 0 ? (
          <p role="status" className="text-sm text-muted-foreground">
            Nenhum representante encontrado com os filtros selecionados.
          </p>
        ) : (
          <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
            {results.map((profile) => (
              <li key={profile.id}>
                <ProfileCard profile={profile} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
