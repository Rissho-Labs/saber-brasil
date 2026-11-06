import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { EvaluationPanel } from "@/components/evaluations/evaluation-panel";
import { MetricsSummary } from "@/components/politicos/metrics-summary";
import { ProfileHeader } from "@/components/politicos/profile-header";
import { ProjectsList } from "@/components/politicos/projects-list";
import { TopicBadges } from "@/components/politicos/topic-badges";
import { VotingPositions } from "@/components/politicos/voting-positions";
import {
  PoliticianActivityTabs,
  PoliticianHeader,
  PoliticianStats,
  type PoliticianSocialLink,
} from "@/components/politicians";
import { buttonVariants } from "@/components/ui/button";
import {
  getPoliticianById,
  getPoliticianExpenses,
  getPoliticianProposals,
  getPoliticianVotingHistory,
} from "@/lib/data/politicians";
import { getProjectsByProfileId } from "@/lib/services/projects";
import { getPublicProfileById } from "@/lib/services/profiles";
import { cn } from "@/lib/utils";
import type { Politician, PoliticianRole } from "@/types/politician";

interface PageProps {
  params: Promise<{ id: string }>;
}

const idSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-zA-Z0-9_-]+$/);

function chamberLinks(politician: Politician): PoliticianSocialLink[] {
  const house =
    politician.role === "deputado"
      ? {
          label: "Portal da Câmara",
          href: "https://www.camara.leg.br/",
        }
      : {
          label: "Portal do Senado",
          href: "https://www12.senado.leg.br/",
        };

  return [
    house,
    {
      label: "Portal da Transparência",
      href: "https://portaldatransparencia.gov.br/",
    },
  ];
}

const ROLE_META: Record<PoliticianRole, string> = {
  deputado: "Deputado(a) Federal",
  senador: "Senador(a)",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const parsed = idSchema.safeParse(rawId);
  if (!parsed.success) {
    return { title: "Político não encontrado | SABER Brasil" };
  }

  const politician = await getPoliticianById(parsed.data);
  if (politician) {
    return {
      title: `${politician.name} (${politician.party}-${politician.state}) | SABER Brasil`,
      description: `Perfil ilustrativo de ${politician.name}, ${ROLE_META[politician.role]} pelo ${politician.party}/${politician.state}.`,
    };
  }

  const profile = await getPublicProfileById(parsed.data);
  if (profile) {
    return {
      title: `${profile.name} | SABER Brasil`,
      description: `Perfil público de ${profile.name}${profile.current_role ? ` — ${profile.current_role}` : ""}.`,
    };
  }

  return { title: "Político não encontrado | SABER Brasil" };
}

async function CatalogProfile({ politician }: { politician: Politician }) {
  const [proposals, votings, expenses] = await Promise.all([
    getPoliticianProposals(politician.id),
    getPoliticianVotingHistory(politician.id),
    getPoliticianExpenses(politician.id),
  ]);

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div>
          <Link
            href="/politicos"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 mb-2")}
          >
            ← Voltar ao diretório
          </Link>
        </div>

        <PoliticianHeader politician={politician} socialLinks={chamberLinks(politician)} />
        <PoliticianStats metrics={politician.metrics} />
        <PoliticianActivityTabs
          proposals={proposals}
          votings={votings}
          expenses={expenses}
        />

        <p className="text-xs text-muted-foreground">
          Dados ilustrativos do catálogo SABER. Não constituem feed oficial da Câmara, do Senado
          ou do Portal da Transparência.
        </p>
      </div>
    </main>
  );
}

export default async function PoliticianDetailPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const parsed = idSchema.safeParse(rawId);
  if (!parsed.success) {
    notFound();
  }

  const id = parsed.data;
  const politician = await getPoliticianById(id);

  if (politician) {
    return <CatalogProfile politician={politician} />;
  }

  // Preserve existing PublicProfile detail for busca / esferas UUID links.
  const profile = await getPublicProfileById(id);
  if (!profile) {
    notFound();
  }

  const projects = await getProjectsByProfileId(profile.id);

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        <ProfileHeader
          name={profile.name}
          role={profile.current_role}
          sphere={profile.sphere}
          status={profile.status}
          badge={profile.badge}
        />

        <MetricsSummary
          carismaRating={profile.carisma_rating}
          gestaoScore={profile.gestao_score}
        />

        <TopicBadges />

        <ProjectsList projects={projects} />

        <VotingPositions profileId={profile.id} />

        <EvaluationPanel
          politician={{
            id: profile.id,
            name: profile.name,
            role: profile.current_role,
            photoUrl: null,
          }}
        />
      </div>
    </main>
  );
}
