import Link from "next/link";
import { BadgeCheck, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TrailTone = "emerald" | "amber" | "slate";

interface EducationalTrail {
  id: string;
  category: string;
  moduleLabel: string;
  title: string;
  description: string;
  progress: number;
  progressLabel: string;
  footerNote: string;
  ctaLabel: string;
  href: string;
  tone: TrailTone;
  ctaVariant: "primary" | "navy" | "outline";
}

const TRAILS: readonly EducationalTrail[] = [
  {
    id: "orcamento-publico",
    category: "Orçamento & Fiscalização",
    moduleLabel: "Módulo 3/5",
    title: "Como funciona o Orçamento Público?",
    description:
      "Entenda como são planejadas as Leis LOA, LDO, o destino das emendas parlamentares e como acompanhar cada centavo investido.",
    progress: 60,
    progressLabel: "60% concluído",
    footerNote: "Restam 2 aulas",
    ctaLabel: "Continuar • 10 min",
    href: "/busca?q=or%C3%A7amento",
    tone: "emerald",
    ctaVariant: "primary",
  },
  {
    id: "direitos-pratica",
    category: "Direito & Prática",
    moduleLabel: "Módulo 1/6",
    title: "Seus Direitos na Prática",
    description:
      "Guia acessível sobre a Constituição Cidadã de 1988, mandado de segurança, acesso à informação (LAI) e petições públicas.",
    progress: 15,
    progressLabel: "15% concluído",
    footerNote: "Introdução básica",
    ctaLabel: "Começar • 15 min",
    href: "/busca?q=direitos",
    tone: "amber",
    ctaVariant: "navy",
  },
  {
    id: "poderes-republica",
    category: "Estrutura Republicana",
    moduleLabel: "Não iniciado",
    title: "Poderes da República",
    description:
      "A separação dos poderes Executivo, Legislativo e Judiciário, pesos e contrapesos e como o equilíbrio federativo impacta o dia a dia.",
    progress: 0,
    progressLabel: "0% não iniciado",
    footerNote: "Curso introdutório",
    ctaLabel: "Iniciar • 8 min",
    href: "/busca?q=poderes",
    tone: "slate",
    ctaVariant: "outline",
  },
];

const CATEGORY_CLASS: Record<TrailTone, string> = {
  emerald: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  slate: "bg-blue-100 text-blue-800",
};

const PROGRESS_TEXT_CLASS: Record<TrailTone, string> = {
  emerald: "text-emerald-700",
  amber: "text-amber-700",
  slate: "text-muted-foreground",
};

const PROGRESS_BAR_CLASS: Record<TrailTone, string> = {
  emerald: "bg-emerald-700",
  amber: "bg-amber-500",
  slate: "bg-muted-foreground/40",
};

function TrailCta({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: EducationalTrail["ctaVariant"];
}) {
  if (variant === "outline") {
    return (
      <Button asChild variant="outline" size="sm" className="rounded-lg text-xs font-bold shadow-sm">
        <Link href={href}>{label}</Link>
      </Button>
    );
  }

  if (variant === "navy") {
    return (
      <Button
        asChild
        size="sm"
        className="rounded-lg bg-foreground text-xs font-bold text-background shadow-sm hover:bg-foreground/90"
      >
        <Link href={href}>{label}</Link>
      </Button>
    );
  }

  return (
    <Button
      asChild
      size="sm"
      className="rounded-lg bg-emerald-700 text-xs font-bold text-white shadow-sm hover:bg-emerald-800"
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}

export function EducationalTrails() {
  return (
    <section aria-labelledby="trilhas-heading" id="trilhas" className="scroll-mt-24 space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <p className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
            Capacitação Cidadã
          </p>
          <h2
            id="trilhas-heading"
            className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground"
          >
            <BookOpen className="size-5 text-emerald-700" aria-hidden="true" />
            1. Trilhas de Conhecimento
          </h2>
          <p className="text-sm text-muted-foreground">
            Aprenda sobre o funcionamento do Estado e seus direitos com módulos práticos e
            didáticos.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <BadgeCheck className="size-4 text-emerald-700" aria-hidden="true" />
          Certificados Gratuitos Inclusos
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TRAILS.map((trail) => (
          <li key={trail.id}>
            <Card className="flex h-full flex-col justify-between rounded-2xl border-border bg-card shadow-sm transition-colors hover:border-muted-foreground/30">
              <CardContent className="flex h-full flex-col justify-between space-y-6 p-6">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-semibold",
                        CATEGORY_CLASS[trail.tone],
                      )}
                    >
                      {trail.category}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {trail.moduleLabel}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold leading-snug text-foreground">{trail.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {trail.description}
                  </p>
                </div>

                <div className="space-y-4 border-t border-border pt-5">
                  <div>
                    <div className="mb-1.5 flex justify-between text-xs font-semibold text-muted-foreground">
                      <span>Progresso</span>
                      <span className={cn("font-bold", PROGRESS_TEXT_CLASS[trail.tone])}>
                        {trail.progressLabel}
                      </span>
                    </div>
                    <div
                      role="meter"
                      aria-label={`Progresso da trilha ${trail.title}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={trail.progress}
                      className="h-2 w-full overflow-hidden rounded-full bg-muted"
                    >
                      <div
                        className={cn("h-full rounded-full", PROGRESS_BAR_CLASS[trail.tone])}
                        style={{ width: `${trail.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-muted-foreground">
                      {trail.footerNote}
                    </span>
                    <TrailCta href={trail.href} label={trail.ctaLabel} variant={trail.ctaVariant} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
