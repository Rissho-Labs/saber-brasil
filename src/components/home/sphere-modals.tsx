"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SphereType } from "@/types";

const SPHERES = [
  {
    type: SphereType.POLITICA,
    anchor: "political",
    label: "Política",
    emoji: "🏛️",
    title: "Política (Executivo e Legislativo)",
    description:
      "Prefeitos, governadores, presidente, vereadores, deputados e senadores.",
    indicators: [
      "Mandatos do Executivo e do Legislativo",
      "Assiduidade e votações nominais",
      "Peso institucional frente ao peso cidadão",
    ],
  },
  {
    type: SphereType.JUDICIARIO,
    anchor: "judiciary",
    label: "Judiciário",
    emoji: "⚖️",
    title: "Judiciário e Controle",
    description:
      "Juízes, desembargadores, ministros (STF, STJ, TSE) e magistrados.",
    indicators: [
      "Magistratura e tribunais superiores",
      "Decisões colegiadas e fontes primárias",
      "Situação legal e badges de integridade",
    ],
  },
  {
    type: SphereType.ACADEMIA,
    anchor: "academia",
    label: "Academia",
    emoji: "🎓",
    title: "Academia e Gestão Pública",
    description:
      "Reitores, corpo docente, gestores de universidades públicas, editais e vestibulares.",
    indicators: [
      "Gestão de universidades públicas",
      "Editais e processos seletivos",
      "Corpo docente e administração",
    ],
  },
  {
    type: SphereType.SEGURANCA,
    anchor: "security",
    label: "Segurança",
    emoji: "🛡️",
    title: "Segurança Pública e Defesa",
    description:
      "Comandantes de polícia, delegados-gerais, secretários de segurança e lideranças operacionais.",
    indicators: [
      "Comando e delegacias-gerais",
      "Secretarias de segurança",
      "Lideranças operacionais",
    ],
  },
] as const;

function indexFromHash(hash: string): number {
  const anchor = hash.replace(/^#/, "");
  return SPHERES.findIndex((sphere) => sphere.anchor === anchor);
}

export function SphereModals() {
  const baseId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    function syncFromHash() {
      const index = indexFromHash(window.location.hash);
      if (index < 0) {
        return;
      }

      setActiveIndex(index);
      window.requestAnimationFrame(() => {
        document.getElementById(SPHERES[index].anchor)?.scrollIntoView({
          block: "nearest",
        });
      });
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function selectSphere(index: number, moveFocus: boolean) {
    setActiveIndex(index);
    const anchor = SPHERES[index].anchor;
    window.history.replaceState(null, "", `#${anchor}`);
    if (moveFocus) {
      tabRefs.current[index]?.focus();
    }
  }

  function onTabListKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const lastIndex = SPHERES.length - 1;
    let nextIndex = activeIndex;

    if (event.key === "ArrowRight") {
      nextIndex = activeIndex === lastIndex ? 0 : activeIndex + 1;
    } else if (event.key === "ArrowLeft") {
      nextIndex = activeIndex === 0 ? lastIndex : activeIndex - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    } else {
      return;
    }

    event.preventDefault();
    selectSphere(nextIndex, true);
  }

  const active = SPHERES[activeIndex];

  return (
    <section aria-labelledby={`${baseId}-heading`} className="space-y-4">
      <div className="space-y-1">
        <h2 id={`${baseId}-heading`} className="text-xl font-semibold tracking-tight">
          As 4 esferas
        </h2>
        <p className="text-sm text-muted-foreground">
          Escolha uma esfera para ver o escopo institucional e filtrar a busca.
          Use as setas do teclado para alternar entre as abas.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Esferas de cobertura"
        className="flex flex-wrap gap-2"
        onKeyDown={onTabListKeyDown}
      >
        {SPHERES.map((sphere, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={sphere.type}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${baseId}-tab-${sphere.anchor}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={sphere.anchor}
              tabIndex={selected ? 0 : -1}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
              onClick={() => selectSphere(index, false)}
            >
              <span aria-hidden="true">{sphere.emoji}</span>
              {sphere.label}
            </button>
          );
        })}
      </div>

      {SPHERES.map((sphere, index) => {
        const selected = index === activeIndex;
        return (
          <div
            key={sphere.type}
            id={sphere.anchor}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${sphere.anchor}`}
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
