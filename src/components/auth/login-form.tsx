"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { Button } from "@/components/ui/button";
import { TURNSTILE_SITE_KEY, TurnstileWidget, TurnstileWidgetHandle } from "@/components/ui/turnstile-widget";
import { assertTurnstile } from "@/lib/auth/turnstile-action";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function LoginForm({
  nextPath,
  oauthFailed = false,
}: {
  nextPath: string;
  oauthFailed?: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const busy = pending || googlePending;
  const signupHref = `/cadastro?next=${encodeURIComponent(nextPath)}`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError("Confirme a verificação anti-bot.");
      return;
    }

    setPending(true);
    setError(null);

    const turnstile = await assertTurnstile(turnstileToken);
    if (!turnstile.ok) {
      setPending(false);
      setError(turnstile.error);
      turnstileRef.current?.reset();
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setPending(false);
      setError("E-mail ou senha inválidos.");
      turnstileRef.current?.reset();
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <GoogleSignIn
        nextPath={nextPath}
        disabled={pending}
        initialError={oauthFailed ? "Não foi possível continuar com o Google." : null}
        onPendingChange={setGooglePending}
      />
      <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="login-email" className="text-sm font-medium">
          E-mail
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="login-password" className="text-sm font-medium">
          Senha
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <TurnstileWidget ref={turnstileRef} onToken={setTurnstileToken} />
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={busy}>
        {pending ? "Entrando..." : "Entrar"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href={signupHref} className="font-medium text-primary underline-offset-4 hover:underline">
          Criar conta
        </Link>
      </p>
      </form>
    </div>
  );
}
