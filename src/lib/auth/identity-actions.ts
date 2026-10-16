"use server";

import { createClient } from "@/lib/supabase/server";

export async function unlinkGoogle(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { ok: false, error: "Entre novamente para desconectar o Google." };
  }

  const identities = data.user.identities ?? [];
  const google = identities.find((identity) => identity.provider === "google");
  const hasEmailIdentity = identities.some((identity) => identity.provider === "email");

  if (!google) {
    return { ok: false, error: "Nenhuma conta Google está conectada." };
  }

  if (!hasEmailIdentity) {
    return { ok: false, error: "Mantenha o Google conectado. Ele é a única forma de entrar nesta conta." };
  }

  const { error: unlinkError } = await supabase.auth.unlinkIdentity(google);
  if (unlinkError) {
    return { ok: false, error: "Não foi possível desconectar o Google." };
  }

  return { ok: true };
}
