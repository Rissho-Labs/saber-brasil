import { safeNextPath } from "@/lib/auth/safe-next-path";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type BrowserSupabase = ReturnType<typeof createBrowserSupabaseClient>;

export function googleOAuthRedirectUrl(origin: string, nextPath: string): string {
  const callback = new URL("/auth/callback", origin);
  callback.searchParams.set("next", safeNextPath(nextPath));
  return callback.toString();
}

export async function signInWithGoogle(
  supabase: BrowserSupabase,
  origin: string,
  nextPath: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: googleOAuthRedirectUrl(origin, nextPath),
    },
  });

  if (error || !data.url) {
    return { ok: false, message: "Não foi possível continuar com o Google." };
  }

  return { ok: true };
}
