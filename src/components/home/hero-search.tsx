import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const quickFilters = ["Câmara", "Senado", "Melhor Avaliados", "São Paulo"];

export function HeroSearch() {
  return (
    <section className="bg-muted/40 border-b border-border py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
          Transparência real para quem quer decidir.
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
          Acompanhe gastos, presença, histórico de votações e avaliação pública dos seus representantes.
        </p>

        {/* Formulário de Busca Semântico */}
        <form action="/busca" method="GET" className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              name="q"
              aria-label="Buscar representante ou projeto"
              placeholder="Busque por nome, partido ou estado..."
              className="pl-9 h-11 bg-background"
            />
          </div>
          <Button type="submit" size="lg" className="h-11 px-6">
            Buscar
          </Button>
        </form>

        {/* Filtros Rápido em Botões Acessíveis */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-muted-foreground">Em alta:</span>
          {quickFilters.map((filter) => (
            <Button
              key={filter}
              variant="outline"
              size="xs"
              type="button"
              className="rounded-full"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}