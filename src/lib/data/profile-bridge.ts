import { getPoliticianById } from "@/lib/data/politicians";
import { getPublicProfileById } from "@/lib/services/profiles";
import type { DigitalChannel, Politician, UnifiedProfileView } from "@/types/politician";
import type { PublicProfile } from "@/types";

function fromCatalog(politician: Politician): UnifiedProfileView {
  return {
    id: politician.id,
    name: politician.name,
    civilName: politician.civilName,
    party: politician.party,
    state: politician.state,
    role: politician.role,
    currentRole: politician.role === "senador" ? "Senador(a)" : "Deputado(a)",
    photoUrl: politician.photoUrl,
    email: politician.email,
    phone: politician.phone,
    biographySummary: politician.biographySummary ?? null,
    digitalChannels: [...(politician.digitalChannels ?? [])],
    metrics: { ...politician.metrics },
    source: "catalog",
    catalogId: politician.id,
    supabaseId: null,
  };
}

function institutionalFallback(profile: PublicProfile): DigitalChannel[] {
  return [
    {
      platform: "official_portal",
      label: "Portal institucional",
      url: "https://www.gov.br/",
      verified: false,
    },
  ];
}

function fromSupabase(profile: PublicProfile): UnifiedProfileView {
  return {
    id: profile.id,
    name: profile.name,
    civilName: null,
    party: null,
    state: null,
    role: null,
    currentRole: profile.current_role,
    photoUrl: null,
    email: null,
    phone: null,
    biographySummary: null,
    digitalChannels: institutionalFallback(profile),
    metrics: null,
    source: "supabase",
    catalogId: null,
    supabaseId: profile.id,
  };
}

async function safeGetPublicProfileById(id: string): Promise<PublicProfile | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  try {
    return await getPublicProfileById(id);
  } catch {
    return null;
  }
}

/**
 * Resolves a unified politician view from the mock catalog first, then Supabase.
 * Returns `null` when neither source has the id or Supabase is unavailable.
 */
export async function resolveUnifiedPolitician(id: string): Promise<UnifiedProfileView | null> {
  const trimmed = id.trim();
  if (!trimmed) {
    return null;
  }

  const catalog = await getPoliticianById(trimmed);
  if (catalog) {
    return fromCatalog(catalog);
  }

  const supabaseProfile = await safeGetPublicProfileById(trimmed);
  if (supabaseProfile) {
    return fromSupabase(supabaseProfile);
  }

  return null;
}
