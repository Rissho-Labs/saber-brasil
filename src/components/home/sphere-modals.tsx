"use client";

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

export function SphereCard() {
  const { activeSphere } = useSphereSelection();
  const active = HOME_SPHERES.find((sphere) => sphere.type === activeSphere) ?? HOME_SPHERES[0];

  return (
    <div
      id={active.anchor}
      role="tabpanel"
      aria-labelledby={`sphere-tab-${active.anchor}`}
      tabIndex={0}
      className="rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="border-border/80 bg-background text-left shadow-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{active.title}</CardTitle>
            <Badge variant="outline">{active.type}</Badge>
          </div>
          <CardDescription>{active.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-sm font-medium">Indicadores de cobertura</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {active.indicators.map((indicator) => (
                <li key={indicator}>{indicator}</li>
              ))}
            </ul>
          </div>
          <p>
            <Link
              href={`/busca?sphere=${active.type}`}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Filtrar busca em {active.label}
            </Link>
          </p>
        </CardContent>
      </Card>
      <p className="sr-only" aria-live="polite">
        Esfera selecionada: {active.label}. {active.description}
      </p>
    </div>
  );
}
