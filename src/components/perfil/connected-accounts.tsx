"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { unlinkGoogle } from "@/lib/auth/identity-actions";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.6 7.1l6.3 5.3C37.4 38.4 44 33 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

const LOCKOUT_TITLE = "Função indisponível: o Google é a única forma de entrar nesta conta";

export function ConnectedAccounts({
  googleConnected,
  canUnlinkGoogle,
}: {
  googleConnected: boolean;
  canUnlinkGoogle: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<"link" | "unlink" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onLink() {
    setPending("link");
    setError(null);
    setMessage(null);
    const supabase = createBrowserSupabaseClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/perfil`;
    const { error: linkError } = await supabase.auth.linkIdentity({
      provider: "google",
      options: { redirectTo },
    });
    if (linkError) {
      const text = linkError.message.toLowerCase();
      setError(
        text.includes("manual") || text.includes("not enabled")
          ? "A conexão manual de contas ainda não está ativa no Supabase."
          : "Não foi possível conectar o Google.",
      );
      setPending(null);
    }
  }

  async function onUnlink() {
    if (!canUnlinkGoogle || pending) {
      return;
    }

    setPending("unlink");
    setError(null);
    setMessage(null);
    const result = await unlinkGoogle();
    setPending(null);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setMessage("Google desconectado.");
    router.refresh();
  }

  return (
    <section aria-labelledby="connected-heading" className="rounded-xl border border-border p-6">
      <h2 id="connected-heading" className="text-lg font-semibold">
        Contas conectadas
      </h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full border border-border bg-background">
            <GoogleMark />
          </span>
          <div>
            <p className="text-sm font-medium">Google</p>
            <p className="text-xs text-muted-foreground">
              {googleConnected ? "Conectado" : "Não conectado"}
            </p>
          </div>
        </div>
        {googleConnected ? (
          <span title={canUnlinkGoogle ? undefined : LOCKOUT_TITLE} className="inline-flex">
            <Button
              type="button"
              variant="outline"
              disabled={!canUnlinkGoogle || pending !== null}
              title={canUnlinkGoogle ? undefined : LOCKOUT_TITLE}
              onClick={() => {
                void onUnlink();
              }}
            >
              {pending === "unlink" ? "Desconectando..." : "Desconectar"}
            </Button>
          </span>
        ) : (
          <Button
            type="button"
            variant="outline"
            disabled={pending !== null}
            onClick={() => {
              void onLink();
            }}
          >
            {pending === "link" ? "Conectando..." : "Conectar"}
          </Button>
        )}
      </div>
      {message ? (
        <p role="status" className="mt-3 text-sm text-muted-foreground">
          {message}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </section>
  );
}
