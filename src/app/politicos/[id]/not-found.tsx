import Link from "next/link";

export default function PoliticianNotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-6xl flex-col gap-4 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Representante não encontrado</h1>
      <p className="text-sm text-muted-foreground">
        Esse perfil não está na base. Volte para a busca ou para a página inicial.
      </p>
      <div className="flex flex-wrap gap-4 text-sm font-medium">
        <Link href="/busca" className="text-primary underline-offset-4 hover:underline">
          Ir para a busca
        </Link>
        <Link href="/" className="text-primary underline-offset-4 hover:underline">
          Página inicial
        </Link>
      </div>
    </main>
  );
}
