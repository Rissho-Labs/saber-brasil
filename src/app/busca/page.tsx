import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileCard } from "@/components/ui/profile-card";
import { getPublicProfiles } from "@/lib/services/profiles";
import { SphereType } from "@/types";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
    sphere?: string | string[];
  }>;
}

const SPHERE_OPTIONS: { value: SphereType; label: string }[] = [
  { value: SphereType.POLITICA, label: "Política" },
  { value: SphereType.JUDICIARIO, label: "Judiciário" },
  { value: SphereType.ACADEMIA, label: "Academia" },
  { value: SphereType.SEGURANCA, label: "Segurança" },
];

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function parseSphere(value: string): SphereType | undefined {
  if (
    value === SphereType.POLITICA ||
    value === SphereType.JUDICIARIO ||
    value === SphereType.ACADEMIA ||
    value === SphereType.SEGURANCA
  ) {
    return value;
  }

  return undefined;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = firstParam(params.q);
  const sphere = parseSphere(firstParam(params.sphere));
  const profiles = await getPublicProfiles(query || undefined);
  const results = sphere
    ? profiles.filter((profile) => profile.sphere === sphere)
    : profiles;

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Busca de representantes
          </h1>
          <p className="text-sm text-muted-foreground">
            Filtre por nome e pela esfera institucional.
          </p>
          <form action="/busca" method="GET" className="grid gap-3 sm:grid-cols-[1fr_14rem_auto] sm:items-end">
            <div className="space-y-1.5">
              <label htmlFor="search-q" className="text-sm font-medium">
                Nome
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="search-q"
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Busque por nome..."
                  className="h-11 bg-background pl-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="search-sphere" className="text-sm font-medium">
                Esfera
              </label>
              <select
                id="search-sphere"
                name="sphere"
                defaultValue={sphere ?? ""}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Todas as esferas</option>
                {SPHERE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="h-11">
              Buscar
            </Button>
          </form>
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
