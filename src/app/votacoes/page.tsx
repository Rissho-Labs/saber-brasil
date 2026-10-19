import Link from "next/link";
import { z } from "zod";
import { VotingCard } from "@/components/votacoes/voting-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { filterVotingsByStatus, VOTING_STATUSES, type VotingStatus } from "@/lib/search/catalog";

interface VotacoesPageProps {
  searchParams: Promise<{
    status?: string | string[];
  }>;
}

const statusSchema = z.enum(VOTING_STATUSES);

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

export default async function VotacoesPage({ searchParams }: VotacoesPageProps) {
  const params = await searchParams;
  const parsed = statusSchema.safeParse(firstParam(params.status));
  const status: VotingStatus | undefined = parsed.success ? parsed.data : undefined;
  const items = filterVotingsByStatus(status);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Tramitações e votações
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Catálogo ilustrativo de PECs e projetos de interesse público. Os placares e as datas
            não são lidos da Câmara nem do Senado.
          </p>
          <nav aria-label="Filtrar por status" className="flex flex-wrap gap-2">
            <Link
              href="/votacoes"
              aria-current={status ? undefined : "page"}
              className={cn(buttonVariants({ variant: status ? "outline" : "default", size: "sm" }))}
            >
              Todas
            </Link>
            {VOTING_STATUSES.map((option) => (
              <Link
                key={option}
                href={`/votacoes?status=${encodeURIComponent(option)}`}
                aria-current={status === option ? "page" : undefined}
                className={cn(
                  buttonVariants({
                    variant: status === option ? "default" : "outline",
                    size: "sm",
                  }),
                )}
              >
                {option}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-sm font-medium text-muted-foreground">
          {items.length === 1 ? "1 tramitação" : `${items.length} tramitações`}
        </h2>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma tramitação neste status.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id}>
                <VotingCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
