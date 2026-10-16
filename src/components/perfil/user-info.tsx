"use client";

import { useState } from "react";
import { AvatarManager } from "@/components/perfil/avatar-manager";
import { EmailModal } from "@/components/perfil/email-modal";
import { PasswordModal } from "@/components/perfil/password-modal";

export function UserInfo({
  fullName,
  email,
  createdAtLabel,
  method,
  avatarUrl,
}: {
  fullName: string;
  email: string;
  createdAtLabel: string;
  method: "google" | "email";
  avatarUrl: string | null;
}) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <section aria-labelledby="account-heading" className="rounded-xl border border-border p-6">
      <h2 id="account-heading" className="text-lg font-semibold">
        Conta
      </h2>
      <div className="mt-6 flex flex-col items-start gap-6 md:flex-row md:gap-8">
        <AvatarManager avatarUrl={avatarUrl} fullName={fullName} email={email} />
        <div className="w-full min-w-0 flex-1">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="min-w-0">
              <dt className="text-muted-foreground">Nome</dt>
              <dd className="truncate font-medium">{fullName}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-muted-foreground">E-mail</dt>
              <dd className="truncate font-medium">{email}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-muted-foreground">Data de Cadastro</dt>
              <dd className="font-medium">{createdAtLabel}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-muted-foreground">Tipo de Acesso</dt>
              <dd className="font-medium">{method === "google" ? "Google" : "E-mail e código"}</dd>
            </div>
          </dl>
          <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            {method === "email" ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <PasswordModal
                    onChanged={(nextMessage) => {
                      setMessage(nextMessage);
                    }}
                  />
                  <EmailModal
                    currentEmail={email}
                    onChanged={(nextMessage) => {
                      setMessage(nextMessage);
                    }}
                  />
                </div>
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
          </div>
        </div>
      </div>
    </section>
  );
}
