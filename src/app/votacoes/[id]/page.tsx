import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import {
  IndividualVotesList,
  PartyAlignmentTable,
  VotingHeader,
} from "@/components/votings";
import {
  getIndividualVotes,
  getPartyBreakdown,
  getVotingById,
} from "@/lib/data/votings";

interface PageProps {
  params: Promise<{ id: string }>;
}

const idSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-zA-Z0-9_-]+$/);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const raw = (await params).id;
  const parsed = idSchema.safeParse(raw);
  if (!parsed.success) {
    return { title: "Votação | SABER Brasil" };
  }

  const voting = await getVotingById(parsed.data);
  if (!voting) {
    return { title: "Votação não encontrada | SABER Brasil" };
  }

  return {
    title: `${voting.billCode} — ${voting.title} | SABER Brasil`,
    description: voting.plainSummary,
  };
}

export default async function VotingDetailPage({ params }: PageProps) {
  const raw = (await params).id;
  const parsed = idSchema.safeParse(raw);
  if (!parsed.success) {
    notFound();
  }

  const id = parsed.data;
  const [voting, partyBreakdown, individualVotes] = await Promise.all([
    getVotingById(id),
    getPartyBreakdown(id),
    getIndividualVotes(id),
  ]);

  if (!voting) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <VotingHeader voting={voting} />

        <section aria-labelledby="party-alignment-heading" className="space-y-4">
          <h2 id="party-alignment-heading" className="text-lg font-semibold tracking-tight">
            Alinhamento partidário
          </h2>
          <PartyAlignmentTable rows={partyBreakdown} />
        </section>

        <section aria-labelledby="individual-votes-heading" className="space-y-4">
          <div className="space-y-1">
            <h2 id="individual-votes-heading" className="text-lg font-semibold tracking-tight">
              Votos individuais
            </h2>
            <p className="text-sm text-muted-foreground">
              Amostra ilustrativa de parlamentares do catálogo. Filtre por nome, partido, UF ou
              posição.
            </p>
          </div>
          <IndividualVotesList votes={individualVotes} />
        </section>
      </div>
    </main>
  );
}
