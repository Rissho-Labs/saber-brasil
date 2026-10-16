"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { changeEmail } from "@/lib/auth/account-actions";

export function EmailModal({
  currentEmail,
  onChanged,
}: {
  currentEmail: string;
  onChanged: (message: string) => void;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function resetFields() {
    setEmail("");
    setError(null);
    setPending(false);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result = await changeEmail(email);
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    resetFields();
    closeDialog();
    onChanged("Enviamos a confirmação para o novo e-mail. Abra a mensagem e confirme a troca.");
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={openDialog}>
        Alterar e-mail
      </Button>
      <dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClose={resetFields}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
        className="fixed inset-0 z-50 m-0 flex h-dvh max-h-none w-full max-w-none items-center justify-center border-0 bg-black/50 p-4 text-foreground backdrop:bg-transparent backdrop-blur-sm [&:not([open])]:hidden"
      >
        <div className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-lg">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <h2 id={titleId} className="text-lg font-semibold">
                Alterar e-mail
              </h2>
              <p id={descriptionId} className="text-sm text-muted-foreground">
                O endereço atual é {currentEmail}. A confirmação chega no e-mail novo. Pressione Esc para fechar.
              </p>
            </div>
            <div className="space-y-1 text-left">
              <label htmlFor="next-email" className="text-sm font-medium">
                Novo e-mail
              </label>
              <input
                id="next-email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            {error ? (
              <p role="alert" className="text-left text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2 pt-4">
              <Button type="submit" disabled={pending}>
                {pending ? "Enviando..." : "Enviar confirmação"}
              </Button>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Fechar
              </Button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
