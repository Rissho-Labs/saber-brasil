import Link from "next/link";
import { z } from "zod";
import { IndicatorCard } from "@/components/indicadores/indicator-card";
import { buttonVariants } from "@/components/ui/button";
import {
  filterIndicators,
  INDICATOR_CATEGORIES,
  type IndicatorCategoryId,
} from "@/lib/indicadores/catalog";
import { cn } from "@/lib/utils";

interface IndicadoresPageProps {
  searchParams: Promise<{
    categoria?: string | string[];
  }>;
}

const categorySchema = z.enum([
  "todos",
  "ambiente",
  "infraestrutura",
  "trabalho",
  "gestao",
]);

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

export default async function IndicadoresPage({ searchParams }: IndicadoresPageProps) {
  const params = await searchParams;
  const parsed = categorySchema.safeParse(firstParam(params.categoria));
  const category: IndicatorCategoryId = parsed.success ? parsed.data : "todos";
  const items = filterIndicators(category);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Indicadores públicos e impacto social
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Catálogo ilustrativo. Os valores não são lidos ao vivo do IBGE, do INPE, do DATASUS,
            do Portal da Transparência nem das auditorias citadas.
          </p>
          <nav aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
            {INDICATOR_CATEGORIES.map((option) => (
              <Link
                key={option.id}
                href={option.id === "todos" ? "/indicadores" : `/indicadores?categoria=${option.id}`}
                aria-current={category === option.id ? "page" : undefined}
                className={cn(
                  buttonVariants({
                    variant: category === option.id ? "default" : "outline",
                    size: "sm",
                  }),
                )}
              >
                {option.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-sm font-medium text-muted-foreground">
          {items.length === 1 ? "1 indicador" : `${items.length} indicadores`}
        </h2>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum indicador nesta categoria.</p>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {items.map((item) => (
              <li key={item.id}>
                <IndicatorCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
