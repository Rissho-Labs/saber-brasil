export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-background" aria-busy="true" aria-live="polite">
      <p className="sr-only">Carregando resultados da busca.</p>
      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="h-8 w-80 max-w-full animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded-md bg-muted" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_12rem_12rem_auto]">
            <div className="h-11 animate-pulse rounded-lg bg-muted sm:col-span-2 lg:col-span-1" />
            <div className="h-11 animate-pulse rounded-lg bg-muted" />
            <div className="h-11 animate-pulse rounded-lg bg-muted" />
            <div className="h-11 animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-10 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {Array.from({ length: 3 }, (_, section) => (
          <div key={section} className="space-y-4 rounded-xl border border-border p-4 sm:p-6">
            <div className="h-6 w-56 animate-pulse rounded-md bg-muted" />
            <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
              {Array.from({ length: 2 }, (_, card) => (
                <li key={card} className="h-40 animate-pulse rounded-xl border-2 border-border bg-muted/60" />
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
