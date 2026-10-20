import Link from "next/link";
import { notFound } from "next/navigation";
import { PillarMetrics } from "@/components/esferas/pillar-metrics";
import { IndicatorCard } from "@/components/indicadores/indicator-card";
import { ProfileCard } from "@/components/ui/profile-card";
import { Badge } from "@/components/ui/badge";
import { VotingResultCard } from "@/components/busca/search-result-cards";
import { buttonVariants } from "@/components/ui/button";
import {
  indicatorsForSphere,
  spherePageBySlug,
  votingsForSphere,
} from "@/lib/esferas/catalog";
import { getPublicProfiles } from "@/lib/services/profiles";
import { cn } from "@/lib/utils";

interface SpherePageProps {
  params: Promise<{ slug: string }>;
}

export default async function SpherePage({ params }: SpherePageProps) {
  const { slug } = await params;
  const sphere = spherePageBySlug(slug);
  if (!sphere) {
    notFound();
  }

  const profiles = (await getPublicProfiles()).filter((profile) => profile.sphere === sphere.type);
  const votings = votingsForSphere(sphere.type);
  const indicators = indicatorsForSphere(sphere);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span aria-hidden="true" className="text-2xl">
              {sphere.emoji}
            </span>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{sphere.title}</h1>
            <Badge variant="outline">{sphere.type}</Badge>
          </div>
          <p className="max-w-3xl text-sm text-muted-foreground">{sphere.description}</p>
          <div>
            <h2 className="text-sm font-medium">Escopo de cobertura</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {sphere.coverage.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p>
            <Link
              href={`/busca?sphere=${sphere.type}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Buscar nesta esfera
            </Link>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <PillarMetrics pillars={sphere.pillars} />

        <section aria-labelledby="esfera-representantes" className="space-y-4">
          <div className="space-y-1">
            <h2 id="esfera-representantes" className="text-xl font-semibold tracking-tight">
              Representantes & Integrantes
            </h2>
            <p className="text-sm text-muted-foreground">
              Perfis públicos desta esfera. Os cards abrem o detalhe em `/politicos/[id]`.
            </p>
          </div>
          {profiles.length === 0 ? (
            <p role="status" className="text-sm text-muted-foreground">
              Nenhum representante listado para esta esfera neste ambiente.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile) => (
                <li key={profile.id}>
                  <ProfileCard profile={profile} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="esfera-votacoes" className="space-y-4">
          <div className="space-y-1">
            <h2 id="esfera-votacoes" className="text-xl font-semibold tracking-tight">
              Votações & Tramitações da Esfera
            </h2>
            <p className="text-sm text-muted-foreground">
              Itens do catálogo legislativo ligados a esta esfera. Não é um feed ao vivo da Casa.
            </p>
          </div>
          {votings.length === 0 ? (
            <p role="status" className="text-sm text-muted-foreground">
              Nenhuma tramitação ilustrativa para esta esfera.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {votings.map((item) => (
                <li key={item.id}>
                  <VotingResultCard item={item} />
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/votacoes"
            className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Abrir hub de tramitações
          </Link>
        </section>

        <section aria-labelledby="esfera-indicadores" className="space-y-4">
          <div className="space-y-1">
            <h2 id="esfera-indicadores" className="text-xl font-semibold tracking-tight">
              Indicadores Relevantes
            </h2>
            <p className="text-sm text-muted-foreground">
              Métricas públicas e auditorias do catálogo que fazem sentido para este domínio.
            </p>
          </div>
          {indicators.length === 0 ? (
            <p role="status" className="text-sm text-muted-foreground">
              Nenhum indicador do catálogo está mapeado para esta esfera.
            </p>
          ) : (
            <ul className="grid gap-4 lg:grid-cols-2">
              {indicators.map((item) => (
                <li key={item.id}>
                  <IndicatorCard item={item} />
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/indicadores"
            className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Abrir hub de indicadores
          </Link>
        </section>
      </div>
    </main>
  );
}
