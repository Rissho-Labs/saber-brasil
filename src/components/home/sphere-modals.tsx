"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOME_SPHERES, useSphereSelection } from "@/components/home/sphere-selection";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sphereSlugForType } from "@/lib/esferas/catalog";

export function SphereCard() {
  const { activeSphere } = useSphereSelection();
  const active = HOME_SPHERES.find((sphere) => sphere.type === activeSphere) ?? HOME_SPHERES[0];
  const sphereHref = `/esferas/${sphereSlugForType(active.type)}`;

  return (
    <div
      id={active.anchor}
      role="tabpanel"
      aria-labelledby={`sphere-tab-${active.anchor}`}
      tabIndex={0}
      className="rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="rounded-2xl border-border bg-card text-left shadow-sm">
        <CardHeader className="gap-3 p-6 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span aria-hidden="true" className="text-2xl">
              {active.emoji}
            </span>
            <CardTitle className="text-xl font-extrabold tracking-tight text-foreground">
              {active.title}
            </CardTitle>
            <Badge variant="outline">{active.type}</Badge>
          </div>
          <CardDescription className="text-sm leading-relaxed text-muted-foreground">
            {active.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6 pt-0">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Indicadores de cobertura</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {active.indicators.map((indicator) => (
                <li key={indicator}>{indicator}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
            <Link
              href={sphereHref}
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
            >
              Ver detalhes da esfera
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <Link
              href={`/busca?sphere=${active.type}`}
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
            >
              Filtrar busca em {active.label}
            </Link>
          </div>
        </CardContent>
      </Card>
      <p className="sr-only" aria-live="polite">
        Esfera selecionada: {active.label}. {active.description}
      </p>
    </div>
  );
}
