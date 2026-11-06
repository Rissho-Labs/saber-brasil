export default function PoliticianProfileLoading() {
  return (
    <main className="min-h-screen bg-background py-8" aria-busy="true" aria-live="polite">
      <p className="sr-only">Carregando perfil do parlamentar.</p>
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />

        {/* Header card */}
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:flex-row sm:gap-8 sm:p-8">
          <div className="size-28 shrink-0 animate-pulse rounded-2xl bg-muted sm:size-32" />
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
              <div className="h-5 w-20 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-8 w-64 max-w-full animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-48 max-w-full animate-pulse rounded-md bg-muted" />
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-56 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-36 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="space-y-3">
          <div className="h-6 w-28 animate-pulse rounded-md bg-muted" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-xl border border-border bg-muted/60"
              />
            ))}
          </div>
        </div>

        {/* Activity tabs */}
        <div className="space-y-4">
          <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
          <div className="flex flex-wrap gap-2 border-b border-border pb-2">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-9 w-40 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
          <div className="space-y-3">
            <div className="h-28 animate-pulse rounded-xl border border-border bg-muted/60" />
            <div className="h-28 animate-pulse rounded-xl border border-border bg-muted/60" />
          </div>
        </div>
      </div>
    </main>
  );
}
