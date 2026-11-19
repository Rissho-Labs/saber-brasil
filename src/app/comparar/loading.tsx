export default function CompararLoading() {
  return (
    <main className="min-h-screen bg-background" aria-busy="true" aria-live="polite">
      <p className="sr-only">Carregando comparação de políticos.</p>

      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-72 max-w-full animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-full max-w-2xl animate-pulse rounded-md bg-muted" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-8 w-40 animate-pulse rounded-full border border-border bg-card" />
            ))}
          </div>
          <div className="h-9 w-full max-w-xl animate-pulse rounded-md bg-muted" />
          <div className="h-40 w-full animate-pulse rounded-xl border border-border bg-card" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="h-4 w-48 animate-pulse rounded-md bg-muted" />
          <div className="h-6 w-72 max-w-full animate-pulse rounded-md bg-muted" />
          <div className="h-2.5 w-full animate-pulse rounded-full bg-muted" />
          <ul className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <li
                key={index}
                className="h-36 animate-pulse rounded-lg border border-border bg-background"
              />
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
          <div className="h-56 animate-pulse rounded-xl border border-border bg-card" />
        </div>

        <div className="space-y-4">
          <div className="h-6 w-64 animate-pulse rounded-md bg-muted" />
          <div className="h-72 animate-pulse rounded-xl border border-border bg-card" />
        </div>
      </div>
    </main>
  );
}
