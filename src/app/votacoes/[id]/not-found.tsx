import Link from "next/link";

export default function VotingNotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl flex-col gap-4 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Votação não encontrada</h1>
      <p className="text-sm text-muted-foreground">
        Esse registro não está no catálogo ilustrativo. Volte para a lista de votações.
      </p>
      <div className="flex flex-wrap gap-4 text-sm font-medium">
        <Link
          href="/votacoes"
          className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Ir para votações
        </Link>
        <Link
          href="/"
          className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Página inicial
        </Link>
      </div>
    </main>
  );
}
