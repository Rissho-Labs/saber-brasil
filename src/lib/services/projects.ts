import { PublicProject, WeightScore } from "@/types";
import { supabase } from "@/lib/supabase";

const PROJECT_COLUMNS =
  "id, profile_id, title, description, institutional_weight, citizen_weight, status, source_url";

function isWeightScore(value: unknown): value is WeightScore {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

function toPublicProject(
  row: Record<string, unknown>,
  profileId: string
): PublicProject | null {
  if (
    typeof row.id !== "string" ||
    typeof row.title !== "string" ||
    typeof row.source_url !== "string"
  ) {
    return null;
  }

  return {
    id: row.id,
    profile_id: typeof row.profile_id === "string" ? row.profile_id : profileId,
    title: row.title,
    description: typeof row.description === "string" ? row.description : null,
    institutional_weight: isWeightScore(row.institutional_weight)
      ? row.institutional_weight
      : null,
    citizen_weight: isWeightScore(row.citizen_weight) ? row.citizen_weight : null,
    status: typeof row.status === "string" ? row.status : null,
    source_url: row.source_url,
  };
}

function mockProjects(profileId: string): PublicProject[] {
  return [
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
      profile_id: profileId,
      title: "PL — Transparência de emendas parlamentares",
      description:
        "Obriga a publicação mensal da execução de emendas vinculadas ao mandato.",
      institutional_weight: 4,
      citizen_weight: 5,
      status: "EM_TRAMITACAO",
      source_url: "https://www.camara.leg.br/",
    },
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
      profile_id: profileId,
      title: "PL — Dados abertos de votações nominais",
      description:
        "Padroniza a disponibilização das votações nominais em formato aberto.",
      institutional_weight: 3,
      citizen_weight: 4,
      status: "APROVADO",
      source_url: "https://www.senado.leg.br/",
    },
  ];
}

export async function getProjectsByProfileId(
  profileId: string
): Promise<PublicProject[]> {
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!hasSupabase) {
    return mockProjects(profileId);
  }

  try {
    const { data, error } = await supabase
      .from("public_projects")
      .select(PROJECT_COLUMNS)
      .eq("profile_id", profileId);

    if (error || !data) {
      return mockProjects(profileId);
    }

    return data.flatMap((row) => {
      const project = toPublicProject(row, profileId);
      return project ? [project] : [];
    });
  } catch {
    return mockProjects(profileId);
  }
}
