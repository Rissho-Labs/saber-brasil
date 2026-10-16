"use client";

import { useState } from "react";
import { PasswordModal } from "@/components/perfil/password-modal";

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
  const [message, setMessage] = useState<string | null>(null);

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
        <div className="space-y-3">
          <PasswordModal
            onChanged={(nextMessage) => {
              setMessage(nextMessage);
            }}
          />
          {message ? (
            <p role="status" className="text-sm text-muted-foreground">
              {message}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Esta conta entra com Google. A senha fica com o Google.
        </p>
      )}
    </section>
  );
}
