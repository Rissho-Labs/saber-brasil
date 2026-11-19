import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { UnifiedSearchItem } from "@/types/home-hub";
import type { UnifiedSearchCategory } from "@/types/home-hub";

export interface UnifiedSearchResultsProps {
  items: UnifiedSearchItem[];
  query: string;
}

const CATEGORY_LABEL: Record<Exclude<UnifiedSearchCategory, "all">, string> = {
  politicians: "Políticos",
  votings: "Votações",
  trails: "Trilhas",
  spheres: "Esferas",
};

const SUGGESTIONS = ["Saúde", "Economia", "Orçamento", "Plenário"] as const;

export function UnifiedSearchResults({ items, query }: UnifiedSearchResultsProps) {
  if (items.length === 0) {
    return (
      <section
        aria-label="Nenhum resultado"
        className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center"
      >
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Nenhum resultado encontrado
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          {query
            ? `Não há itens no hub unificado para “${query}” com o filtro atual.`
            : "Ajuste a busca ou experimente uma sugestão abaixo."}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Sugestões
          </span>
          {SUGGESTIONS.map((term) => (
            <Link
              key={term}
              href={`/busca?q=${encodeURIComponent(term)}`}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {term}
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Resultados da busca" className="space-y-3">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {items.length} {items.length === 1 ? "resultado" : "resultados"}
        {query ? ` para “${query}”` : ""}
      </p>
      <ul className="grid list-none gap-3 p-0">
        {items.map((item) => (
          <li key={`${item.category}-${item.id}`}>
            <Card className="border-border bg-card">
              <CardContent className="space-y-2 p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{CATEGORY_LABEL[item.category]}</Badge>
                  <Badge variant="category">{item.badge}</Badge>
                </div>
                <h2 className="text-base font-semibold tracking-tight">
                  <Link
                    href={item.href}
                    className="text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {item.title}
                  </Link>
                </h2>
                <p className="text-sm font-medium text-muted-foreground">{item.subtitle}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.plainSummary}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
