"use client";

import { useCallback, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/components/ui/search-input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VotingCategory, VotingOutcome } from "@/types/voting";

const CATEGORY_OPTIONS: readonly VotingCategory[] = [
  "Economia",
  "Saúde",
  "Educação",
  "Segurança",
  "Meio Ambiente",
  "Administração Pública",
];

const OUTCOME_OPTIONS: { value: VotingOutcome; label: string }[] = [
  { value: "Approved", label: "Aprovado" },
  { value: "Rejected", label: "Rejeitado" },
  { value: "Pending", label: "Em Pauta" },
];

export function VotingFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const outcome = searchParams.get("outcome") ?? "";
  const hasActiveFilters = Boolean(query || category || outcome);

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
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))_auto] lg:items-end"
      aria-busy={isPending || undefined}
    >
      <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
        <label htmlFor="voting-q" className="text-sm font-medium text-foreground">
          Buscar
        </label>
        <SearchInput
          id="voting-q"
          key={query}
          defaultValue={query}
          debounceMs={300}
          placeholder="Código, título ou tema…"
          aria-label="Buscar votações por código, título ou tema"
          onDebouncedChange={(value) => {
            const next = value.trim();
            if (next === query.trim()) {
              return;
            }
            setParam("q", next);
          }}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="voting-category" className="text-sm font-medium text-foreground">
          Categoria
        </label>
        <select
          id="voting-category"
          value={category}
          onChange={(event) => setParam("category", event.target.value)}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Todas</option>
          {CATEGORY_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="voting-outcome" className="text-sm font-medium text-foreground">
          Resultado
        </label>
        <select
          id="voting-outcome"
          value={outcome}
          onChange={(event) => setParam("outcome", event.target.value)}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Todos</option>
          {OUTCOME_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters ? (
        <div className="flex items-end">
          <Link
            href="/votacoes"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 w-full lg:w-auto")}
          >
            Limpar filtros
          </Link>
        </div>
      ) : (
        <div className="hidden lg:block" aria-hidden="true" />
      )}
    </div>
  );
}
