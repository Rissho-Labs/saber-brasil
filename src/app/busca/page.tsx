import Link from "next/link";
import { Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPublicProfiles } from "@/lib/services/profiles";
import { AlertBadge, PublicProfile, SphereType } from "@/types";

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

function formatRating(value: number): string {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toFixed(1) : "0.0";
}

function formatScore(value: number): string {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? String(Math.trunc(numeric)) : "0";
}

function badgeVariant(badge: AlertBadge) {
  if (badge === AlertBadge.CONDENADO || badge === AlertBadge.CASSADO) {
    return "destructive" as const;
  }

  if (badge === AlertBadge.INVESTIGADO) {
    return "secondary" as const;
  }

  return "outline" as const;
}

function ProfileResultCard({ profile }: { profile: PublicProfile }) {
  return (
    <li>
      <Link
        href={`/politicos/${profile.id}`}
        className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Card className="h-full border-border/80 transition-colors hover:border-foreground/30">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-bold"
              aria-hidden="true"
            >
              {profile.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-base">{profile.name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {profile.current_role ?? "Cargo não informado"}
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-2 pt-0 text-xs">
            <Badge variant={badgeVariant(profile.badge)}>{profile.badge}</Badge>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 font-medium text-amber-500">
                <Star className="size-4 fill-amber-500" aria-hidden="true" />
                <span>
                  <span className="sr-only">Avaliação do público: </span>
                  {formatRating(profile.carisma_rating)}
                  <span className="sr-only"> de 5</span>
                </span>
              </span>
              <span>
                <span className="sr-only">Índice de gestão: </span>
                Gestão {formatScore(profile.gestao_score)}
                <span className="sr-only"> de 100</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
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
        <div className="mx-auto max-w-5xl space-y-4">
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

      <section aria-labelledby="search-results-heading" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
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
              <ProfileResultCard key={profile.id} profile={profile} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
