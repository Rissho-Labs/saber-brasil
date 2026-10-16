"use server";

import { z } from "zod";
import { verifyTurnstileToken } from "@/lib/auth/verify-turnstile";

const tokenSchema = z.string().trim().min(1).max(2048);

export async function assertTurnstile(
  token: string | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (token === null || token === "") {
    return verifyTurnstileToken(null);
  }

  const parsed = tokenSchema.safeParse(token);
  if (!parsed.success) {
    return { ok: false, error: "Verificação anti-bot inválida." };
  }

  return verifyTurnstileToken(parsed.data);
}
