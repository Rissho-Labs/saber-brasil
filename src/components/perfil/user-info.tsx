"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/lib/auth/account-actions";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function UserInfo({
  fullName,
  email,
  createdAtLabel,
  method,
}: {
  fullName: string;
  email: string;
  createdAtLabel: string;
  method: "google" | "email";
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSignOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function onPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);
    const result = await changePassword(password, confirmPassword);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPassword("");
    setConfirmPassword("");
    setMessage("Senha alterada.");
  }

  return (
    <section aria-labelledby="account-heading" className="space-y-4 rounded-xl border border-border p-6">
      <h2 id="account-heading" className="text-lg font-semibold">
        Conta
      </h2>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Nome</dt>
          <dd className="font-medium">{fullName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">E-mail</dt>
          <dd className="font-medium">{email}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Cadastro</dt>
          <dd className="font-medium">{createdAtLabel}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Acesso</dt>
          <dd className="font-medium">{method === "google" ? "Google" : "E-mail e código"}</dd>
        </div>
      </dl>

      {method === "email" ? (
        <form onSubmit={onPassword} className="grid max-w-sm gap-3">
          <div className="space-y-1">
            <label htmlFor="new-password" className="text-sm font-medium">
              Nova senha
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              Confirmar senha
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {message ? (
            <p role="status" className="text-sm text-muted-foreground">
              {message}
            </p>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Alterar senha"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          Esta conta entra com Google. A senha fica com o Google.
        </p>
      )}

      <Button type="button" variant="outline" onClick={onSignOut}>
        Sair
      </Button>
    </section>
  );
}
