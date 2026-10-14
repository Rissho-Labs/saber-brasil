import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-6xl flex-col gap-4 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Página não encontrada</h1>
      <p className="text-sm text-muted-foreground">
        O endereço não corresponde a nenhuma página do SABER Brasil.
      </p>
      <Link href="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        Página inicial
      </Link>
    </main>
  );
}
