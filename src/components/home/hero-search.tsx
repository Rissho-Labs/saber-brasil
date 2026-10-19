import Link from "next/link";
import { GraduationCap, Landmark, Scale, Search, Shield } from "lucide-react";
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
      className="hero-mesh relative isolate overflow-x-clip border-b border-white/10 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="hero-mesh-layer" aria-hidden="true">
        <span className="hero-mesh-blob hero-mesh-blob--green" />
        <span className="hero-mesh-blob hero-mesh-blob--gold" />
        <span className="hero-mesh-blob hero-mesh-blob--cyan" />
        <svg className="hero-mesh-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="rgba(34, 197, 94, 0.18)"
            d="M0,192L80,176C160,160,320,128,480,133.3C640,139,800,181,960,186.7C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
          <path
            fill="rgba(234, 179, 8, 0.12)"
            d="M0,256L80,245.3C160,235,320,213,480,208C640,203,800,213,960,224C1120,235,1280,245,1360,250.7L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl space-y-7 text-center">
        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-[0.2em] text-emerald-200/90 uppercase">
            SABER Brasil
          </p>
          <h1
            id="hero-heading"
            className="text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Transparência real para quem quer decidir.
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-200 sm:text-lg">
            Acompanhe gastos, presença, histórico de votações e avaliação pública dos seus
            representantes.
          </p>
        </div>

        <form
          action="/busca"
          method="GET"
          className="mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:p-2"
        >
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-300"
              aria-hidden="true"
            />
            <Input
              type="search"
              name="q"
              aria-label="Buscar representante ou projeto"
              placeholder="Buscar políticos, processos, pesquisas ou segurança pública..."
              className="h-11 border-white/20 bg-white/95 pl-9 text-slate-900 placeholder:text-slate-500 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/40"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-11 shrink-0 bg-emerald-500 px-6 text-slate-950 hover:bg-emerald-400"
          >
            Buscar
          </Button>
        </form>

        <nav aria-label="Atalhos das esferas" className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2">
          {SPHERE_PAGES.map((sphere) => {
            const Icon = SPHERE_ICONS[sphere.slug];
            return (
              <Link
                key={sphere.slug}
                href={`/esferas/${sphere.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/35 px-3.5 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-sm transition-colors hover:border-emerald-300/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                <Icon className="size-4 shrink-0 text-emerald-200" aria-hidden="true" />
                {sphere.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
