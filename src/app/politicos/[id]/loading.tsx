export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-background py-8" aria-busy="true" aria-live="polite">
      <p className="sr-only">Carregando perfil do representante.</p>
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="h-36 animate-pulse rounded-xl border-2 border-border bg-muted/60" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="h-32 animate-pulse rounded-xl border border-border bg-muted/60" />
          <div className="h-32 animate-pulse rounded-xl border border-border bg-muted/60" />
        </div>
        <div className="h-24 animate-pulse rounded-xl border border-border bg-muted/60" />
        <div className="h-12 w-48 animate-pulse rounded-lg bg-muted" />
      </div>
    </main>
  );
}
