"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(72),
    password: z.string().min(8).max(72),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword);

export async function changePassword(
  currentPassword: string,
  password: string,
  confirmPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = changePasswordSchema.safeParse({
    currentPassword,
    password,
    confirmPassword,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "A nova senha precisa ter entre 8 e 72 caracteres e coincidir com a confirmação.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) {
    return { ok: false, error: "Entre novamente para alterar a senha." };
  }

  if (data.user.app_metadata.provider === "google") {
    return { ok: false, error: "Contas Google não usam senha neste aplicativo." };
  }

  const { error: currentError } = await supabase.auth.signInWithPassword({
    email: data.user.email,
    password: parsed.data.currentPassword,
  });

  if (currentError) {
    return { ok: false, error: "A senha atual não confere." };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (updateError) {
    return { ok: false, error: "Não foi possível alterar a senha." };
  }

  return { ok: true };
}
