"use client";

import { useId } from "react";
import Link from "next/link";
import { HOME_SPHERES, useSphereSelection } from "@/components/home/sphere-selection";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SphereModals() {
  const baseId = useId();
  const { activeSphere } = useSphereSelection();
  const active = HOME_SPHERES.find((sphere) => sphere.type === activeSphere) ?? HOME_SPHERES[0];

  return (
    <section aria-labelledby={`${baseId}-heading`} className="space-y-4">
      <div className="space-y-1">
        <h2 id={`${baseId}-heading`} className="text-xl font-semibold tracking-tight">
          As 4 esferas
        </h2>
        <p className="text-sm text-muted-foreground">
          A esfera escolhida acima define o escopo institucional e o filtro da busca.
        </p>
      </div>

      {HOME_SPHERES.map((sphere) => {
        const selected = sphere.type === activeSphere;
        return (
          <div
            key={sphere.type}
            id={sphere.anchor}
            role="tabpanel"
            aria-labelledby={`sphere-tab-${sphere.anchor}`}
            hidden={!selected}
            tabIndex={0}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
          >
            <Card className="border-border/80">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle>{sphere.title}</CardTitle>
                  <Badge variant="outline">{sphere.type}</Badge>
                </div>
                <CardDescription>{sphere.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Indicadores de cobertura</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {sphere.indicators.map((indicator) => (
                      <li key={indicator}>{indicator}</li>
                    ))}
                  </ul>
                </div>
                <p>
                  <Link
                    href={`/busca?sphere=${sphere.type}`}
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Filtrar busca em {sphere.label}
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        );
      })}

      <p className="sr-only" aria-live="polite">
        Esfera selecionada: {active.label}. {active.description}
      </p>
    </section>
  );
}
