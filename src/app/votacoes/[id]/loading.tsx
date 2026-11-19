export default function VotingDetailLoading() {
  return (
    <main className="min-h-screen bg-background" aria-busy="true" aria-live="polite">
      <p className="sr-only">Carregando detalhe da votação.</p>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="h-5 w-44 animate-pulse rounded-md bg-muted" />
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
              <div className="h-6 w-28 animate-pulse rounded-md bg-muted" />
              <div className="h-6 w-20 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-9 w-full max-w-3xl animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-64 max-w-full animate-pulse rounded-md bg-muted" />
          </div>
          <div className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6">
            <div className="h-4 w-48 animate-pulse rounded-md bg-muted" />
            <div className="h-16 w-full animate-pulse rounded-md bg-muted" />
            <div className="grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
              <div className="h-10 animate-pulse rounded-md bg-muted" />
              <div className="h-10 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-6 w-40 animate-pulse rounded-md bg-muted" />
            <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-20 animate-pulse rounded-lg border border-border bg-card" />
              <div className="h-20 animate-pulse rounded-lg border border-border bg-card" />
              <div className="h-20 animate-pulse rounded-lg border border-border bg-card" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-6 w-52 animate-pulse rounded-md bg-muted" />
          <div className="h-48 animate-pulse rounded-xl border border-border bg-card" />
        </div>

        <div className="space-y-4">
          <div className="h-6 w-40 animate-pulse rounded-md bg-muted" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="h-9 animate-pulse rounded-md bg-muted" />
            <div className="h-9 animate-pulse rounded-md bg-muted" />
            <div className="h-9 animate-pulse rounded-md bg-muted" />
            <div className="h-9 animate-pulse rounded-md bg-muted" />
          </div>
          <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <li
                key={index}
                className="h-20 animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
