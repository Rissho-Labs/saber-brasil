"use client";

import { useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MandateStatus, SphereType } from "@/types";

export const SEARCH_CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "politicos", label: "Políticos & Representantes" },
  { id: "votacoes", label: "Votações & Pautas" },
  { id: "publicacoes", label: "Publicações & Documentos" },
] as const;

export type SearchCategory = (typeof SEARCH_CATEGORIES)[number]["id"];

export function SearchCategoryTabs({
  category,
  query,
  sphere,
  status,
}: {
  category: SearchCategory;
  query: string;
  sphere?: SphereType;
  status?: MandateStatus;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectCategory(next: SearchCategory) {
    const params = new URLSearchParams();
    if (query) {
      params.set("q", query);
    }
    params.set("categoria", next);
    if (sphere) {
      params.set("sphere", sphere);
    }
    if (status) {
      params.set("status", status);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const current = SEARCH_CATEGORIES.findIndex((item) => item.id === category);
    if (current < 0) {
      return;
    }

    let nextIndex = current;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (current + 1) % SEARCH_CATEGORIES.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (current - 1 + SEARCH_CATEGORIES.length) % SEARCH_CATEGORIES.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = SEARCH_CATEGORIES.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const next = SEARCH_CATEGORIES[nextIndex];
    if (!next) {
      return;
    }
    selectCategory(next.id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Categorias da busca"
      className="grid w-full grid-cols-1 gap-1 rounded-xl border border-border bg-background p-1 shadow-sm sm:grid-cols-2 xl:grid-cols-4"
      onKeyDown={onKeyDown}
    >
      {SEARCH_CATEGORIES.map((item, index) => {
        const selected = item.id === category;
        return (
          <button
            key={item.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`search-tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`search-panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground hover:bg-muted"
            }`}
            onClick={() => selectCategory(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
