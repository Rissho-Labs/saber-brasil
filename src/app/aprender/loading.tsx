export default function AprenderLoading() {
  return (
    <main className="min-h-screen bg-background" aria-busy="true" aria-live="polite">
      <p className="sr-only">Carregando trilhas didáticas e simulador de match.</p>

      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-80 max-w-full animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-full max-w-2xl animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-2/3 max-w-xl animate-pulse rounded-md bg-muted" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="h-9 w-36 animate-pulse rounded-lg border border-border bg-card" />
            <div className="h-9 w-48 animate-pulse rounded-lg border border-border bg-card" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        {/* Trail deck — catalog rail + stage */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-96 max-w-full animate-pulse rounded-md bg-muted" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <aside className="space-y-2 lg:col-span-4">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="space-y-2 rounded-xl border border-border bg-card p-3"
                >
                  <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
                  <div className="h-3 w-full animate-pulse rounded-md bg-muted" />
                  <div className="flex gap-2">
                    <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
                    <div className="h-5 w-14 animate-pulse rounded-md bg-muted" />
                  </div>
                </div>
              ))}
            </aside>
            <div className="space-y-4 lg:col-span-8">
              <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="size-8 animate-pulse rounded-full bg-muted" />
                ))}
              </div>
              <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                <div className="h-6 w-3/4 max-w-md animate-pulse rounded-md bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
                </div>
                <div className="h-20 animate-pulse rounded-lg border border-border bg-muted/40" />
                <div className="h-16 animate-pulse rounded-lg border border-border bg-muted/40" />
                <div className="flex justify-between gap-3 pt-2">
                  <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
                  <div className="h-9 w-36 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vote-match simulator */}
        <div className="space-y-4 border-t border-border pt-12">
          <div className="space-y-2">
            <div className="h-6 w-64 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-full max-w-xl animate-pulse rounded-md bg-muted" />
          </div>
          <div className="h-16 animate-pulse rounded-xl border border-border bg-muted/40" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="h-8 w-24 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
              <div className="space-y-3 rounded-xl border border-border bg-card p-5">
                <div className="h-5 w-28 animate-pulse rounded-md bg-muted" />
                <div className="h-6 w-3/4 animate-pulse rounded-md bg-muted" />
                <div className="h-16 animate-pulse rounded-md bg-muted" />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="h-10 animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-3 lg:col-span-7">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="space-y-3 rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex justify-between gap-3">
                    <div className="space-y-2">
                      <div className="h-5 w-40 animate-pulse rounded-md bg-muted" />
                      <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />
                    </div>
                    <div className="h-8 w-14 animate-pulse rounded-md bg-muted" />
                  </div>
                  <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
