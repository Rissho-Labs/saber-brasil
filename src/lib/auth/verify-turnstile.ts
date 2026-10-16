import { z } from "zod";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const siteverifyResponseSchema = z.object({
  success: z.boolean(),
  "error-codes": z.array(z.string()).optional(),
});

const FAILURE = "A verificação anti-bot falhou. Tente novamente.";

export async function verifyTurnstileToken(
  token: string | null,
  remoteIp?: string | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      return { ok: true };
    }

    return { ok: false, error: "Verificação anti-bot indisponível." };
  }

  if (!token) {
    return { ok: false, error: "Confirme que você não é um robô." };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json: unknown = await response.json();
    const parsed = siteverifyResponseSchema.safeParse(json);

    if (!response.ok || !parsed.success || !parsed.data.success) {
      return { ok: false, error: FAILURE };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: FAILURE };
  }
}

export function requestClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim() ?? "";

  if (!first || first.length > 64 || /\s/.test(first)) {
    return null;
  }

  return first;
}
