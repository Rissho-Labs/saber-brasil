import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { AlertBadge, ProfileStatus, PublicProfile, SphereType } from "@/types";

const FEATURED_LIMIT = 4;

const featuredProfileSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
  name: z.string().min(1),
  sphere: z.enum(SphereType),
  current_role: z.string().nullable(),
  status: z.enum(ProfileStatus),
  badge: z.enum(AlertBadge),
  carisma_rating: z.coerce.number(),
  gestao_score: z.coerce.number(),
  created_at: z.string().min(1),
});

const SPHERES = [
  SphereType.POLITICA,
  SphereType.JUDICIARIO,
  SphereType.ACADEMIA,
  SphereType.SEGURANCA,
] as const;

export type FeaturedProfilesBySphere = Record<SphereType, PublicProfile[]>;

function emptyFeaturedProfiles(): FeaturedProfilesBySphere {
  return {
    [SphereType.POLITICA]: [],
    [SphereType.JUDICIARIO]: [],
    [SphereType.ACADEMIA]: [],
    [SphereType.SEGURANCA]: [],
  };
}

function parseFeaturedRows(rows: unknown): PublicProfile[] {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.flatMap((row) => {
    const parsed = featuredProfileSchema.safeParse(row);
    return parsed.success ? [parsed.data] : [];
  });
}

export async function getPublicProfiles(query?: string): Promise<PublicProfile[]> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    let request = supabase.from("public_profiles").select("*");

    if (query) {
      const token = query.replace(/[%_\\"]/g, "").trim();
      if (!token) {
        return [];
      }

      const pattern = `%${token}%`;
      request = request.or(`name.ilike."${pattern}",current_role.ilike."${pattern}"`);
    }

    const { data, error } = await request;

    if (!error && data) {
      return data as PublicProfile[];
    }
  }

  // Retorno de fallback/mock local
  return [];
}

export async function getPublicProfileById(id: string): Promise<PublicProfile | null> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data, error } = await supabase
      .from("public_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      return data as PublicProfile;
    }
  }

  return null;
}

export async function getFeaturedProfilesBySphere(): Promise<FeaturedProfilesBySphere> {
  const grouped = emptyFeaturedProfiles();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return grouped;
  }

  const results = await Promise.all(
    SPHERES.map(async (sphere) => {
      const { data, error } = await supabase
        .from("public_profiles")
        .select("id,name,sphere,current_role,status,badge,carisma_rating,gestao_score,created_at")
        .eq("sphere", sphere)
        .order("gestao_score", { ascending: false })
        .order("carisma_rating", { ascending: false })
        .limit(FEATURED_LIMIT);

      const profiles = error ? [] : parseFeaturedRows(data);
      return [sphere, profiles] as [SphereType, PublicProfile[]];
    }),
  );

  for (const [sphere, profiles] of results) {
    grouped[sphere] = profiles;
  }

  return grouped;
}