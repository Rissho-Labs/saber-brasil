"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const passwordSchema = z.string().min(8).max(72);

export async function changePassword(
  password: string,
  confirmPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success || password !== confirmPassword) {
    return { ok: false, error: "A senha precisa ter entre 8 e 72 caracteres e coincidir com a confirmação." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { ok: false, error: "Entre novamente para alterar a senha." };
  }

  if (data.user.app_metadata.provider === "google") {
    return { ok: false, error: "Contas Google não usam senha neste aplicativo." };
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: parsed.data });
  if (updateError) {
    return { ok: false, error: "Não foi possível alterar a senha." };
  }

  return { ok: true };
}
