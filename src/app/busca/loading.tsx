export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-background" aria-busy="true" aria-live="polite">
      <p className="sr-only">Carregando resultados da busca.</p>
      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-muted" />
          <div className="grid gap-3 sm:grid-cols-[1fr_14rem_auto]">
            <div className="h-11 animate-pulse rounded-lg bg-muted" />
            <div className="h-11 animate-pulse rounded-lg bg-muted" />
            <div className="h-11 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <li key={index} className="h-48 animate-pulse rounded-xl border-2 border-border bg-muted/60" />
          ))}
        </ul>
      </section>
    </main>
  );
}
