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

const changeEmailSchema = z.string().trim().email().max(254);

export async function changeEmail(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = changeEmailSchema.safeParse(email);
  if (!parsed.success) {
    return { ok: false, error: "Informe um e-mail válido." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { ok: false, error: "Entre novamente para alterar o e-mail." };
  }

  const providers = (data.user.identities ?? []).map((identity) => identity.provider);
  const hasEmailIdentity = providers.includes("email");
  const googleOnly = providers.includes("google") && !hasEmailIdentity;
  if (googleOnly) {
    return { ok: false, error: "Contas que entram só com Google alteram o e-mail no Google." };
  }

  if (data.user.email?.toLowerCase() === parsed.data.toLowerCase()) {
    return { ok: false, error: "Esse já é o e-mail desta conta." };
  }

  const { error: updateError } = await supabase.auth.updateUser({ email: parsed.data });
  if (updateError) {
    const message = updateError.message.toLowerCase();
    if (message.includes("already") || message.includes("registered") || message.includes("exists")) {
      return { ok: false, error: "Esse e-mail já está em uso." };
    }
    return { ok: false, error: "Não foi possível enviar a confirmação." };
  }

  return { ok: true };
}
