export default function IndicadoresLoading() {
  return (
    <main className="min-h-screen bg-background" aria-busy="true" aria-live="polite">
      <p className="sr-only">Carregando indicadores de transparência.</p>

      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-80 max-w-full animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-full max-w-2xl animate-pulse rounded-md bg-muted" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="h-8 w-24 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <li
              key={index}
              className="h-28 animate-pulse rounded-xl border border-border bg-card"
            />
          ))}
        </ul>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />
          </div>
          <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <li
                key={index}
                className="h-56 animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </ul>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="h-6 w-72 max-w-full animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded-md bg-muted" />
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                <div className="h-2.5 w-full animate-pulse rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
