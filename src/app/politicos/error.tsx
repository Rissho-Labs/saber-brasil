"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PoliticosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[politicos]", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-lg flex-col items-start gap-4 px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-destructive">Erro no módulo Políticos</p>
        <h1 className="text-2xl font-bold tracking-tight">Não foi possível carregar esta página</h1>
        <p className="text-sm text-muted-foreground">
          Ocorreu uma falha ao buscar ou renderizar os dados parlamentares. Você pode tentar
          novamente ou voltar ao diretório.
        </p>
        {error.digest ? (
          <p className="font-mono text-xs text-muted-foreground">Ref: {error.digest}</p>
        ) : null}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="button" onClick={reset}>
            Tentar novamente
          </Button>
          <Link href="/politicos" className={cn(buttonVariants({ variant: "outline" }))}>
            Ir ao diretório
          </Link>
          <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
            Início
          </Link>
        </div>
      </section>
    </main>
  );
}
