import { PublicProfile } from "@/types";
import { supabase } from "@/lib/supabase";

export async function getPublicProfiles(query?: string): Promise<PublicProfile[]> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    let request = supabase.from("public_profiles").select("*");

    if (query) {
      request = request.ilike("name", `%${query}%`);
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