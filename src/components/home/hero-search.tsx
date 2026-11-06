import Link from "next/link";
import { ChevronDown, GraduationCap, Landmark, Scale, Search, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SPHERE_PAGES } from "@/lib/esferas/catalog";
import type { SpherePageSlug } from "@/lib/esferas/catalog";

const SPHERE_ICONS = {
  politica: Landmark,
  judiciario: Scale,
  academia: GraduationCap,
  seguranca: Shield,
} as const satisfies Record<SpherePageSlug, typeof Landmark>;

export function HeroSearch() {
  return (
    <section
      aria-labelledby="hero-heading"
      id="inicio"
      className="hero-mesh relative isolate flex min-h-[75vh] items-center justify-center overflow-x-clip border-b border-border px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="hero-mesh-layer" aria-hidden="true">
        <span className="hero-mesh-blob hero-mesh-blob--gold absolute -top-32 left-1/2 h-[350px] w-[700px] -translate-x-1/2 bg-primary/10 blur-[120px]" />
        <span className="hero-mesh-blob hero-mesh-blob--green absolute -bottom-24 right-10 h-[400px] w-[500px] bg-primary/15 blur-[130px]" />
        <span className="hero-mesh-blob hero-mesh-blob--cyan" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-background/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary-foreground/90 uppercase shadow-inner backdrop-blur-md">
          <span className="size-2 animate-ping rounded-full bg-primary-foreground" aria-hidden="true" />
          Portal Aberto de Auditoria Cívica Nacional
        </div>

        <div className="space-y-5">
          <h1
            id="hero-heading"
            className="max-w-4xl text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl lg:text-[48px] lg:leading-[1.15]"
          >
            Transparência e Cidadania em um só lugar.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Descubra dados públicos de forma simples, participe do debate e aprenda sobre nossa
            democracia.
          </p>
        </div>

        <form
          action="/busca"
          method="GET"
          className="relative mt-9 flex w-full max-w-[680px] items-center rounded-full border border-border bg-card p-2 shadow-2xl shadow-background/50 transition-all focus-within:ring-4 focus-within:ring-primary/40"
        >
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              name="q"
              aria-label="Buscar representante ou projeto"
              placeholder="Buscar políticos, processos, pesquisas, ou segurança pública..."
              className="h-11 border-0 bg-transparent pl-11 text-sm font-medium text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0 sm:text-base"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-11 shrink-0 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-95"
          >
            Buscar
          </Button>
        </form>

        <nav
          aria-label="Atalhos das esferas"
          className="mt-7 flex max-w-2xl flex-wrap items-center justify-center gap-2.5"
        >
          <span className="mr-1 hidden text-xs font-bold tracking-wider text-primary-foreground/60 uppercase sm:inline-block">
            Categorias rápidas:
          </span>
          {SPHERE_PAGES.map((sphere) => {
            const Icon = SPHERE_ICONS[sphere.slug];
            return (
              <Link
                key={sphere.slug}
                href={`/esferas/${sphere.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-background/10 px-4 py-2 text-xs font-semibold text-primary-foreground backdrop-blur transition-colors hover:bg-background/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {sphere.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="#pilares"
          className="group mt-12 inline-flex flex-col items-center text-primary-foreground/70 transition-colors hover:text-primary-foreground"
        >
          <span className="text-xs font-semibold tracking-wider uppercase transition-colors group-hover:text-primary-foreground">
            Role para explorar
          </span>
          <ChevronDown
            className="mt-1 size-4 animate-bounce text-primary-foreground/60 group-hover:text-primary-foreground"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
