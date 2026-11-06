"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/components/ui/search-input";
import type { BrazilianUF, PoliticianRole } from "@/types/politician";

const ROLE_OPTIONS: { value: PoliticianRole; label: string }[] = [
  { value: "deputado", label: "Deputado(a)" },
  { value: "senador", label: "Senador(a)" },
];

export interface PoliticianFiltersProps {
  parties: readonly string[];
  states: readonly BrazilianUF[];
}

export function PoliticianFilters({ parties, states }: PoliticianFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const query = searchParams.get("q") ?? "";
  const party = searchParams.get("party") ?? "";
  const state = searchParams.get("state") ?? "";
  const role = searchParams.get("role") ?? "";

  const replaceParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  function setParam(key: string, value: string) {
    replaceParams((params) => {
      const trimmed = value.trim();
      if (!trimmed) {
        params.delete(key);
      } else {
        params.set(key, trimmed);
      }
    });
  }

  return (
    <div
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:items-end"
      aria-busy={isPending || undefined}
    >
      <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
        <label htmlFor="politician-q" className="text-sm font-medium">
          Buscar
        </label>
        <SearchInput
          id="politician-q"
          key={query}
          defaultValue={query}
          debounceMs={300}
          placeholder="Nome, partido ou UF…"
          aria-label="Buscar políticos por nome, partido ou UF"
          onDebouncedChange={(value) => {
            const next = value.trim();
            const current = query.trim();
            if (next === current) {
              return;
            }
            setParam("q", next);
          }}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="politician-state" className="text-sm font-medium">
          Estado (UF)
        </label>
        <select
          id="politician-state"
          value={state}
          onChange={(event) => setParam("state", event.target.value)}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Todos</option>
          {states.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="politician-party" className="text-sm font-medium">
          Partido
        </label>
        <select
          id="politician-party"
          value={party}
          onChange={(event) => setParam("party", event.target.value)}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Todos</option>
          {parties.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="politician-role" className="text-sm font-medium">
          Cargo
        </label>
        <select
          id="politician-role"
          value={role}
          onChange={(event) => setParam("role", event.target.value)}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Todos</option>
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
