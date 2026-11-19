"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { cn } from "@/lib/utils";
import type { UnifiedSearchCategory, UnifiedSearchResponse } from "@/types/home-hub";

export interface UnifiedSearchBarProps {
  initialQuery: string;
  activeCategory: UnifiedSearchCategory;
  countsByCategory: UnifiedSearchResponse["countsByCategory"];
}

const CATEGORY_TABS: ReadonlyArray<{
  value: UnifiedSearchCategory;
  label: string;
}> = [
  { value: "all", label: "Todas" },
  { value: "politicians", label: "Políticos" },
  { value: "votings", label: "Votações" },
  { value: "trails", label: "Trilhas" },
  { value: "spheres", label: "Esferas" },
];

function countFor(
  category: UnifiedSearchCategory,
  counts: UnifiedSearchResponse["countsByCategory"],
): number {
  if (category === "all") {
    return (
      counts.politicians + counts.votings + counts.trails + counts.spheres
    );
  }
  return counts[category];
}

export function UnifiedSearchBar({
  initialQuery,
  activeCategory,
  countsByCategory,
}: UnifiedSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const replaceParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams();
      if (initialQuery.trim()) {
        params.set("q", initialQuery.trim());
      }
      if (activeCategory !== "all") {
        params.set("categoria", activeCategory);
      }
      mutate(params);
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [activeCategory, initialQuery, pathname, router],
  );

  function setQuery(next: string) {
    const trimmed = next.trim();
    if (trimmed === initialQuery.trim()) {
      return;
    }
    replaceParams((params) => {
      if (!trimmed) {
        params.delete("q");
      } else {
        params.set("q", trimmed);
      }
    });
  }

  function setCategory(next: UnifiedSearchCategory) {
    if (next === activeCategory) {
      return;
    }
    replaceParams((params) => {
      if (next === "all") {
        params.delete("categoria");
      } else {
        params.set("categoria", next);
      }
    });
  }

  function clearSearch() {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  return (
    <div className="space-y-4" aria-busy={isPending || undefined}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-1.5">
          <label htmlFor="unified-search-q" className="text-sm font-medium text-foreground">
            Busca unificada
          </label>
          <SearchInput
            id="unified-search-q"
            key={initialQuery}
            defaultValue={initialQuery}
            debounceMs={300}
            placeholder="Políticos, votações, trilhas ou esferas…"
            aria-label="Buscar no hub unificado"
            className="focus-visible:ring-2 focus-visible:ring-primary"
            onDebouncedChange={setQuery}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={clearSearch}
          className="shrink-0 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Limpar busca
        </Button>
      </div>

      <div
        role="tablist"
        aria-label="Filtrar por categoria"
        className="flex flex-wrap gap-2"
      >
        {CATEGORY_TABS.map((tab) => {
          const selected = tab.value === activeCategory;
          const count = countFor(tab.value, countsByCategory);
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setCategory(tab.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                selected
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-xs tabular-nums",
                  selected ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
