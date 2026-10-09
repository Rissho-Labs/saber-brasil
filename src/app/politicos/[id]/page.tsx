import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/politicos/profile-header";
import { MetricsSummary } from "@/components/politicos/metrics-summary";
import { EvaluationForm } from "@/components/politicos/evaluation-form";
import { ProjectsList } from "@/components/politicos/projects-list";
import { getPublicProfileById } from "@/lib/services/profiles";
import { getProjectsByProfileId } from "@/lib/services/projects";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PoliticianDetailPage({ params }: PageProps) {
  const { id } = await params;
  const profile = await getPublicProfileById(id);

  if (!profile) {
    notFound();
  }

  const projects = await getProjectsByProfileId(profile.id);

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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

        <ProjectsList projects={projects} />

        <EvaluationForm profileId={profile.id} />
      </div>
    </main>
  );
}