import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HeroSearch() {
  return (
    <section className="border-b border-border bg-muted/40 px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          Transparência real para quem quer decidir.
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
          Acompanhe gastos, presença, histórico de votações e avaliação pública dos seus representantes.
        </p>

        <form action="/busca" method="GET" className="mx-auto flex max-w-2xl flex-col gap-2 pt-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              name="q"
              aria-label="Buscar representante ou projeto"
              placeholder="Busque por nome, partido ou estado..."
              className="h-11 bg-background pl-9"
            />
          </div>
          <Button type="submit" size="lg" className="h-11 px-6">
            Buscar
          </Button>
        </form>
      </div>
    </section>
  );
}
