"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { buttonVariants } from "@/components/ui/button";
import {
  MAX_COMPARED_POLITICIANS,
  MIN_COMPARED_POLITICIANS,
} from "@/lib/data/comparison";
import { cn } from "@/lib/utils";
import type { Politician, PoliticianRole } from "@/types/politician";

const ROLE_LABEL: Record<PoliticianRole, string> = {
  deputado: "Deputado(a)",
  senador: "Senador(a)",
};

const PRESET_IDS = [
  "pol-dep-beatriz-rocha",
  "pol-dep-mariana-nunes",
  "pol-sen-paulo-nunes",
] as const;

export interface PoliticianSelectorProps {
  catalog: readonly Politician[];
  selectedIds: readonly string[];
}

function idsToQuery(ids: readonly string[]): string {
  return ids.join(",");
}

export function PoliticianSelector({ catalog, selectedIds }: PoliticianSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");

  const selected = useMemo(
    () =>
      selectedIds
        .map((id) => catalog.find((item) => item.id === id))
        .filter((item): item is Politician => Boolean(item)),
    [catalog, selectedIds],
  );

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const available = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("pt-BR");
    return catalog.filter((item) => {
      if (selectedSet.has(item.id)) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [item.name, item.party, item.state, item.role].some((field) =>
        field.toLocaleLowerCase("pt-BR").includes(needle),
      );
    });
  }, [catalog, query, selectedSet]);

  const atCapacity = selectedIds.length >= MAX_COMPARED_POLITICIANS;
  const needsMore = selectedIds.length < MIN_COMPARED_POLITICIANS;

  function replaceIds(next: readonly string[]) {
    const qs = next.length > 0 ? `?ids=${encodeURIComponent(idsToQuery(next))}` : "";
    startTransition(() => {
      router.replace(`${pathname}${qs}`, { scroll: false });
    });
  }

  function addPolitician(id: string) {
    if (selectedSet.has(id) || atCapacity) {
      return;
    }
    replaceIds([...selectedIds, id]);
    setQuery("");
  }

  function removePolitician(id: string) {
    replaceIds(selectedIds.filter((item) => item !== id));
  }

  function clearSelection() {
    replaceIds([]);
  }

  return (
    <div className="space-y-4" aria-busy={isPending || undefined}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-foreground">Seleção</h2>
          <p className="text-xs text-muted-foreground">
            Escolha de {MIN_COMPARED_POLITICIANS} a {MAX_COMPARED_POLITICIANS} parlamentares para
            comparar métricas objetivas.
          </p>
        </div>
        {selectedIds.length > 0 ? (
          <button
            type="button"
            onClick={clearSelection}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "focus-visible:ring-2 focus-visible:ring-primary",
            )}
          >
            Limpar seleção
          </button>
        ) : null}
      </div>

      {selected.length > 0 ? (
        <ul className="flex list-none flex-wrap gap-2 p-0" aria-label="Parlamentares selecionados">
          {selected.map((item) => (
            <li key={item.id}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground">
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">
                  {item.party} · {item.state} · {ROLE_LABEL[item.role]}
                </span>
                <button
                  type="button"
                  onClick={() => removePolitician(item.id)}
                  aria-label={`Remover ${item.name} da comparação`}
                  className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="compare-search" className="text-sm font-medium text-foreground">
          Buscar parlamentar
        </label>
        <SearchInput
          id="compare-search"
          value={query}
          debounceMs={150}
          disabled={atCapacity}
          placeholder={
            atCapacity
              ? "Limite de 4 alcançado"
              : "Nome, partido ou UF…"
          }
          aria-label="Buscar parlamentar para adicionar à comparação"
          onValueChange={setQuery}
        />
        {atCapacity ? (
          <p className="text-xs text-muted-foreground">
            Remova alguém da seleção para incluir outro parlamentar.
          </p>
        ) : null}
      </div>

      {!atCapacity ? (
        <ul
          className="max-h-56 list-none space-y-1 overflow-y-auto rounded-xl border border-border bg-card p-2"
          role="listbox"
          aria-label="Parlamentares disponíveis"
        >
          {available.length === 0 ? (
            <li className="px-3 py-4 text-sm text-muted-foreground">
              Nenhum parlamentar disponível com esse filtro.
            </li>
          ) : (
            available.slice(0, 12).map((item) => (
              <li key={item.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => addPolitician(item.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.party} · {item.state} · {ROLE_LABEL[item.role]}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}

      {needsMore ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          <p className="mb-2">
            Selecione pelo menos {MIN_COMPARED_POLITICIANS} parlamentares, ou use um atalho:
          </p>
          <Link
            href={`/comparar?ids=${encodeURIComponent(PRESET_IDS.join(","))}`}
            className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Preencher com Beatriz Rocha, Mariana Nunes e Paulo Nunes
          </Link>
        </div>
      ) : null}
    </div>
  );
}
