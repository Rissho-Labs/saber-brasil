export default function VotacoesLoading() {
  return (
    <main className="min-h-screen bg-background" aria-busy="true" aria-live="polite">
      <p className="sr-only">Carregando diretório de votações.</p>

      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-80 max-w-full animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-full max-w-2xl animate-pulse rounded-md bg-muted" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))_auto]">
            <div className="h-9 animate-pulse rounded-md bg-muted sm:col-span-2 lg:col-span-1" />
            <div className="h-9 animate-pulse rounded-md bg-muted" />
            <div className="h-9 animate-pulse rounded-md bg-muted" />
            <div className="hidden h-9 animate-pulse rounded-md bg-muted lg:block" />
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="h-6 w-28 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
          </div>
          <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <li
                key={index}
                className="h-64 animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
